import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Repeat2, UserPlus, BarChart3 } from "lucide-react";
import type { Thread, Analytics } from "@shared/schema";

export default function AnalyticsDashboard() {
  const { data: threads, isLoading: loadingThreads } = useQuery<Thread[]>({
    queryKey: ["/api/threads"],
  });

  const { data: analyticsData, isLoading: loadingAnalytics } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics"],
  });

  const isLoading = loadingThreads || loadingAnalytics;

  // Calculate aggregate metrics
  const totalImpressions = analyticsData?.reduce((sum, a) => sum + (a.impressions || 0), 0) || 0;
  const totalLikes = analyticsData?.reduce((sum, a) => sum + (a.likes || 0), 0) || 0;
  const totalReplies = analyticsData?.reduce((sum, a) => sum + (a.replies || 0), 0) || 0;
  const totalRetweets = analyticsData?.reduce((sum, a) => sum + (a.retweets || 0), 0) || 0;
  const totalClicks = analyticsData?.reduce((sum, a) => sum + (a.profileClicks || 0), 0) || 0;
  const engagementRate = totalImpressions > 0 
    ? ((totalLikes + totalReplies + totalRetweets) / totalImpressions * 100).toFixed(2)
    : "0.00";

  const postedThreads = threads?.filter(t => t.status === "posted") || [];

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your thread performance and engagement
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Impressions"
            value={totalImpressions}
            icon={Eye}
            trend={12.5}
            isLoading={isLoading}
          />
          <MetricCard
            title="Likes"
            value={totalLikes}
            icon={Heart}
            trend={8.2}
            isLoading={isLoading}
          />
          <MetricCard
            title="Replies"
            value={totalReplies}
            icon={MessageCircle}
            trend={-2.1}
            isLoading={isLoading}
          />
          <MetricCard
            title="Retweets"
            value={totalRetweets}
            icon={Repeat2}
            trend={15.3}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Engagement Overview</CardTitle>
              <CardDescription>Performance of your published threads</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : postedThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-4" />
                  <p>No published threads yet</p>
                  <p className="text-sm">Publish threads to see analytics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postedThreads.slice(0, 5).map(thread => {
                    const threadAnalytics = analyticsData?.find(a => a.threadId === thread.id);
                    return (
                      <div key={thread.id} className="flex items-center justify-between p-3 rounded-md border" data-testid={`analytics-thread-${thread.id}`}>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{thread.topic}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{thread.hookType}</Badge>
                            {thread.postedAt && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(thread.postedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-semibold">{threadAnalytics?.impressions || 0}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{threadAnalytics?.likes || 0}</p>
                            <p className="text-xs text-muted-foreground">Likes</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{threadAnalytics?.retweets || 0}</p>
                            <p className="text-xs text-muted-foreground">RTs</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Profile Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-bold" data-testid="text-profile-clicks">{totalClicks}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total profile visits from threads</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="text-center">
                    <p className="text-4xl font-bold" data-testid="text-engagement-rate">{engagementRate}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Average across all threads</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thread Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Threads</span>
                      <span className="font-medium">{threads?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium">{postedThreads.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Drafts</span>
                      <span className="font-medium">{threads?.filter(t => t.status === "draft").length || 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  isLoading 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  trend: number;
  isLoading: boolean;
}) {
  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card data-testid={`card-metric-${title.toLowerCase()}`}>
      <CardContent className="pt-6">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-12" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Icon className="h-4 w-4" />
              <span className="text-sm">{title}</span>
            </div>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              <TrendIcon className="h-3 w-3" />
              <span>{Math.abs(trend)}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
