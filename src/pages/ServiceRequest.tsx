import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Calendar, Clock, User, Wrench, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

const ServiceRequest = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for existing requests
  const [requests] = useState([
    {
      id: "REQ-001",
      title: "Laptop Screen Repair",
      description: "MacBook Pro screen flickering and showing lines",
      priority: "high",
      status: "pending",
      createdAt: "2024-01-15",
      assignedTechnician: null,
    },
    {
      id: "REQ-002", 
      title: "Network Setup",
      description: "Configure office network for 20 computers",
      priority: "medium",
      status: "assigned",
      createdAt: "2024-01-14",
      assignedTechnician: "John Tech",
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "",
    urgency: "",
  });

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.description || !newRequest.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Service request created successfully",
      });
      setNewRequest({ title: "", description: "", priority: "", urgency: "" });
      setIsCreating(false);
    }, 1000);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "default";
      case "assigned": return "secondary";
      case "in-progress": return "default";
      case "completed": return "secondary";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading service requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Service Requests</h1>
          <p className="text-muted-foreground text-lg">
            Create and track your hardware maintenance requests with ease
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Create New Request */}
          <Card className="lg:col-span-1 card-hover border-border/40 bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <span>New Request</span>
              </CardTitle>
              <CardDescription>
                Submit a new service request for your equipment maintenance needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the problem"
                  rows={3}
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({...newRequest, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={newRequest.urgency} onValueChange={(value) => setNewRequest({...newRequest, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How urgent is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="can-wait">Can wait</SelectItem>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="asap">ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateRequest} 
                className="w-full" 
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Submit Request"}
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Existing Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Filters */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
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
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                      <div className="mb-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                      </div>
                      <div className="text-muted-foreground text-lg mb-2">No requests found</div>
                      <p className="text-sm text-muted-foreground">Try creating your first service request or adjusting your filters</p>
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
                        <div>
                          <h3 className="font-semibold text-lg">{request.title}</h3>
                          <p className="text-sm text-muted-foreground">#{request.id}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={getPriorityColor(request.priority) as any}>
                            {request.priority}
                          </Badge>
                          <Badge variant={getStatusColor(request.status) as any}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4 text-muted-foreground">
                        {request.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{request.createdAt}</span>
                          </div>
                          {request.assignedTechnician && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{request.assignedTechnician}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>2 days ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceRequest;
