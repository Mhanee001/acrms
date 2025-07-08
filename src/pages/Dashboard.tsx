import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, LogOut, Users, Settings, Calendar, Plus, Monitor } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Mock: Number of requests made by the user
  const requestsMade = 3;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 border-r border-border/30 flex flex-col py-8 px-4 min-h-screen shadow-lg sticky top-0 z-40">
        <div className="flex items-center space-x-2 mb-10">
          <Wrench className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">ACRMS</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-primary/10 font-medium transition">Dashboard</Link>
          <Link to="/servicerequest" className="block px-4 py-2 rounded-lg hover:bg-primary/10 font-medium transition">Make Request</Link>
          <Link to="/devices" className="block px-4 py-2 rounded-lg hover:bg-primary/10 font-medium transition">Devices</Link>
        </nav>
        <div className="mt-auto pt-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="w-full">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Track your requests and manage your devices.</p>
          </div>
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link to="/servicerequest">
              <Plus className="h-5 w-5" /> Request Repair
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Requests Made</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-primary text-center">{requestsMade}</CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-primary text-center">2</CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Completed Repairs</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-primary text-center">1</CardContent>
          </Card>
        </div>

        {/* Welcome or additional dashboard content can go here */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your ACRMS Dashboard</CardTitle>
              <CardDescription>Use the sidebar to make a repair request or view your devices.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Stay on top of your hardware maintenance with ACRMS.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;