import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiX, SiLinkedin, SiFacebook, SiInstagram } from "react-icons/si";
import { Link2, ExternalLink, Shield } from "lucide-react";

const socialPlatforms = [
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Connect your X account to post threads directly from Twin",
    icon: SiX,
    connected: false,
    comingSoon: true,
    features: [
      "Post threads directly",
      "Schedule posts",
      "Track engagement",
      "Auto-reply suggestions",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Share your repurposed content directly to LinkedIn",
    icon: SiLinkedin,
    connected: false,
    comingSoon: true,
    features: [
      "Post articles",
      "Share updates",
      "Schedule content",
      "Analytics sync",
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Publish content to your Facebook pages",
    icon: SiFacebook,
    connected: false,
    comingSoon: true,
    features: [
      "Page posting",
      "Content scheduling",
      "Engagement tracking",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Share visual content to your Instagram account",
    icon: SiInstagram,
    connected: false,
    comingSoon: true,
    features: [
      "Story posting",
      "Feed updates",
      "Caption generation",
    ],
  },
];

export default function Connect() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Link2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-connect-title">
          Connect Your Accounts
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-connect-subtitle">
          Link your social media accounts to post content directly from Twin. 
          Schedule threads, track performance, and grow your audience.
        </p>
      </div>

      <div className="grid gap-6">
        {socialPlatforms.map((platform) => (
          <Card 
            key={platform.id}
            className="relative"
            data-testid={`card-platform-${platform.id}`}
          >
            <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
              <div className="p-3 rounded-md bg-muted">
                <platform.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle data-testid={`text-platform-name-${platform.id}`}>
                    {platform.name}
                  </CardTitle>
                  {platform.comingSoon && (
                    <Badge variant="secondary" data-testid={`badge-coming-soon-${platform.id}`}>
                      Coming Soon
                    </Badge>
                  )}
                  {platform.connected && (
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      Connected
                    </Badge>
                  )}
                </div>
                <CardDescription data-testid={`text-platform-description-${platform.id}`}>
                  {platform.description}
                </CardDescription>
              </div>
              <Button 
                variant={platform.connected ? "outline" : "default"}
                disabled={platform.comingSoon}
                data-testid={`button-connect-${platform.id}`}
              >
                {platform.connected ? (
                  <>
                    Manage
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {platform.features.map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="text-muted-foreground"
                    data-testid={`badge-feature-${platform.id}-${index}`}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-security-title">
              Your data is secure
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-security-description">
              We use OAuth 2.0 for secure authentication. Twin never stores your passwords 
              and you can disconnect your accounts at any time. We only request the minimum 
              permissions needed to post on your behalf.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
