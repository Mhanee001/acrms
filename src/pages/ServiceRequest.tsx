import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

const ServiceRequest = () => {
  const { user, loading } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Redirect non-users who try to access this page
  useEffect(() => {
    if (role && role !== 'user') {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const [isCreating, setIsCreating] = useState(false);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    job_type: "",
    priority: "medium",
    location: "",
    required_specialty: ""
  });

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.description || !newRequest.job_type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          user_id: user.id,
          title: newRequest.title,
          description: newRequest.description,
          job_type: newRequest.job_type,
          priority: newRequest.priority,
          location: newRequest.location || null,
          required_specialty: newRequest.required_specialty || null,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating service request:', error);
        toast({
          title: "Error",
          description: "Failed to create service request",
          variant: "destructive",
        });
        return;
      }

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'create_request',
        description: `Created service request: ${newRequest.title}`,
        entity_type: 'service_request'
      });

      toast({
        title: "Success",
        description: "Service request created successfully",
      });

      setNewRequest({ 
        title: "", 
        description: "", 
        job_type: "", 
        priority: "medium", 
        location: "",
        required_specialty: ""
      });

      // Redirect to my requests page
      navigate("/my-requests");
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading service requests...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Service Requests</h1>
          <p className="text-muted-foreground text-lg">
            Create and track your hardware maintenance requests with ease
          </p>
        </div>

        {/* Create New Request - Users Only */}
        <Card className="max-w-2xl mx-auto card-hover border-border/40 bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <span>Create Service Request</span>
            </CardTitle>
            <CardDescription>
              Submit a new service request for your equipment maintenance needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="job_type">Job Type *</Label>
                <Select value={newRequest.job_type} onValueChange={(value) => setNewRequest({...newRequest, job_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware_repair">Hardware Repair</SelectItem>
                    <SelectItem value="software_installation">Software Installation</SelectItem>
                    <SelectItem value="network_setup">Network Setup</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                    <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the problem"
                rows={4}
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({...newRequest, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Office, building, etc."
                  value={newRequest.location}
                  onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="required_specialty">Required Specialty</Label>
                <Select value={newRequest.required_specialty} onValueChange={(value) => setNewRequest({...newRequest, required_specialty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCreateRequest} 
              className="w-full" 
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceRequest;
