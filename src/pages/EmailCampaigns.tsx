import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Plus, 
  Send, 
  Users, 
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { useState } from "react";

const EmailCampaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: "Q1 Product Launch",
      subject: "Introducing Our Revolutionary New Features",
      status: "sent",
      sentDate: "2024-01-15",
      recipients: 1250,
      opened: 875,
      clicked: 324,
      replied: 87,
      type: "marketing"
    },
    {
      id: 2,
      name: "Follow-up Nurture Series",
      subject: "Don't Miss Out - Limited Time Offer",
      status: "scheduled",
      scheduledDate: "2024-01-20",
      recipients: 890,
      opened: 0,
      clicked: 0,
      replied: 0,
      type: "nurture"
    },
    {
      id: 3,
      name: "Customer Feedback Survey",
      subject: "Help Us Improve - Your Opinion Matters",
      status: "draft",
      recipients: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      type: "survey"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "default";
      case "scheduled": return "secondary";
      case "draft": return "outline";
      default: return "outline";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "marketing": return "default";
      case "nurture": return "secondary";
      case "survey": return "outline";
      default: return "outline";
    }
  };

  const calculateOpenRate = (opened: number, recipients: number) => {
    return recipients > 0 ? ((opened / recipients) * 100).toFixed(1) : "0";
  };

  const calculateClickRate = (clicked: number, recipients: number) => {
    return recipients > 0 ? ((clicked / recipients) * 100).toFixed(1) : "0";
  };

  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Email Campaigns</h2>
            <p className="text-muted-foreground">Create and manage your email marketing campaigns</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68.2%</div>
              <p className="text-xs text-muted-foreground">
                +4.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(campaign.status) as any}>
                      {campaign.status}
                    </Badge>
                    <Badge variant={getTypeColor(campaign.type) as any}>
                      {campaign.type}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {campaign.status === "sent" && (
                  <>
                    <div className="grid md:grid-cols-4 gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.recipients.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Users className="h-3 w-3 mr-1" />
                          Recipients
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{campaign.opened.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Opened ({calculateOpenRate(campaign.opened, campaign.recipients)}%)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{campaign.clicked.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <MousePointer className="h-3 w-3 mr-1" />
                          Clicked ({calculateClickRate(campaign.clicked, campaign.recipients)}%)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{campaign.replied}</div>
                        <div className="text-sm text-muted-foreground">
                          Replied
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Open Rate</span>
                        <span>{calculateOpenRate(campaign.opened, campaign.recipients)}%</span>
                      </div>
                      <Progress value={parseFloat(calculateOpenRate(campaign.opened, campaign.recipients))} className="h-2" />
                    </div>
                  </>
                )}

                {campaign.status === "scheduled" && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Scheduled for {campaign.scheduledDate}</span>
                      <span className="text-sm text-muted-foreground">• {campaign.recipients} recipients</span>
                    </div>
                  </div>
                )}

                {campaign.status === "draft" && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Campaign is in draft mode. Complete setup to schedule or send.
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-muted-foreground">
                    {campaign.status === "sent" && `Sent on ${campaign.sentDate}`}
                    {campaign.status === "scheduled" && `Scheduled for ${campaign.scheduledDate}`}
                    {campaign.status === "draft" && "Draft - Not scheduled"}
                  </div>
                  <div className="flex space-x-2">
                    {campaign.status === "draft" && (
                      <>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm">
                          Schedule
                        </Button>
                      </>
                    )}
                    {campaign.status === "scheduled" && (
                      <>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </>
                    )}
                    {campaign.status === "sent" && (
                      <>
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                        <Button size="sm">
                          Duplicate
                        </Button>
                      </>
                    )}
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

export default EmailCampaigns;