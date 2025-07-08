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
        navigate("/dashboard");
      }
    }
  }, [user, role, loading, roleLoading, navigate]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock data for available requests
  const [requests] = useState([
    {
      id: "REQ-003",
      title: "Printer Network Configuration",
      description: "Setup wireless printing for office HP LaserJet",
      priority: "medium",
      status: "available",
      createdAt: "2024-01-16",
      estimatedTime: "2-3 hours",
      location: "Downtown Office, Floor 3",
      customerName: "TechCorp Inc.",
      customerPhone: "+1 (555) 123-4567",
      urgency: "this-week"
    },
    {
      id: "REQ-004",
      title: "Server Maintenance",
      description: "Monthly server maintenance and backup verification",
      priority: "high",
      status: "available",
      createdAt: "2024-01-15",
      estimatedTime: "4-6 hours",
      location: "Data Center Building A",
      customerName: "SecureData Systems",
      customerPhone: "+1 (555) 987-6543",
      urgency: "asap"
    },
    {
      id: "REQ-005",
      title: "Workstation Setup",
      description: "Install and configure 5 new workstations with software",
      priority: "low",
      status: "assigned",
      createdAt: "2024-01-14",
      estimatedTime: "1 day",
      location: "West Campus, Building 2",
      customerName: "Creative Agency",
      customerPhone: "+1 (555) 456-7890",
      urgency: "can-wait",
      assignedTo: "current-user"
    }
  ]);

  const handleAcceptRequest = (requestId: string) => {
    toast({
      title: "Request Accepted",
      description: `You have accepted request ${requestId}`,
    });
  };

  const handleStartWork = (requestId: string) => {
    toast({
      title: "Work Started",
      description: `You have started working on request ${requestId}`,
    });
  };

  const handleCompleteWork = (requestId: string) => {
    toast({
      title: "Work Completed",
      description: `Request ${requestId} has been marked as completed`,
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter || 
                         (statusFilter === "my-tasks" && request.assignedTo === "current-user");
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
    if (assignedTo === "current-user") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    switch (status) {
      case "available": return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "assigned": return <PlayCircle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Quick stats
  const availableCount = requests.filter(r => r.status === "available").length;
  const myTasksCount = requests.filter(r => r.assignedTo === "current-user").length;
  const urgentCount = requests.filter(r => r.urgency === "asap").length;

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
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{availableCount}</p>
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
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{myTasksCount}</p>
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
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">{urgentCount}</p>
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
                      {getStatusIcon(request.status, request.assignedTo)}
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">#{request.id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={getPriorityColor(request.priority) as any}>
                        {request.priority}
                      </Badge>
                      <Badge variant={getUrgencyColor(request.urgency) as any}>
                        {request.urgency}
                      </Badge>
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
                        <span className="font-medium">{request.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{request.customerPhone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Est. {request.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{request.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {request.status === "available" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept Request
                        </Button>
                      )}
                      {request.assignedTo === "current-user" && request.status === "assigned" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStartWork(request.id)}
                        >
                          Start Work
                        </Button>
                      )}
                      {request.assignedTo === "current-user" && request.status === "in-progress" && (
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