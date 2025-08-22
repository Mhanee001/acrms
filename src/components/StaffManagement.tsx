import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserPlus, Search, Edit, Trash2, Shield, Users, Briefcase, HardHat, TrendingUp, Building, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  user_roles: { role: string; specialty?: string }[];
  created_at: string;
}

interface RoleStats {
  total: number;
  admin: number;
  ceo: number;
  manager: number;
  technician: number;
  sales: number;
  user: number;
}

export const StaffManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { canManageStaff } = useRoleAccess();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [roleStats, setRoleStats] = useState<RoleStats>({
    total: 0,
    admin: 0,
    ceo: 0,
    manager: 0,
    technician: 0,
    sales: 0,
    user: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  const [staffForm, setStaffForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
    specialty: ""
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          user_roles (
            role,
            specialty
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff:', error);
        return;
      }

      const staffData = data || [];
      setStaff(staffData);
      
      // Calculate role statistics
      const stats = staffData.reduce((acc, member) => {
        const role = member.user_roles[0]?.role || 'user';
        acc.total++;
        if (role in acc) {
          (acc as any)[role]++;
        }
        return acc;
      }, {
        total: 0,
        admin: 0,
        ceo: 0,
        manager: 0,
        technician: 0,
        sales: 0,
        user: 0
      });
      
      setRoleStats(stats);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStaffMember = async () => {
    try {
      // Use admin auth to create user without signing them in
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: staffForm.email,
        password: staffForm.password,
        user_metadata: {
          first_name: staffForm.first_name,
          last_name: staffForm.last_name,
          role: staffForm.role
        },
        email_confirm: true // Skip email confirmation for admin-created users
      });

      if (authError) {
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (authData.user) {
        // Create profile entry
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: staffForm.first_name,
            last_name: staffForm.last_name,
            email: staffForm.email
          });

        // Create role entry with specialty if applicable
        await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: staffForm.role as any,
            specialty: staffForm.role === 'technician' ? staffForm.specialty : null
          });

        toast({
          title: "Success", 
          description: `${staffForm.role === 'user' ? 'User' : 'Staff member'} created successfully. They can now log in with their credentials.`
        });

        setIsCreateDialogOpen(false);
        resetForm();
        fetchStaff();
      }
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to create staff member. Make sure you have admin privileges.",
        variant: "destructive"
      });
    }
  };

  const updateStaffRole = async (staffId: string, newRole: string, specialty?: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          role: newRole as any,
          specialty: specialty || null
        })
        .eq('user_id', staffId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update role",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Staff role updated successfully"
      });

      fetchStaff();
    } catch (error) {
      console.error('Error updating staff role:', error);
    }
  };

  const deleteStaffMember = async (staffId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(staffId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete staff member",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Staff member deleted successfully"
      });

      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };

  const resetForm = () => {
    setStaffForm({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "user",
      specialty: ""
    });
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const memberRole = member.user_roles[0]?.role || 'user';
    const matchesRole = roleFilter === "all" || memberRole === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'ceo': return Building;
      case 'manager': return Users;
      case 'technician': return HardHat;
      case 'sales': return TrendingUp;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'ceo': return 'default';
      case 'manager': return 'secondary';
      case 'technician': return 'outline';
      case 'sales': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="text-center">Loading staff...</div>;
  }

  if (!canManageStaff()) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg font-semibold">Access Denied</div>
        <div className="text-muted-foreground">You don't have permission to manage staff.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</p>
                <p className="text-2xl font-bold">{roleStats.total}</p>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CEO</p>
                <p className="text-2xl font-bold">{roleStats.ceo}</p>
              </div>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Admin</p>
                <p className="text-2xl font-bold">{roleStats.admin}</p>
              </div>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Manager</p>
                <p className="text-2xl font-bold">{roleStats.manager}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Technician</p>
                <p className="text-2xl font-bold">{roleStats.technician}</p>
              </div>
              <HardHat className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sales</p>
                <p className="text-2xl font-bold">{roleStats.sales}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Users</p>
                <p className="text-2xl font-bold">{roleStats.user}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">Manage team members and their roles ({roleStats.total} total members)</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User/Staff
          </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User/Staff Member</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={staffForm.first_name}
                    onChange={(e) => setStaffForm({...staffForm, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={staffForm.last_name}
                    onChange={(e) => setStaffForm({...staffForm, last_name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={staffForm.role} onValueChange={(value) => setStaffForm({...staffForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="ceo">CEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {staffForm.role === 'technician' && (
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={staffForm.specialty} onValueChange={(value) => setStaffForm({...staffForm, specialty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createStaffMember}>
                  Create {staffForm.role === 'user' ? 'User' : 'Staff Member'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="ceo">CEO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid gap-4">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No staff members found</div>
          </div>
        ) : (
          filteredStaff.map((member) => {
            const role = member.user_roles[0]?.role || 'user';
            const specialty = member.user_roles[0]?.specialty;
            const RoleIcon = getRoleIcon(role);
            
            return (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <RoleIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        {specialty && (
                          <div className="text-xs text-muted-foreground">
                            Specialty: {specialty}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleColor(role) as any}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Badge>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this staff member? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteStaffMember(member.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};