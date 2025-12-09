import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, FolderOpen, BarChart3, Shield, Settings, Building2, UserCog } from "lucide-react";

const agencyFeatures = [
  {
    id: "client-roster",
    title: "Client Roster",
    description: "Manage all your clients in one centralized dashboard with easy onboarding",
    icon: Users,
    features: ["Unlimited clients", "Quick onboarding", "Client profiles"],
  },
  {
    id: "voice-assignments",
    title: "Voice Pack Assignments",
    description: "Assign and manage Voice Packs for each client's unique brand voice",
    icon: FolderOpen,
    features: ["Multiple packs per client", "Easy switching", "Voice sharing"],
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration",
    description: "Invite team members and assign roles with granular permissions",
    icon: UserCog,
    features: ["Role-based access", "Team invites", "Activity logs"],
  },
  {
    id: "client-analytics",
    title: "Client Analytics",
    description: "Track performance across all clients with consolidated reporting",
    icon: BarChart3,
    features: ["Cross-client metrics", "Custom reports", "Export data"],
  },
];

export default function Agency() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <h1 className="text-4xl font-bold" data-testid="text-agency-title">
            Agency Dashboard
          </h1>
          <Badge variant="secondary" data-testid="badge-coming-soon">
            Coming Soon
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-agency-subtitle">
          Scale your content operations. Manage multiple clients, assign Voice Packs, 
          and track performance across your entire agency from one powerful dashboard.
        </p>
      </div>

      <Card className="mb-8 border-dashed" data-testid="card-client-overview">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Client Overview</CardTitle>
          </div>
          <CardDescription>
            Your agency's client management at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-total-clients">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-active-packs">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Active Packs</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-team-members">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled data-testid="button-add-client">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
            <Button variant="outline" disabled data-testid="button-manage-team">
              <Settings className="h-4 w-4 mr-2" />
              Manage Team
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-muted/30 border-dashed" data-testid="card-client-list">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Client Voice Packs</CardTitle>
          </div>
          <CardDescription>
            Assign and manage Voice Packs for each client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className="p-4 rounded-md bg-background border border-dashed flex items-center justify-between gap-4"
                data-testid={`client-row-${num}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground italic">
                      Client {num} will appear here...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      0 Voice Packs assigned
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled data-testid={`button-manage-${num}`}>
                    Manage
                  </Button>
                  <Button size="sm" disabled data-testid={`button-assign-${num}`}>
                    Assign Pack
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {agencyFeatures.map((feature) => (
          <Card 
            key={feature.id}
            className="relative"
            data-testid={`card-feature-${feature.id}`}
          >
            <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
              <div className="p-3 rounded-md bg-muted">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-base" data-testid={`text-feature-title-${feature.id}`}>
                  {feature.title}
                </CardTitle>
                <CardDescription data-testid={`text-feature-description-${feature.id}`}>
                  {feature.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {feature.features.map((item, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="text-muted-foreground"
                    data-testid={`badge-capability-${feature.id}-${index}`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50" data-testid="section-security">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-security-title">
              Enterprise-Grade Security
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-security-description">
              Keep client data secure with role-based permissions, audit logs, and isolated 
              workspaces. Each client's content and Voice Packs remain completely separate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
