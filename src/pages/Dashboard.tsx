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
import { formatCurrency } from "@/lib/currency";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC OR EARLY RETURNS
  // Real-time dashboard data will be fetched from the database
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedJobs: 0,
    pendingReviews: 0,
    totalSpent: 0
  });

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
          // Admins stay on this dashboard
          break;
        case "technician":
          navigate("/technician-dashboard");
          break;
        default:
          navigate("/user-dashboard");
          break;
      }
    }
  }, [role, roleLoading, user, navigate]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch active requests
        const { data: activeRequestsData } = await supabase
          .from('service_requests')
          .select('id')
          .eq('user_id', user.id)
          .in('status', ['pending', 'assigned', 'in_progress']);

        // Fetch completed jobs
        const { data: completedJobsData } = await supabase
          .from('service_requests')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        // Fetch pending reviews (completed but no feedback)
        const { data: pendingReviewsData } = await supabase
          .from('service_requests')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .is('completed_at', null);

        setStats({
          activeRequests: activeRequestsData?.length || 0,
          completedJobs: completedJobsData?.length || 0,
          pendingReviews: pendingReviewsData?.length || 0,
          totalSpent: 0 // This could be calculated based on service costs if available
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  // CONDITIONAL RENDERING AFTER ALL HOOKS ARE CALLED
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


  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen gradient-mesh">
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
            <div className="relative bg-card/60 backdrop-blur-sm rounded-3xl p-8 border border-border/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-3 animate-fade-in-up">
                  <h1 className="text-5xl font-bold text-gradient">Welcome back!</h1>
                  <p className="text-muted-foreground text-xl max-w-2xl">
                    Here's a comprehensive overview of your service requests and account activity.
                  </p>
                </div>
                <div className="hidden lg:block animate-float">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
                    <BarChart3 className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group perspective-card animate-scale-in hover-float glass-card border-0 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
              <CardContent className="card-3d relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-600/80 dark:text-blue-400/80 uppercase tracking-wider">Active</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">{stats.activeRequests}</p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Requests</p>
                  <p className="text-xs text-blue-500/70 dark:text-blue-400/70 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Currently in progress
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group perspective-card animate-scale-in hover-float glass-card border-0 shadow-xl overflow-hidden" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5"></div>
              <CardContent className="card-3d relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-600/80 dark:text-green-400/80 uppercase tracking-wider">Complete</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">{stats.completedJobs}</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed Jobs</p>
                  <p className="text-xs text-green-500/70 dark:text-green-400/70 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Successfully finished
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group perspective-card animate-scale-in hover-float glass-card border-0 shadow-xl overflow-hidden" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5"></div>
              <CardContent className="card-3d relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-all duration-300">
                    <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-orange-600/80 dark:text-orange-400/80 uppercase tracking-wider">Pending</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-orange-700 dark:text-orange-300">{stats.pendingReviews}</p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending Reviews</p>
                  <p className="text-xs text-orange-500/70 dark:text-orange-400/70 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Awaiting feedback
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group perspective-card animate-scale-in hover-float glass-card border-0 shadow-xl overflow-hidden" style={{ animationDelay: '300ms' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
              <CardContent className="card-3d relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300">
                    <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider">Total</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(stats.totalSpent)}</p>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Spent</p>
                  <p className="text-xs text-purple-500/70 dark:text-purple-400/70 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    This year
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Card className="glass-card border-0 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardHeader className="relative pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest updates from your account</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-muted-foreground">System running smoothly</p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-sm text-muted-foreground">Dashboard loaded successfully</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5"></div>
              <CardHeader className="relative pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Quick Stats</span>
                </CardTitle>
                <CardDescription>Performance metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-green-600 font-medium">Fast</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/60 backdrop-blur-sm">
                    <span className="text-sm font-medium">System Status</span>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;