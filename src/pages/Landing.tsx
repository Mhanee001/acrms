import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Wrench, Shield, Clock, Users, ArrowRight, Star } from "lucide-react";

import { Wrench, Shield, Clock, Users, ArrowRight, CheckCircle, Star, TrendingUp, Zap } from "lucide-react";

import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-hardware-maintenance.jpg";
import serviceImage from "@/assets/service-excellence.jpg";
import datacenterImage from "@/assets/datacenter-modern.jpg";
import teamImage from "@/assets/professional-team.jpg";

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
    <div className="min-h-screen hero-bg">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-morphism border-b border-border/20">
        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                               
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                ACRMS

          <div className="flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse-glow">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gradient">
                Abelov

              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">About</a>
              <a href="#services" className="text-foreground/80 hover:text-primary transition-colors">Services</a>
              <a href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">Reviews</a>
              <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover-glow">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="hover-float animate-pulse-glow">
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional hardware maintenance" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{animationDelay: '1s'}}>
          <div className="w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="text-gradient">Professional</span><br />
                <span className="text-foreground">Hardware Maintenance</span><br />
                <span className="text-gradient">Solutions</span>
              </h2>
            </div>
            
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                Transform your hardware maintenance operations with our cutting-edge CRM platform. 
                Streamline workflows, enhance customer relationships, and boost technician productivity.
              </p>
            </div>
            
            <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6" style={{animationDelay: '0.4s'}}>
              <Button size="lg" asChild className="group hover-float text-lg px-8 py-4">
                <Link to="/auth?mode=signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-glow text-lg px-8 py-4">
                <Link to="/auth">Login to Dashboard</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="animate-fade-in-up mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto" style={{animationDelay: '0.6s'}}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Companies Trust Us</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <img 
                src={serviceImage} 
                alt="Service Excellence" 
                className="rounded-2xl shadow-2xl hover-float"
              />
            </div>
            <div className="animate-slide-in-right">
              <h3 className="text-4xl font-bold mb-6 text-gradient">
                Redefining Hardware Maintenance Excellence
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With over a decade of experience in the industry, Abelov has become the trusted partner 
                for companies seeking reliable, efficient, and scalable hardware maintenance solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-lg">Industry-leading response times</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-lg">Certified technician network</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-lg">Advanced diagnostic tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span className="text-lg">Proactive maintenance programs</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 px-4 gradient-mesh">
        <div className="container mx-auto">

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose ACRMS?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for hardware maintenance companies, our platform provides everything you need to grow your business.

          <div className="text-center mb-20 animate-fade-in-up">
            <h3 className="text-5xl font-bold mb-6 text-gradient">
              Powerful Features for Modern Businesses
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform combines cutting-edge technology with intuitive design 
              to deliver unmatched value for hardware maintenance companies.

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

            <div className="perspective-card">
              <Card className="card-3d text-center hover-float glass-card border-0 bg-card/50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 animate-pulse-glow">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Customer Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Comprehensive customer profiles with service history, contact information, and maintenance schedules.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="perspective-card">
              <Card className="card-3d text-center hover-float glass-card border-0 bg-card/50" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 animate-pulse-glow">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Service Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Track repair jobs, maintenance tasks, and service requests from creation to completion with real-time updates.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="perspective-card">
              <Card className="card-3d text-center hover-float glass-card border-0 bg-card/50" style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 animate-pulse-glow">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Intelligent technician scheduling with calendar integration, automated notifications, and route optimization.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="perspective-card">
              <Card className="card-3d text-center hover-float glass-card border-0 bg-card/50" style={{animationDelay: '0.3s'}}>
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 animate-pulse-glow">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Role Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Enterprise-grade security with granular role-based access control and customizable permissions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-4xl font-bold mb-6 text-gradient">
                Cutting-Edge Technology Stack
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Built on modern cloud infrastructure with enterprise-grade security, 
                our platform scales with your business while maintaining peak performance.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Zap className="h-6 w-6 text-primary" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span>Auto-Scaling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <img 
                src={datacenterImage} 
                alt="Modern Data Center" 
                className="rounded-2xl shadow-2xl hover-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 gradient-mesh">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in-up">
            <h3 className="text-5xl font-bold mb-6 text-gradient">
              Trusted by Industry Leaders
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what our customers have to say about transforming their operations with Abelov.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="perspective-card">
              <div className="card-3d glass-card border-0 bg-card/50 p-8 hover-float">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "Abelov transformed our maintenance operations. Response times improved by 60% 
                  and customer satisfaction reached an all-time high."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Davis</div>
                    <div className="text-muted-foreground text-sm">Operations Director</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="perspective-card">
              <div className="card-3d glass-card border-0 bg-card/50 p-8 hover-float" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "The scheduling system is a game-changer. Our technicians are more efficient 
                  and our customers love the real-time updates."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Martinez</div>
                    <div className="text-muted-foreground text-sm">Service Manager</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="perspective-card">
              <div className="card-3d glass-card border-0 bg-card/50 p-8 hover-float" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                  "ROI was evident within the first quarter. The platform paid for itself 
                  through improved efficiency and reduced overhead."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">MW</span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Wong</div>
                    <div className="text-muted-foreground text-sm">CEO</div>
                  </div>
                </div>
              </div>

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

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <img 
                src={teamImage} 
                alt="Professional Team" 
                className="rounded-2xl shadow-2xl hover-float"
              />
            </div>
            <div className="animate-slide-in-right">
              <h3 className="text-4xl font-bold mb-6 text-gradient">
                Expert Team, Exceptional Results
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our dedicated team of engineers, designers, and support specialists work tirelessly 
                to ensure your success. With 24/7 support and continuous platform improvements, 
                we're your trusted partner for growth.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Expert Engineers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">15+</div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Client Satisfaction</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-4 gradient-mesh">
        <div className="container mx-auto text-center">

          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of hardware maintenance companies that trust ACRMS to streamline their operations.

          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h3 className="text-5xl font-bold mb-8 text-gradient">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join hundreds of forward-thinking hardware maintenance companies that trust Abelov 
              to streamline their operations and accelerate growth. Start your free trial today.

            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button size="lg" asChild className="group hover-float text-lg px-8 py-4">
                <Link to="/auth?mode=signup">
                  Start Free Trial - No Credit Card Required
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-glow text-lg px-8 py-4">
                <Link to="/auth">Login to Existing Account</Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold">Enterprise Security</div>
                <div className="text-sm text-muted-foreground">SOC 2 Compliant</div>
              </div>
              <div>
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold">99.9% Uptime</div>
                <div className="text-sm text-muted-foreground">SLA Guaranteed</div>
              </div>
              <div>
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold">24/7 Support</div>
                <div className="text-sm text-muted-foreground">Expert Team</div>
              </div>
              <div>
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-semibold">30-Day Trial</div>
                <div className="text-sm text-muted-foreground">Money Back Guarantee</div>
              </div>
            </div>
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

      <footer className="border-t border-border/20 py-16 px-4 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="animate-pulse-glow">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
                <span className="text-2xl font-bold text-gradient">Abelov</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                Transforming hardware maintenance operations with innovative technology 
                and exceptional service. Your success is our mission.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="hover-glow">
                  <Link to="/auth?mode=signup">Try Free Trial</Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#services" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#testimonials" className="hover:text-primary transition-colors">Reviews</a></li>
                <li><a href="/auth" className="hover:text-primary transition-colors">Login</a></li>

              </ul>
            </div>
            
            <div>

              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>

              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>

              </ul>
            </div>
          </div>
          

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400">&copy; 2024 ACRMS. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            </div>

          <div className="border-t border-border/20 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Abelov. All rights reserved. Professional hardware maintenance solutions.</p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;