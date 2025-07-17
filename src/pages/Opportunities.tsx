import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Calendar,
  User,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { useState } from "react";

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const opportunities = [
    {
      id: 1,
      title: "Enterprise Software License",
      account: "Acme Corp",
      contact: "John Smith",
      amount: 150000,
      probability: 75,
      stage: "Proposal",
      closeDate: "2024-02-15",
      lastActivity: "2024-01-15",
      owner: "Sarah Johnson",
      source: "Inbound"
    },
    {
      id: 2,
      title: "Cloud Migration Project",
      account: "TechStart",
      contact: "Mike Davis",
      amount: 85000,
      probability: 60,
      stage: "Discovery",
      closeDate: "2024-03-01",
      lastActivity: "2024-01-14",
      owner: "David Wilson",
      source: "Referral"
    },
    {
      id: 3,
      title: "Security Audit Services",
      account: "SecureBank",
      contact: "Emma Brown",
      amount: 45000,
      probability: 90,
      stage: "Negotiation",
      closeDate: "2024-01-25",
      lastActivity: "2024-01-16",
      owner: "Lisa Chen",
      source: "Website"
    }
  ];

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

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0);

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Opportunities</h2>
            <p className="text-muted-foreground">Track your sales pipeline and deals</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Opportunity
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {opportunities.length} opportunities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Based on probability
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(totalValue / opportunities.length).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current pipeline
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
                    placeholder="Search opportunities..."
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

        {/* Opportunities List */}
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                    <p className="text-sm text-muted-foreground">{opportunity.account} • {opportunity.contact}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${opportunity.amount.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${getProbabilityColor(opportunity.probability)}`}>
                        {opportunity.probability}% probability
                      </div>
                    </div>
                    <Badge variant={getStageColor(opportunity.stage) as any}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Close</span>
                    <span>{opportunity.probability}%</span>
                  </div>
                  <Progress value={opportunity.probability} className="h-2" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Timeline</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>Close: {opportunity.closeDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>Last activity: {opportunity.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Owner</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{opportunity.owner}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Source</h4>
                    <div className="text-sm">{opportunity.source}</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    Add Activity
                  </Button>
                  <Button size="sm">
                    Update Stage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Opportunities;