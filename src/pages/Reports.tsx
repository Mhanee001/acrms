import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Wrench,
  Package,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

interface ReportsData {
  totalUsers: number;
  totalRequests: number;
  totalAssets: number;
  completedRequests: number;
  pendingRequests: number;
  urgentRequests: number;
  totalActivityLogs: number;
  monthlyStats: Array<{
    month: string;
    requests: number;
    completed: number;
    assets_created: number;
  }>;
  topUsers: Array<{
    name: string;
    email: string;
    role: string;
    requests_count: number;
    assets_count: number;
  }>;
}

const Reports = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [reportsData, setReportsData] = useState<ReportsData>({
    totalUsers: 0,
    totalRequests: 0,
    totalAssets: 0,
    completedRequests: 0,
    pendingRequests: 0,
    urgentRequests: 0,
    totalActivityLogs: 0,
    monthlyStats: [],
    topUsers: []
  });

  useEffect(() => {
    if (user && (role === 'admin' || role === 'manager' || role === 'ceo')) {
      fetchReportsData();
    }
  }, [user, role, timeRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        usersResult,
        requestsResult,
        assetsResult,
        activityResult,
        monthlyStatsResult,
        topUsersResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('service_requests').select('*'),
        supabase.from('assets').select('*'),
        supabase.from('activity_logs').select('*', { count: 'exact', head: true }),
        fetchMonthlyStats(),
        fetchTopUsers()
      ]);

      // Process requests data
      const requests = requestsResult.data || [];
      const completedRequests = requests.filter(r => r.status === 'completed').length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const urgentRequests = requests.filter(r => r.priority === 'urgent').length;

      setReportsData({
        totalUsers: usersResult.count || 0,
        totalRequests: requests.length,
        totalAssets: assetsResult.data?.length || 0,
        completedRequests,
        pendingRequests,
        urgentRequests,
        totalActivityLogs: activityResult.count || 0,
        monthlyStats: monthlyStatsResult,
        topUsers: topUsersResult
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyStats = async () => {
    // Get last 6 months of data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: requests } = await supabase
      .from('service_requests')
      .select('created_at, status')
      .gte('created_at', sixMonthsAgo.toISOString());

    const { data: assets } = await supabase
      .from('assets')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());

    // Group by month
    const monthlyData: { [key: string]: { requests: number; completed: number; assets_created: number } } = {};
    
    // Process requests
    requests?.forEach(request => {
      const month = new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { requests: 0, completed: 0, assets_created: 0 };
      }
      monthlyData[month].requests++;
      if (request.status === 'completed') {
        monthlyData[month].completed++;
      }
    });

    // Process assets
    assets?.forEach(asset => {
      const month = new Date(asset.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { requests: 0, completed: 0, assets_created: 0 };
      }
      monthlyData[month].assets_created++;
    });

    return Object.entries(monthlyData).map(([month, stats]) => ({
      month,
      ...stats
    })).slice(-6);
  };

  const fetchTopUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        id, first_name, last_name, email,
        user_roles(role)
      `);

    if (!profiles) return [];

    const usersWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const [requestsResult, assetsResult] = await Promise.all([
          supabase
            .from('service_requests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id),
          supabase
            .from('assets')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
        ]);

        return {
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
          email: profile.email,
          role: profile.user_roles?.[0]?.role || 'user',
          requests_count: requestsResult.count || 0,
          assets_count: assetsResult.count || 0
        };
      })
    );

    return usersWithStats
      .filter(user => user.requests_count > 0 || user.assets_count > 0)
      .sort((a, b) => (b.requests_count + b.assets_count) - (a.requests_count + a.assets_count))
      .slice(0, 10);
  };

  const exportReportsData = () => {
    const dataToExport = {
      ...reportsData,
      exported_at: new Date().toISOString(),
      exported_by: user?.email
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Reports data exported successfully"
    });
  };

  if (role !== 'admin' && role !== 'manager' && role !== 'ceo') {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only Admin, Manager, and CEO users can access reports.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center">Loading reports data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Reports & Analytics</h2>
            <p className="text-muted-foreground">Track performance and analyze real-time data</p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReportsData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                {reportsData.pendingRequests} pending, {reportsData.completedRequests} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalAssets}</div>
              <p className="text-xs text-muted-foreground">
                Managed assets
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity Logs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.totalActivityLogs}</div>
              <p className="text-xs text-muted-foreground">
                {reportsData.urgentRequests} urgent requests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Requests and assets activity by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.monthlyStats.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{month.month}</h3>
                      <p className="text-sm text-muted-foreground">{month.requests} requests, {month.assets_created} assets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {month.completed} completed
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {month.requests > 0 ? Math.round((month.completed / month.requests) * 100) : 0}% completion rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
            <CardDescription>Users with highest activity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.topUsers.map((user, index) => (
                <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="font-semibold">{user.requests_count} requests</div>
                      <div className="text-sm text-muted-foreground">{user.assets_count} assets</div>
                    </div>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;