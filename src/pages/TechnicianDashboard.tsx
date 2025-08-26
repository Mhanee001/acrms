import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Target,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const TechnicianDashboard = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) {
        navigate("/auth");
      } else if (role !== "technician") {
        navigate("/user-dashboard");
      }
    }
  }, [user, role, loading, roleLoading, navigate]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    availableCount: 0,
    myTasksCount: 0,
    urgentCount: 0
  });

  useEffect(() => {
    if (user && role === 'technician') {
      fetchRequests();
    }
  }, [user, role]);

  useEffect(() => {
    if (!user || role !== 'technician') return;

    // Subscribe to notifications for this technician
    const channel = supabase
      .channel('technician_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notif: any = payload.new;
          toast({ title: notif.title || 'New Notification', description: notif.message || 'You have a new update.' });
          // refresh requests if the notification relates to assignments
          if ((notif.title || '').toLowerCase().includes('assigned')) {
            fetchRequests();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      // Fetch requests based on assignment and pending
      let query = supabase
        .from('service_requests')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      // Show assigned to me or pending
      query = query.or(`assigned_technician_id.eq.${user.id},status.eq.pending`);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching requests:', error);
        return;
      }

      const requestsData = data || [];
      setRequests(requestsData);

      // Calculate stats
      const available = requestsData.filter(r => r.status === 'pending').length;
      const myTasks = requestsData.filter(r => r.assigned_technician_id === user.id).length;
      const urgent = requestsData.filter(r => r.priority === 'urgent' || r.priority === 'high').length;

      setStats({
        availableCount: available,
        myTasksCount: myTasks,
        urgentCount: urgent
      });

    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status: 'assigned', 
          assigned_technician_id: user?.id 
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'accept_request',
        description: `Accepted service request`,
        entity_type: 'service_request',
        entity_id: requestId
      });

      toast({
        title: "Request Accepted",
        description: `You have accepted request ${requestId}`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive"
      });
    }
  };

  const handleStartWork = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'in_progress' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Work Started",
        description: `You have started working on request ${requestId}`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error starting work:', error);
    }
  };

  const handleCompleteWork = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Work Completed",
        description: `Request ${requestId} has been marked as completed`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error completing work:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter || 
                         (statusFilter === "my-tasks" && request.assigned_technician_id === user?.id);
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "asap": return "destructive";
      case "this-week": return "default";
      case "can-wait": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string, assignedTo?: string) => {
    if (assignedTo === user?.id) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    switch (status) {
      case "pending": return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "assigned": return <PlayCircle className="h-4 w-4 text-orange-500" />;
      case "in_progress": return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading technician dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== "technician") {
    return null;
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Technician Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your assigned tasks and view available service requests
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover animate-scale-in bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Available Requests</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.availableCount}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Ready to accept
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
                  <AlertCircle className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">My Active Tasks</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.myTasksCount}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    In progress
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-200 dark:bg-green-800">
                  <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Urgent Requests</p>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.urgentCount}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Needs attention
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-200 dark:bg-red-800">
                  <Target className="h-6 w-6 text-red-700 dark:text-red-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Est. Work Today</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">8.5h</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Time allocated
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-800">
                  <Clock className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-6 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="my-tasks">My Tasks</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Requests List */}
        <div className="grid gap-4">
          {filteredRequests.length === 0 ? (
            <Card className="border-border/40 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-lg">No requests found</div>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request, index) => (
              <Card 
                key={request.id} 
                className="card-hover animate-scale-in border-border/40 bg-gradient-to-r from-card to-card/80 hover:shadow-lg transition-all duration-300" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status, request.assigned_technician_id)}
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">#{request.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getPriorityColor(request.priority) as any}>
                        {request.priority}
                      </Badge>
                      {request.required_specialty && (
                        <Badge variant="outline">
                          {request.required_specialty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4 text-muted-foreground">
                    {request.description}
                  </p>

                  {/* Customer & Location Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {request.profiles?.first_name} {request.profiles?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{request.profiles?.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {request.location && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                      )}
                      {request.estimated_duration && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Est. {request.estimated_duration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {request.status === "pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept Request
                        </Button>
                      )}
                      {request.assigned_technician_id === user?.id && request.status === "assigned" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStartWork(request.id)}
                        >
                          Start Work
                        </Button>
                      )}
                      {request.assigned_technician_id === user?.id && request.status === "in_progress" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCompleteWork(request.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TechnicianDashboard;