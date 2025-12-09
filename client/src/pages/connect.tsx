import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link2, Check, X, ExternalLink, RefreshCw } from "lucide-react";
import { SiX, SiLinkedin, SiThreads, SiBluesky } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import type { ConnectedAccount } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const platforms = [
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: SiX,
    description: "Post threads directly to X",
    color: "bg-black dark:bg-white dark:text-black",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: SiLinkedin,
    description: "Share repurposed content to LinkedIn",
    color: "bg-[#0A66C2]",
  },
  {
    id: "threads",
    name: "Threads",
    icon: SiThreads,
    description: "Cross-post to Meta's Threads",
    color: "bg-black dark:bg-white dark:text-black",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    icon: SiBluesky,
    description: "Publish to the decentralized network",
    color: "bg-[#0085FF]",
  },
];

export default function Connect() {
  const { toast } = useToast();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const { data: accounts = [], isLoading } = useQuery<ConnectedAccount[]>({
    queryKey: ["/api/connected-accounts"],
  });

  const connectMutation = useMutation({
    mutationFn: async ({ platform, platformUsername }: { platform: string; platformUsername: string }) => {
      const response = await apiRequest("POST", "/api/connected-accounts/connect", {
        platform,
        platformUsername,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connected-accounts"] });
      toast({
        title: "Account connected",
        description: `Your ${variables.platform} account has been linked.`,
      });
      setConnectingPlatform(null);
      setUsername("");
    },
    onError: () => {
      toast({
        title: "Connection failed",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (platform: string) => {
      await apiRequest("POST", "/api/connected-accounts/disconnect", { platform });
    },
    onSuccess: (_, platform) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connected-accounts"] });
      toast({
        title: "Account disconnected",
        description: `Your ${platform} account has been unlinked.`,
      });
    },
    onError: () => {
      toast({
        title: "Disconnection failed",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isConnected = (platformId: string) => {
    return accounts.some((a) => a.platform === platformId && a.isConnected);
  };

  const getAccount = (platformId: string) => {
    return accounts.find((a) => a.platform === platformId);
  };

  const handleConnect = (platformId: string) => {
    setConnectingPlatform(platformId);
    setUsername("");
  };

  const handleConfirmConnect = () => {
    if (connectingPlatform && username.trim()) {
      connectMutation.mutate({
        platform: connectingPlatform,
        platformUsername: username.trim(),
      });
    }
  };

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Link2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-connect-title">
          Connect Accounts
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-connect-subtitle">
          Link your social media accounts to publish content directly from Twin. 
          One click to post your threads across multiple platforms.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {platforms.map((platform) => {
          const connected = isConnected(platform.id);
          const account = getAccount(platform.id);
          const Icon = platform.icon;

          return (
            <Card key={platform.id} data-testid={`card-platform-${platform.id}`}>
              <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
                <div className={`p-3 rounded-md ${platform.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    {connected && (
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-connected-${platform.id}`}>
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{platform.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {connected && account?.platformUsername && (
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`text-username-${platform.id}`}>
                    @{account.platformUsername}
                  </p>
                )}
                <div className="flex gap-2">
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectMutation.mutate(platform.id)}
                      disabled={disconnectMutation.isPending}
                      data-testid={`button-disconnect-${platform.id}`}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(platform.id)}
                      disabled={connectMutation.isPending}
                      data-testid={`button-connect-${platform.id}`}
                    >
                      {connectMutation.isPending && connectingPlatform === platform.id ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 mr-2" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50" data-testid="section-info">
        <div className="flex items-start gap-4">
          <Link2 className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-info-title">
              Secure Connections
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-info-description">
              Your account credentials are securely stored and encrypted. Twin only 
              requests the minimum permissions needed to post on your behalf. You can 
              disconnect any account at any time.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!connectingPlatform} onOpenChange={(open) => !open && setConnectingPlatform(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {platforms.find(p => p.id === connectingPlatform)?.name}</DialogTitle>
            <DialogDescription>
              Enter your username to link your account. In production, this would use OAuth for secure authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-username"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectingPlatform(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmConnect}
              disabled={!username.trim() || connectMutation.isPending}
              data-testid="button-confirm-connect"
            >
              {connectMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
