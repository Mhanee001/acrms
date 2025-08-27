 
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Wrench, 
  Package, 
  Activity, 
  Bell, 
  TrendingUp, 
  BarChart3,
  Download,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

interface DashboardStats {
  totalUsers: number;
  totalRequests: number;
  totalAssets: number;
  pendingRequests: number;
  completedRequests: number;
  activeAssets: number;
  maintenanceAssets: number;
  totalNotifications: number;
  unreadNotifications: number;
}

interface ServiceRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  user: { first_name: string; last_name: string; email: string };
  assigned_technician: { first_name: string; last_name: string } | null;
}

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  status: string;
  location: string | null;
  purchase_date: string | null;
  warranty_expires: string | null;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  position: string | null;
  company: string | null;
  created_at: string;
  role: string;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
  user: { first_name: string; last_name: string };
}

const ExecutiveDashboard = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRequests: 0,
    totalAssets: 0,
    pendingRequests: 0,
    completedRequests: 0,
    activeAssets: 0,
    maintenanceAssets: 0,
    totalNotifications: 0,
    unreadNotifications: 0
  });
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (user && (role === 'ceo' || role === 'manager')) {
      fetchDashboardData();
    }
  }, [user, role, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      await Promise.all([
        fetchUserStats(),
        fetchRequestStats(),
        fetchAssetStats(),
        fetchNotificationStats(),
        fetchServiceRequests(),
        fetchAssets(),
        fetchUsers(),
        fetchActivityLogs()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!error && count !== null) {
      setStats(prev => ({ ...prev, totalUsers: count }));
    }
  };

  const fetchRequestStats = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*');

    if (!error && data) {
      const total = data.length;
      const pending = data.filter(req => req.status === 'pending').length;
      const completed = data.filter(req => req.status === 'completed').length;

      setStats(prev => ({ 
        ...prev, 
        totalRequests: total,
        pendingRequests: pending,
        completedRequests: completed
      }));
    }
  };

  const fetchAssetStats = async () => {
    const { data, error } = await supabase
      .from('assets')
      .select('*');

    if (!error && data) {
      const total = data.length;
      const active = data.filter(asset => asset.status === 'active').length;
      const maintenance = data.filter(asset => asset.status === 'maintenance').length;

      setStats(prev => ({ 
        ...prev, 
        totalAssets: total,
        activeAssets: active,
        maintenanceAssets: maintenance
      }));
    }
  };

  const fetchNotificationStats = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*');

    if (!error && data) {
      const total = data.length;
      const unread = data.filter(notif => !notif.read).length;

      setStats(prev => ({ 
        ...prev, 
        totalNotifications: total,
        unreadNotifications: unread
      }));
    }
  };

  const fetchServiceRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        user:profiles!fk_service_requests_user_id(first_name, last_name, email),
        assigned_technician:profiles!fk_service_requests_assigned_technician_id(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setServiceRequests(data);
    }
  };

  const fetchAssets = async () => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setAssets(data);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const usersWithRoles = data.map(user => ({
        ...user,
        role: user.user_roles?.[0]?.role || 'user'
      }));
      setUsers(usersWithRoles);
    }
  };

  const fetchActivityLogs = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:profiles!fk_activity_logs_user_id(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      setActivityLogs(data);
    }
  };

  const exportData = async (dataType: string) => {
    try {
      let data: any[] = [];
      let filename = '';

      switch (dataType) {
        case 'users':
          data = users;
          filename = `users_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'requests':
          data = serviceRequests;
          filename = `service_requests_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'assets':
          data = assets;
          filename = `assets_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
        case 'activity':
          data = activityLogs;
          filename = `activity_logs_export_${new Date().toISOString().split('T')[0]}.json`;
          break;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${dataType} data exported successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'default';
      case 'pending':
      case 'maintenance':
        return 'secondary';
      case 'inactive':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (role !== 'ceo' && role !== 'manager') {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only CEO and Manager users can access this dashboard.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center">Loading executive dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Executive Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive overview of organizational data and performance metrics
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={dateRange} onValueChange={setDateRange}>
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
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingRequests} pending
                  </p>
                </div>
                <Wrench className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                  <p className="text-2xl font-bold">{stats.totalAssets}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeAssets} active
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                  <p className="text-2xl font-bold">{stats.totalNotifications}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.unreadNotifications} unread
                  </p>
                </div>
                <Bell className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.description}</p>
                          <p className="text-xs text-muted-foreground">
                            by {log.user.first_name} {log.user.last_name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Request Completion Rate</span>
                      <span className="text-lg font-bold">
                        {stats.totalRequests > 0 
                          ? Math.round((stats.completedRequests / stats.totalRequests) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Asset Utilization</span>
                      <span className="text-lg font-bold">
                        {stats.totalAssets > 0 
                          ? Math.round((stats.activeAssets / stats.totalAssets) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maintenance Items</span>
                      <span className="text-lg font-bold text-orange-600">
                        {stats.maintenanceAssets}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Service Requests</CardTitle>
                  <Button onClick={() => exportData('requests')} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {request.user.first_name} {request.user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.assigned_technician 
                            ? `Assigned to: ${request.assigned_technician.first_name} ${request.assigned_technician.last_name}`
                            : 'Unassigned'
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Asset Inventory</CardTitle>
                  <Button onClick={() => exportData('assets')} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {asset.asset_type} | Location: {asset.location || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Purchase: {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                        {asset.warranty_expires && (
                          <Badge variant={new Date(asset.warranty_expires) < new Date() ? 'destructive' : 'default'}>
                            {new Date(asset.warranty_expires) < new Date() ? 'Warranty Expired' : 'Under Warranty'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <Button onClick={() => exportData('users')} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userProfile) => (
                    <div key={userProfile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {userProfile.first_name} {userProfile.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Position: {userProfile.position || 'Not specified'} | 
                          Company: {userProfile.company || 'Not specified'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{userProfile.role}</Badge>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Activity Logs</CardTitle>
                  <Button onClick={() => exportData('activity')} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{log.action}</h3>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                        <p className="text-sm text-muted-foreground">
                          by {log.user.first_name} {log.user.last_name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExecutiveDashboard;