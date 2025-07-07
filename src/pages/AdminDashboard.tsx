import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Settings, 
  Calendar, 
  BarChart3,
  Search,
  Filter,
  UserPlus,
  UserX,
  UserCog,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Mock data
  const [users] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@abelov.com",
      role: "technician",
      status: "active",
      lastActive: "2024-01-16",
      tasksAssigned: 3,
      tasksCompleted: 15
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah.j@abelov.com",
      role: "technician",
      status: "active",
      lastActive: "2024-01-16",
      tasksAssigned: 2,
      tasksCompleted: 22
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.w@client.com",
      role: "user",
      status: "active",
      lastActive: "2024-01-15",
      tasksAssigned: 0,
      tasksCompleted: 0
    }
  ]);

  const [requests] = useState([
    {
      id: "REQ-001",
      title: "Laptop Screen Repair",
      customerName: "TechCorp Inc.",
      priority: "high",
      status: "pending",
      assignedTo: null,
      createdAt: "2024-01-15",
      estimatedTime: "2-3 hours"
    },
    {
      id: "REQ-002",
      title: "Network Setup", 
      customerName: "Creative Agency",
      priority: "medium",
      status: "assigned",
      assignedTo: "John Smith",
      createdAt: "2024-01-14",
      estimatedTime: "4-6 hours"
    },
    {
      id: "REQ-003",
      title: "Server Maintenance",
      customerName: "SecureData Systems", 
      priority: "high",
      status: "in-progress",
      assignedTo: "Sarah Johnson",
      createdAt: "2024-01-13",
      estimatedTime: "1 day"
    }
  ]);

  const [technicians] = useState([
    { id: "1", name: "John Smith", available: true, currentTasks: 3 },
    { id: "2", name: "Sarah Johnson", available: false, currentTasks: 2 },
    { id: "3", name: "Mike Davis", available: true, currentTasks: 1 }
  ]);

  const handleAssignRequest = (requestId: string, technicianId: string) => {
    const technician = technicians.find(t => t.id === technicianId);
    toast({
      title: "Request Assigned",
      description: `Request ${requestId} has been assigned to ${technician?.name}`,
    });
  };

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "User Status Updated",
      description: `User status has been changed to ${newStatus}`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerName.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Quick stats
  const totalUsers = users.length;
  const activeTechnicians = users.filter(u => u.role === "technician" && u.status === "active").length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;
  const inProgressRequests = requests.filter(r => r.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, assign tasks, and oversee operations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{activeTechnicians}</div>
              <div className="text-sm text-muted-foreground">Active Technicians</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingRequests}</div>
              <div className="text-sm text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{inProgressRequests}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
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

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="card-hover animate-scale-in">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">#{request.id} • {request.customerName}</p>
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{request.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{request.estimatedTime}</span>
                        </div>
                        {request.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{request.assignedTo}</span>
                          </div>
                        )}
                      </div>
                      
                      {request.status === "pending" && (
                        <div className="flex items-center space-x-2">
                          <Select onValueChange={(value) => handleAssignRequest(request.id, value)}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Assign to technician" />
                            </SelectTrigger>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  {tech.name} ({tech.currentTasks} tasks)
                                  {!tech.available && " - Busy"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">Users</SelectItem>
                        <SelectItem value="technician">Technicians</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="card-hover animate-scale-in">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {user.role === "technician" && (
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">Active Tasks</div>
                          <div className="text-2xl font-bold text-orange-600">{user.tasksAssigned}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Completed Tasks</div>
                          <div className="text-2xl font-bold text-green-600">{user.tasksCompleted}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Last active: {user.lastActive}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Select onValueChange={(value) => handleUserStatusChange(user.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activate">Activate</SelectItem>
                            <SelectItem value="deactivate">Deactivate</SelectItem>
                            <SelectItem value="suspend">Suspend</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    +2.1% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    -0.3h from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.2 from last month
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Key metrics and trends for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Analytics charts would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;