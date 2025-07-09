import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Wrench, 
  Calendar,
  DollarSign,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Layout } from "@/components/Layout";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Role-based redirection
    if (!roleLoading && role && user) {
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "technician":
          navigate("/technician-dashboard");
          break;
        default:
          // Stay on general dashboard for users
          break;
      }
    }
  }, [role, roleLoading, user, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for user dashboard
  const userStats = [
    {
      title: "Active Requests",
      value: "3",
      change: "+1 from last week",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      title: "Completed Jobs",
      value: "12",
      change: "+3 from last month",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Pending Reviews",
      value: "2",
      change: "No change",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Total Spent",
      value: "$2,840",
      change: "+$320 from last month",
      icon: DollarSign,
      color: "text-purple-600"
    }
  ];

  const recentRequests = [
    {
      id: "REQ-001",
      title: "Laptop Screen Repair",
      status: "in-progress",
      technician: "Sarah Johnson",
      priority: "high",
      date: "2024-01-15"
    },
    {
      id: "REQ-002",
      title: "Network Configuration",
      status: "pending",
      technician: null,
      priority: "medium",
      date: "2024-01-14"
    },
    {
      id: "REQ-003",
      title: "Server Maintenance",
      status: "completed",
      technician: "John Smith",
      priority: "low",
      date: "2024-01-13"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      case "pending": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">
            Here's an overview of your service requests and account activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat, index) => (
            <Card key={stat.title} className="card-hover animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Requests */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Recent Service Requests</span>
                  </CardTitle>
                  <CardDescription>Track the status of your submitted requests</CardDescription>
                </div>
                <a href="/service-request" className="text-sm text-primary hover:underline">
                  View all
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{request.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>#{request.id}</span>
                        <span>{request.date}</span>
                        {request.technician && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {request.technician}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {request.status === "in-progress" && <Activity className="h-5 w-5 text-blue-600" />}
                      {request.status === "pending" && <Clock className="h-5 w-5 text-orange-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a 
                href="/service-request" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Create New Request</h4>
                  <p className="text-sm text-muted-foreground">Submit a service request</p>
                </div>
              </a>

              <a 
                href="/schedule" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">View Schedule</h4>
                  <p className="text-sm text-muted-foreground">Check upcoming appointments</p>
                </div>
              </a>

              <a 
                href="/profile" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Update Profile</h4>
                  <p className="text-sm text-muted-foreground">Manage account settings</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;