import { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technician Dashboard</h1>
          <p className="text-muted-foreground">
            View and manage available service requests
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{availableCount}</div>
              <div className="text-sm text-muted-foreground">Available Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{myTasksCount}</div>
              <div className="text-sm text-muted-foreground">My Active Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <div className="text-sm text-muted-foreground">Urgent Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">8.5h</div>
              <div className="text-sm text-muted-foreground">Est. Work Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
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

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No requests found</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="card-hover animate-scale-in">
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
      </main>
    </div>
  );
};

export default TechnicianDashboard;