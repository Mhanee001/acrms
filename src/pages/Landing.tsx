import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Shield, Clock, Users, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Manager, TechFix",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&q=80",
    quote:
      "ACRMS transformed our workflow. Our technicians are more efficient and our customers are happier than ever!",
    rating: 5,
  },
  {
    name: "Michael Lee",
    role: "CEO, RepairPro",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&q=80",
    quote:
      "The scheduling and tracking features are a game changer. Highly recommended for any maintenance business.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Lead Technician, FixItAll",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256&q=80",
    quote:
      "Role management and notifications keep our team organized. ACRMS is the best platform we've used.",
    rating: 5,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                               
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                ACRMS
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

      {/* Hero Section with Unsplash Image */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1500&q=80"
          alt="Hardware Maintenance Hero"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent z-10" />
        <div className="relative z-20 text-center text-white px-4 w-full">
          <h2 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Professional Hardware Maintenance Solutions
          </h2>
          <p className="text-xl mb-8 leading-relaxed drop-shadow">
            Streamline your hardware maintenance operations with our comprehensive CRM platform. <br />
            Manage customers, track repairs, and optimize your technician workflow all in one place.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" asChild className="group bg-primary/90 hover:bg-primary">
              <Link to="/auth?mode=signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-white/80 text-primary border-primary/30 hover:bg-white">
              <Link to="/auth">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose ACRMS?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for hardware maintenance companies, our platform provides everything you need to grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow bg-white/90">
              <CardHeader>
                <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=128&q=80" alt="Customer Management" className="mx-auto w-16 h-16 rounded-full object-cover mb-4 shadow" />
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive customer profiles with service history, contact information, and maintenance schedules.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow bg-white/90">
              <CardHeader>
                <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=128&q=80" alt="Service Tracking" className="mx-auto w-16 h-16 rounded-full object-cover mb-4 shadow" />
                <CardTitle>Service Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track repair jobs, maintenance tasks, and service requests from creation to completion.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow bg-white/90">
              <CardHeader>
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=128&q=80" alt="Scheduling" className="mx-auto w-16 h-16 rounded-full object-cover mb-4 shadow" />
                <CardTitle>Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Efficient technician scheduling with calendar integration and automated notifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow bg-white/90">
              <CardHeader>
                <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=128&q=80" alt="Role Management" className="mx-auto w-16 h-16 rounded-full object-cover mb-4 shadow" />
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-white via-secondary/10 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">What Our Clients Say</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how ACRMS
               is making a difference for hardware maintenance businesses.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6 text-center shadow-lg hover:shadow-2xl transition-shadow bg-white/95">
                <img src={t.image} alt={t.name} className="mx-auto w-20 h-20 rounded-full object-cover mb-4 border-4 border-primary/20" />
                <CardTitle className="mb-1">{t.name}</CardTitle>
                <div className="text-sm text-muted-foreground mb-2">{t.role}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <CardDescription className="italic">"{t.quote}"</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of hardware maintenance companies that trust ACRMS to streamline their operations.
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
      {/* <footer className="border-t border-border/40 py-8 px-4 bg-white/80">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="font-semibold">ACRMS</span>
          </div>
          <p>&copy; 2024 ACRMS. All rights reserved. Professional hardware maintenance solutions.</p>
        </div>
      </footer> */}
       
       <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold">ACRMS</span>
              </div>
              <p className="text-slate-400">
                Professional hardware maintenance solutions for growing businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400">&copy; 2024 ACRMS. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;