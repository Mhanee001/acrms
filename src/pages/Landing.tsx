import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Shield, Clock, Users, ArrowRight, CheckCircle, Star, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-hardware-maintenance.jpg";
import serviceImage from "@/assets/service-excellence.jpg";
import datacenterImage from "@/assets/datacenter-modern.jpg";
import teamImage from "@/assets/professional-team.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen hero-bg">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-morphism border-b border-border/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            {/* <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg"> */}
                    {/* <Wrench className="h-5 w-5 text-white" /> */}
                    <img src="/acrms.webp" alt="" className="rounded-xl" width={50} height={50} />
                  {/* </div> */}
                               
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                ACRMS
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
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
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