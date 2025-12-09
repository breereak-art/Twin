import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, UserPlus, FolderOpen, BarChart3, Shield, Trash2, Building2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AgencyClient, VoicePack } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientWithPacks extends AgencyClient {
  voicePackCount: number;
}

export default function Agency() {
  const { toast } = useToast();
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAssignPack, setShowAssignPack] = useState<string | null>(null);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [selectedVoicePack, setSelectedVoicePack] = useState("");

  const { data: clients = [], isLoading } = useQuery<ClientWithPacks[]>({
    queryKey: ["/api/agency/clients"],
  });

  const { data: voicePacks = [] } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const addClientMutation = useMutation({
    mutationFn: async (data: { clientName: string; clientEmail?: string }) => {
      const response = await apiRequest("POST", "/api/agency/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agency/clients"] });
      toast({ title: "Client added successfully" });
      setShowAddClient(false);
      setNewClientName("");
      setNewClientEmail("");
    },
    onError: () => {
      toast({ title: "Failed to add client", variant: "destructive" });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/agency/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agency/clients"] });
      toast({ title: "Client removed" });
    },
    onError: () => {
      toast({ title: "Failed to remove client", variant: "destructive" });
    },
  });

  const assignPackMutation = useMutation({
    mutationFn: async ({ clientId, voicePackId }: { clientId: string; voicePackId: string }) => {
      const response = await apiRequest("POST", `/api/agency/clients/${clientId}/voice-packs`, {
        voicePackId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agency/clients"] });
      toast({ title: "Voice pack assigned" });
      setShowAssignPack(null);
      setSelectedVoicePack("");
    },
    onError: () => {
      toast({ title: "Failed to assign voice pack", variant: "destructive" });
    },
  });

  const handleAddClient = () => {
    if (newClientName.trim()) {
      addClientMutation.mutate({
        clientName: newClientName.trim(),
        clientEmail: newClientEmail.trim() || undefined,
      });
    }
  };

  const handleAssignPack = () => {
    if (showAssignPack && selectedVoicePack) {
      assignPackMutation.mutate({
        clientId: showAssignPack,
        voicePackId: selectedVoicePack,
      });
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.isActive).length;
  const totalPacks = clients.reduce((sum, c) => sum + c.voicePackCount, 0);

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-agency-title">
          Agency Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-agency-subtitle">
          Scale your content operations. Manage multiple clients, assign Voice Packs, 
          and track performance across your entire agency from one powerful dashboard.
        </p>
      </div>

      <Card className="mb-8" data-testid="card-client-overview">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Client Overview</CardTitle>
            </div>
            <Button onClick={() => setShowAddClient(true)} data-testid="button-add-client">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
          <CardDescription>
            Your agency's client management at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-total-clients">
              <p className="text-2xl font-bold">{totalClients}</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-active-clients">
              <p className="text-2xl font-bold">{activeClients}</p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-assigned-packs">
              <p className="text-2xl font-bold">{totalPacks}</p>
              <p className="text-sm text-muted-foreground">Assigned Packs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8" data-testid="card-client-list">
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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-md bg-muted/50 animate-pulse h-20" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clients yet. Add your first client to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 rounded-md bg-muted/50 flex items-center justify-between gap-4"
                  data-testid={`client-row-${client.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{client.clientName}</p>
                      <div className="flex items-center gap-2">
                        {client.clientEmail && (
                          <p className="text-xs text-muted-foreground">{client.clientEmail}</p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {client.voicePackCount} Voice Packs
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAssignPack(client.id)}
                      data-testid={`button-assign-${client.id}`}
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Assign Pack
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteClientMutation.mutate(client.id)}
                      disabled={deleteClientMutation.isPending}
                      data-testid={`button-delete-${client.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-feature-roster">
          <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
            <div className="p-3 rounded-md bg-muted">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base">Client Roster</CardTitle>
              <CardDescription>
                Manage all your clients in one centralized dashboard
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-muted-foreground">Unlimited clients</Badge>
              <Badge variant="outline" className="text-muted-foreground">Quick onboarding</Badge>
              <Badge variant="outline" className="text-muted-foreground">Client profiles</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-analytics">
          <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
            <div className="p-3 rounded-md bg-muted">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base">Client Analytics</CardTitle>
              <CardDescription>
                Track performance across all clients with consolidated reporting
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-muted-foreground">Cross-client metrics</Badge>
              <Badge variant="outline" className="text-muted-foreground">Custom reports</Badge>
              <Badge variant="outline" className="text-muted-foreground">Export data</Badge>
            </div>
          </CardContent>
        </Card>
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

      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a client to manage their Voice Packs and content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Client Name</label>
              <Input
                placeholder="Enter client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                data-testid="input-client-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email (optional)</label>
              <Input
                placeholder="client@example.com"
                type="email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                data-testid="input-client-email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClient(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              disabled={!newClientName.trim() || addClientMutation.isPending}
              data-testid="button-confirm-add-client"
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showAssignPack} onOpenChange={(open) => !open && setShowAssignPack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Voice Pack</DialogTitle>
            <DialogDescription>
              Select a Voice Pack to assign to this client
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedVoicePack} onValueChange={setSelectedVoicePack}>
              <SelectTrigger data-testid="select-voice-pack">
                <SelectValue placeholder="Select a Voice Pack" />
              </SelectTrigger>
              <SelectContent>
                {voicePacks.length === 0 ? (
                  <SelectItem value="" disabled>No Voice Packs available</SelectItem>
                ) : (
                  voicePacks.map((pack) => (
                    <SelectItem key={pack.id} value={pack.id}>
                      {pack.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignPack(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignPack}
              disabled={!selectedVoicePack || assignPackMutation.isPending}
              data-testid="button-confirm-assign"
            >
              Assign Pack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
