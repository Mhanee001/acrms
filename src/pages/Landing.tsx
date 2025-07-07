import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Shield, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                Abelov
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary-foreground to-primary bg-clip-text text-transparent">
              Professional Hardware Maintenance Solutions
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your hardware maintenance operations with our comprehensive CRM platform. 
              Manage customers, track repairs, and optimize your technician workflow all in one place.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button size="lg" asChild className="group">
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose Abelov?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for hardware maintenance companies, our platform provides everything you need to grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive customer profiles with service history, contact information, and maintenance schedules.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Service Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track repair jobs, maintenance tasks, and service requests from creation to completion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Efficient technician scheduling with calendar integration and automated notifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure role-based access for admins, technicians, and staff with customizable permissions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of hardware maintenance companies that trust Abelov to streamline their operations.
            </p>
            <Button size="lg" asChild className="group">
              <Link to="/auth?mode=signup">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="font-semibold">Abelov</span>
          </div>
          <p>&copy; 2024 Abelov. All rights reserved. Professional hardware maintenance solutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;