import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  UserCheck,
  Calendar,
  BarChart3,
  FileText,
  LogOut,
  Home,
  Target,
  Zap,
  TrendingUp,
  Package,
  Mail,
  ClipboardList,
  Briefcase,
  HardHat,
  Shield,
  Activity,
  Bell
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

// CRM Navigation items for different roles
const getNavigationItems = (role: string | null) => {
  const crmItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Contacts", url: "/contacts", icon: Users },
    { title: "Leads", url: "/leads", icon: Target },
    { title: "Opportunities", url: "/opportunities", icon: Zap },
    { title: "Sales Pipeline", url: "/sales-pipeline", icon: TrendingUp },
    { title: "Products", url: "/products", icon: Package },
    { title: "Reports", url: "/reports", icon: BarChart3 },
    { title: "Email Campaigns", url: "/email-campaigns", icon: Mail },
    { title: "Calendar", url: "/calendar", icon: Calendar },
  ];

  const serviceItems = [
    { title: "My Assets", url: "/my-assets", icon: Package },
    { title: "My Requests", url: "/my-requests", icon: ClipboardList },
    { title: "Service Request", url: "/service-request", icon: Wrench },
    { title: "Job Requests", url: "/job-requests", icon: Briefcase },
  ];

  const adminItems = [
    { title: "Admin Dashboard", url: "/admin-dashboard", icon: Shield },
    { title: "User Management", url: "/user-management", icon: Users },
    { title: "Activity Log", url: "/activity", icon: Activity },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ];

  switch (role) {
    case "admin":
      return [
        ...crmItems,
        ...serviceItems,
        { title: "Technician Dashboard", url: "/technician-dashboard", icon: HardHat },
        ...adminItems,
      ];
    case "technician":
      return [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Technician Dashboard", url: "/technician-dashboard", icon: HardHat },
        ...serviceItems,
        { title: "Calendar", url: "/calendar", icon: Calendar },
        { title: "Activity Log", url: "/activity", icon: Activity },
      ];
    case "sales":
      return [
        ...crmItems,
        { title: "Activity Log", url: "/activity", icon: Activity },
      ];
    case "user":
    default:
      return [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        ...serviceItems,
        { title: "Notifications", url: "/notifications", icon: Bell },
      ];
  }
};

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const currentPath = location.pathname;

  const [navigationItems, setNavigationItems] = useState(getNavigationItems(null));

  useEffect(() => {
    if (!roleLoading && role) {
      setNavigationItems(getNavigationItems(role));
    }
  }, [role, roleLoading]);

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (roleLoading) {
    return (
      <Sidebar className="animate-fade-in">
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar 
      className={`transition-all duration-300 bg-gradient-to-b from-card to-card/80 border-r border-border/40 ${
        state === "collapsed" ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center space-x-3 px-3 py-4">
          <div className="flex-shrink-0">
            <Wrench className="h-8 w-8 text-primary animate-pulse-glow" />
          </div>
          {state !== "collapsed" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gradient">Abelov</h2>
              <p className="text-xs text-muted-foreground">Hardware CRM</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`
                      rounded-lg transition-all duration-200 group
                      ${isActive(item.url) 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                        : 'hover:bg-muted/60 hover:text-foreground border border-transparent'
                      }
                      ${state === "collapsed" ? 'justify-center p-3' : 'px-3 py-2.5'}
                    `}
                  >
                    <a href={item.url} className="flex items-center w-full">
                      <item.icon 
                        className={`
                          flex-shrink-0 transition-all duration-200
                          ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                          ${state === "collapsed" ? 'h-5 w-5' : 'h-4 w-4 mr-3'}
                        `} 
                      />
                      {state !== "collapsed" && (
                        <span className="text-sm font-medium truncate">{item.title}</span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 bg-gradient-to-r from-muted/30 to-muted/10">
        {user && (
          <div className="p-3">
            {state !== "collapsed" ? (
              <div className="space-y-3">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-semibold text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role || 'user'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="w-full text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  <LogOut className="h-3 w-3 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="w-full h-10 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}