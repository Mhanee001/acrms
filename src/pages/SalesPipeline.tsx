import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

const SalesPipeline = () => {
  const pipelineStages = [
    {
      name: "Lead",
      count: 45,
      value: 450000,
      color: "bg-gray-100 border-gray-300",
      deals: [
        { id: 1, title: "Enterprise Deal A", company: "Acme Corp", value: 75000, probability: 20 },
        { id: 2, title: "Small Business License", company: "Tech LLC", value: 15000, probability: 25 }
      ]
    },
    {
      name: "Discovery",
      count: 32,
      value: 680000,
      color: "bg-blue-100 border-blue-300",
      deals: [
        { id: 3, title: "Cloud Migration", company: "StartupXYZ", value: 120000, probability: 40 },
        { id: 4, title: "Security Package", company: "FinTech Co", value: 85000, probability: 45 }
      ]
    },
    {
      name: "Proposal",
      count: 18,
      value: 920000,
      color: "bg-yellow-100 border-yellow-300",
      deals: [
        { id: 5, title: "Integration Services", company: "MegaCorp", value: 200000, probability: 70 },
        { id: 6, title: "Annual Subscription", company: "GrowthCo", value: 50000, probability: 75 }
      ]
    },
    {
      name: "Negotiation",
      count: 12,
      value: 540000,
      color: "bg-orange-100 border-orange-300",
      deals: [
        { id: 7, title: "Custom Development", company: "InnovateCorp", value: 150000, probability: 85 },
        { id: 8, title: "Premium Support", company: "ScaleTech", value: 35000, probability: 90 }
      ]
    },
    {
      name: "Closed Won",
      count: 8,
      value: 340000,
      color: "bg-green-100 border-green-300",
      deals: [
        { id: 9, title: "Implementation Project", company: "SuccessCorp", value: 100000, probability: 100 },
        { id: 10, title: "Training Package", company: "LearnCo", value: 25000, probability: 100 }
      ]
    }
  ];

  const totalPipelineValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const totalDeals = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Sales Pipeline</h2>
            <p className="text-muted-foreground">Visual overview of your sales process</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
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
              <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all stages
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeals}</div>
              <p className="text-xs text-muted-foreground">
                In pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(totalPipelineValue / totalDeals).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current pipeline
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
            <CardDescription>Drag and drop deals between stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {pipelineStages.map((stage, index) => (
                <div key={stage.name} className="space-y-4">
                  {/* Stage Header */}
                  <div className={`p-4 rounded-lg border-2 ${stage.color}`}>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">{stage.name}</h3>
                      <div className="mt-2">
                        <div className="text-lg font-bold">{stage.count}</div>
                        <div className="text-xs text-muted-foreground">deals</div>
                      </div>
                      <div className="mt-1">
                        <div className="text-sm font-medium">${stage.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">value</div>
                      </div>
                    </div>
                  </div>

                  {/* Stage Deals */}
                  <div className="space-y-2 min-h-[400px]">
                    {stage.deals.map((deal) => (
                      <Card key={deal.id} className="cursor-move hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{deal.title}</h4>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600">
                              ${deal.value.toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {deal.probability}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Add Deal Button */}
                    <Button 
                      variant="outline" 
                      className="w-full h-16 border-dashed border-2 text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SalesPipeline;