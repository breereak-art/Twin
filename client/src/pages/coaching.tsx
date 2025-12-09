import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Lightbulb, LineChart, Trophy, ArrowUpRight, Zap, Brain } from "lucide-react";

const coachingFeatures = [
  {
    id: "performance-analysis",
    title: "Performance Analysis",
    description: "Deep dive into your content metrics with AI-powered insights and trend detection",
    icon: LineChart,
    features: ["Engagement patterns", "Best posting times", "Audience insights"],
  },
  {
    id: "ai-coaching-tips",
    title: "AI Coaching Tips",
    description: "Get personalized recommendations to improve your content strategy",
    icon: Lightbulb,
    features: ["Writing improvements", "Hook optimization", "Voice refinement"],
  },
  {
    id: "content-recommendations",
    title: "Content Recommendations",
    description: "AI suggests topics and formats based on what's working for you",
    icon: Target,
    features: ["Trending topics", "Format suggestions", "Optimal length"],
  },
  {
    id: "growth-insights",
    title: "Growth Insights",
    description: "Track your progress and see how your content strategy is evolving",
    icon: TrendingUp,
    features: ["Weekly reports", "Growth metrics", "Milestone tracking"],
  },
];

export default function Coaching() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <h1 className="text-4xl font-bold" data-testid="text-coaching-title">
            AI Coach
          </h1>
          <Badge variant="secondary" data-testid="badge-coming-soon">
            Coming Soon
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-coaching-subtitle">
          Your personal AI content coach. Get actionable feedback on your threads, 
          learn what's working, and receive personalized tips to grow your audience.
        </p>
      </div>

      <Card className="mb-8 border-dashed" data-testid="card-performance-overview">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Trophy className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Performance Overview</CardTitle>
          </div>
          <CardDescription>
            Your content performance at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-avg-engagement">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-growth-rate">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </div>
            <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-content-score">
              <p className="text-2xl font-bold text-muted-foreground">--</p>
              <p className="text-sm text-muted-foreground">Content Score</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled data-testid="button-get-analysis">
              <Zap className="h-4 w-4 mr-2" />
              Get AI Analysis
            </Button>
            <Button variant="outline" disabled data-testid="button-view-history">
              <LineChart className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-muted/30 border-dashed" data-testid="card-coaching-preview">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Latest Coaching Tips</CardTitle>
          </div>
          <CardDescription>
            Personalized recommendations based on your recent content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className="p-4 rounded-md bg-background border border-dashed flex items-start gap-4"
                data-testid={`tip-row-${num}`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground italic">
                    AI coaching tip {num} will appear here...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on your recent threads
                  </p>
                </div>
                <Button size="sm" variant="ghost" disabled data-testid={`button-apply-tip-${num}`}>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {coachingFeatures.map((feature) => (
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

      <div className="mt-12 p-6 rounded-lg bg-muted/50" data-testid="section-feedback-loop">
        <div className="flex items-start gap-4">
          <Brain className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-feedback-title">
              Continuous Learning
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-feedback-description">
              Your AI Coach learns from every thread you create. The more you use Twin, 
              the smarter your recommendations become - helping you refine your voice 
              and maximize engagement over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
