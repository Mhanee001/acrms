import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/currency";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const leads = [
    {
      id: 1,
      name: "Tech Solutions Inc",
      contact: "Michael Brown",
      email: "michael@techsolutions.com",
      phone: "+1 (555) 234-5678",
      source: "Website",
      status: "qualified",
      value: 75000,
      probability: 80,
      stage: "Proposal",
      lastActivity: "2024-01-15",
      nextFollowUp: "2024-01-20"
    },
    {
      id: 2,
      name: "Global Enterprises",
      contact: "Lisa Chen",
      email: "lisa@globalent.com",
      phone: "+1 (555) 345-6789",
      source: "Referral",
      status: "new",
      value: 120000,
      probability: 25,
      stage: "Discovery",
      lastActivity: "2024-01-12",
      nextFollowUp: "2024-01-18"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "default";
      case "new": return "secondary";
      case "contacted": return "outline";
      case "lost": return "destructive";
      default: return "secondary";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Proposal": return "default";
      case "Discovery": return "secondary";
      case "Negotiation": return "outline";
      case "Closed Won": return "default";
      case "Closed Lost": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Leads</h2>
            <p className="text-muted-foreground">Track and manage your sales prospects</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(2400000)}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.contact}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={getStatusColor(lead.status) as any}>
                      {lead.status}
                    </Badge>
                    <Badge variant={getStageColor(lead.stage) as any}>
                      {lead.stage}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Contact Info</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Deal Value</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(lead.value)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Probability</span>
                        <span>{lead.probability}%</span>
                      </div>
                      <Progress value={lead.probability} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Activity</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>Last: {lead.lastActivity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>Next: {lead.nextFollowUp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-muted-foreground">
                    Source: {lead.source}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Leads;