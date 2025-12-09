import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Target, Lightbulb, LineChart, Trophy, RefreshCw, Brain, Zap } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface CoachingTip {
  title: string;
  tip: string;
  category: string;
}

interface CoachingData {
  tips: CoachingTip[];
  contentScore: number;
  topStrength: string;
  topOpportunity: string;
  stats: {
    totalThreads: number;
    avgEngagement: number;
    totalEngagement: number;
  };
}

const categoryIcons: Record<string, typeof Lightbulb> = {
  hooks: Zap,
  engagement: TrendingUp,
  voice: Target,
  timing: LineChart,
};

export default function Coaching() {
  const { data: coaching, isLoading, refetch, isFetching } = useQuery<CoachingData>({
    queryKey: ["/api/coaching/tips"],
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/coaching/tips"] });
    refetch();
  };

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-coaching-title">
          AI Coach
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-coaching-subtitle">
          Your personal AI content coach. Get actionable feedback on your threads, 
          learn what's working, and receive personalized tips to grow your audience.
        </p>
      </div>

      <Card className="mb-8" data-testid="card-performance-overview">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              data-testid="button-refresh-coaching"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Your content performance at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 rounded-md bg-muted/50 animate-pulse">
                  <div className="h-8 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-content-score">
                  <p className="text-2xl font-bold">{coaching?.contentScore || 0}</p>
                  <p className="text-sm text-muted-foreground">Content Score</p>
                </div>
                <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-total-threads">
                  <p className="text-2xl font-bold">{coaching?.stats?.totalThreads || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Threads</p>
                </div>
                <div className="text-center p-4 rounded-md bg-muted/50" data-testid="stat-avg-engagement">
                  <p className="text-2xl font-bold">{coaching?.stats?.avgEngagement || 0}</p>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                </div>
              </div>
              {coaching && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-md bg-green-500/10 border border-green-500/20">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Top Strength</p>
                    <p className="text-sm mt-1">{coaching.topStrength}</p>
                  </div>
                  <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Growth Opportunity</p>
                    <p className="text-sm mt-1">{coaching.topOpportunity}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8" data-testid="card-coaching-tips">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">AI Coaching Tips</CardTitle>
          </div>
          <CardDescription>
            Personalized recommendations based on your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-md bg-muted/50 animate-pulse">
                  <div className="h-5 bg-muted rounded w-40 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : coaching?.tips && coaching.tips.length > 0 ? (
            <div className="space-y-4">
              {coaching.tips.map((tip, index) => {
                const Icon = categoryIcons[tip.category] || Lightbulb;
                return (
                  <div
                    key={index}
                    className="p-4 rounded-md bg-muted/50 flex items-start gap-4"
                    data-testid={`tip-row-${index}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{tip.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Create some threads to get personalized coaching tips!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-feature-performance">
          <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
            <div className="p-3 rounded-md bg-muted">
              <LineChart className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base">Performance Analysis</CardTitle>
              <CardDescription>
                Deep dive into your content metrics with AI-powered insights
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-muted-foreground">Engagement patterns</Badge>
              <Badge variant="outline" className="text-muted-foreground">Best posting times</Badge>
              <Badge variant="outline" className="text-muted-foreground">Audience insights</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-recommendations">
          <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
            <div className="p-3 rounded-md bg-muted">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base">Content Recommendations</CardTitle>
              <CardDescription>
                AI suggests topics and formats based on what works
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-muted-foreground">Trending topics</Badge>
              <Badge variant="outline" className="text-muted-foreground">Format suggestions</Badge>
              <Badge variant="outline" className="text-muted-foreground">Optimal length</Badge>
            </div>
          </CardContent>
        </Card>
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
