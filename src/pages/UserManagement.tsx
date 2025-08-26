import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield,
  User,
  Wrench,
  TrendingUp,
  Building,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  created_at: string;
  user_roles?: {
    role: string;
  }[];
}

const UserManagement = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (user && role === 'admin') {
      fetchUsers();
    }
  }, [user, role]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: newRole as any }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update user role",
          variant: "destructive"
        });
        return;
      }

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'update_user_role',
        description: `Updated user role to ${newRole}`,
        entity_type: 'user',
        entity_id: userId
      });

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setSelectedRole(user.user_roles?.[0]?.role || 'user');
    setIsEditDialogOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = user.user_roles?.[0]?.role || 'user';
    const matchesRole = roleFilter === "all" || userRole === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-red-500" />;
      case 'ceo': return <Building className="h-4 w-4 text-purple-500" />;
      case 'manager': return <BarChart3 className="h-4 w-4 text-blue-500" />;
      case 'technician': return <Wrench className="h-4 w-4 text-blue-500" />;
      case 'sales': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <User className="h-4 w-4 text-green-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'ceo': return 'default';
      case 'manager': return 'secondary';
      case 'technician': return 'outline';
      case 'sales': return 'default';
      default: return 'secondary';
    }
  };

  if (role !== 'admin') {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only administrators can access user management.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6">
          <div className="text-center">Loading users...</div>
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
            <h1 className="text-4xl font-bold text-gradient">User Management</h1>
            <p className="text-muted-foreground text-lg">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground text-lg">No users found</div>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((userProfile) => {
              const userRole = userProfile.user_roles?.[0]?.role || 'user';
              return (
                <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full font-semibold">
                          {userProfile.first_name?.[0] || userProfile.email[0].toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">
                              {userProfile.first_name} {userProfile.last_name} 
                              {!userProfile.first_name && !userProfile.last_name && 'Unnamed User'}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(userRole)}
                              <Badge variant={getRoleColor(userRole) as any}>
                                {userRole}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(userProfile)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>
                Update the user's role and permissions
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label>User</Label>
                  <p className="text-sm font-medium">
                    {editingUser.first_name} {editingUser.last_name} ({editingUser.email})
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => updateUserRole(editingUser.id, selectedRole)}>
                    Update Role
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default UserManagement;