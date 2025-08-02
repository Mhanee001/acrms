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
      <div className="p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">
            Here's an overview of your service requests and account activity.
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover animate-scale-in bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Requests</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.activeRequests}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Current requests
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
                  <Wrench className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Completed Jobs</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completedJobs}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    This month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-200 dark:bg-green-800">
                  <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending Reviews</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.pendingReviews}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Awaiting feedback
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-200 dark:bg-orange-800">
                  <AlertTriangle className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover animate-scale-in bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(stats.totalSpent)}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    This year
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-200 dark:bg-purple-800">
                  <DollarSign className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;