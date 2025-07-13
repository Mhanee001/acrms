import { useEffect, useState } from "react";
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

  // Real-time dashboard data will be fetched from the database
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedJobs: 0,
    pendingReviews: 0,
    totalSpent: 0
  });

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // This will be replaced with real data from the database
        // For now showing empty state
        setStats({
          activeRequests: 0,
          completedJobs: 0,
          pendingReviews: 0,
          totalSpent: 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);


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

        {/* Quick Actions - User Dashboard Only */}
        <div className="grid gap-8">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Access your most common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="/service-request" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Create Request</h4>
                  <p className="text-sm text-muted-foreground">Submit new service request</p>
                </div>
              </a>

              <a 
                href="/my-requests" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Activity className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">My Requests</h4>
                  <p className="text-sm text-muted-foreground">View your service requests</p>
                </div>
              </a>

              <a 
                href="/my-assets" 
                className="flex items-center p-4 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group"
              >
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <BarChart3 className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">My Assets</h4>
                  <p className="text-sm text-muted-foreground">Manage your assets</p>
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