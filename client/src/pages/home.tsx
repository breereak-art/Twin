import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mic2, FileText, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
            Your Digital Self.{" "}
            <span className="text-primary">Only Better.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
            Clone your writing voice. Generate viral Twitter threads in seconds. 
            Let AI capture your authentic style while you focus on ideas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild data-testid="button-get-started">
              <Link href="/voice-packs">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-compose">
              <Link href="/compose">
                Try the Composer
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Everything you need to dominate Twitter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic2}
              title="Voice Cloning"
              description="Upload your best writing samples. Our AI learns your unique style, tone, and personality."
              href="/voice-packs"
            />
            <FeatureCard
              icon={FileText}
              title="Thread Composer"
              description="Generate viral threads with proven hook templates. Live preview shows exactly how it'll look."
              href="/compose"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Analytics Dashboard"
              description="Track impressions, engagement, and growth. See which threads perform best."
              href="/analytics"
            />
          </div>
        </div>
      </section>

      {/* Hook Types */}
      <section className="py-16 px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">5 Viral Hook Templates</h2>
          <p className="text-muted-foreground mb-8">
            Proven formulas that grab attention and drive engagement
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <HookBadge label="Negative" example="Stop doing X if you want Y" />
            <HookBadge label="Numbers" example="7 ways to 10x your Z" />
            <HookBadge label="Story" example="I spent 3 years learning..." />
            <HookBadge label="Contrarian" example="Unpopular opinion: X is dead" />
            <HookBadge label="List" example="Everything I learned about X" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Card className="group" data-testid={`card-feature-${title.toLowerCase().replace(' ', '-')}`}>
      <CardHeader>
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" size="sm" asChild>
          <Link href={href}>
            Learn more <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function HookBadge({ label, example }: { label: string; example: string }) {
  return (
    <div className="px-4 py-2 rounded-md bg-card border text-sm" data-testid={`badge-hook-${label.toLowerCase()}`}>
      <span className="font-medium">{label}:</span>{" "}
      <span className="text-muted-foreground">{example}</span>
    </div>
  );
}
