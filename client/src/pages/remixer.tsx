import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shuffle, Save, RefreshCw, User, Lightbulb, ArrowRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { VoicePack } from "@shared/schema";

interface RemixAnalysis {
  hookType: string;
  tweetCount: number;
  pattern: string;
  keyElements: string[];
}

interface RemixResult {
  analysis: RemixAnalysis;
  content: string[];
  cringeScore: number;
}

export default function Remixer() {
  const [originalThread, setOriginalThread] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("");
  const [remixResult, setRemixResult] = useState<RemixResult | null>(null);

  const { toast } = useToast();

  const { data: voicePacks, isLoading: loadingVoicePacks } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const remixMutation = useMutation({
    mutationFn: async (data: { originalThread: string; newTopic: string; voicePackId?: string }) => {
      const response = await apiRequest("POST", "/api/threads/remix", data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to remix thread");
      }
      return result as RemixResult;
    },
    onSuccess: (data) => {
      setRemixResult(data);
      toast({ title: "Thread remixed", description: "Your new thread is ready for review." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Remix failed", 
        description: error.message || "Please try again.", 
        variant: "destructive" 
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { topic: string; hookType: string; content: string[]; cringeScore: number; voicePackId?: string }) => {
      const response = await apiRequest("POST", "/api/threads", { ...data, status: "draft" });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/threads"] });
      toast({ title: "Thread saved", description: "Your remixed thread has been saved as a draft." });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleRemix = () => {
    if (!originalThread.trim()) {
      toast({ title: "Original thread required", description: "Please paste a viral thread to remix.", variant: "destructive" });
      return;
    }
    if (!newTopic.trim()) {
      toast({ title: "New topic required", description: "Please enter the topic for your remixed thread.", variant: "destructive" });
      return;
    }
    remixMutation.mutate({
      originalThread,
      newTopic,
      voicePackId: selectedVoicePack || undefined,
    });
  };

  const handleSave = () => {
    if (!remixResult) {
      toast({ title: "Nothing to save", description: "Remix a thread first.", variant: "destructive" });
      return;
    }
    saveMutation.mutate({
      topic: newTopic,
      hookType: remixResult.analysis.hookType,
      content: remixResult.content,
      cringeScore: remixResult.cringeScore,
      voicePackId: selectedVoicePack || undefined,
    });
  };

  const getCringeColor = (score: number) => {
    if (score <= 20) return "text-green-500";
    if (score <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Thread Remixer</h1>
          <p className="text-muted-foreground mt-1">
            Analyze viral threads and apply their winning structure to your topics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Original Thread
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="original-thread">Paste the viral thread to remix</Label>
                  <Textarea
                    id="original-thread"
                    placeholder="Paste the full thread here. Include all tweets separated by line breaks..."
                    value={originalThread}
                    onChange={(e) => setOriginalThread(e.target.value)}
                    className="min-h-[200px] resize-none"
                    data-testid="input-original-thread"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Copy the entire thread text, each tweet on a new line
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Your Version
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-topic">New Topic</Label>
                  <Input
                    id="new-topic"
                    placeholder="What should your remixed thread be about?"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    data-testid="input-new-topic"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voice Pack (Optional)</Label>
                  {loadingVoicePacks ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedVoicePack} onValueChange={setSelectedVoicePack}>
                      <SelectTrigger data-testid="select-voice-pack">
                        <SelectValue placeholder="Select a voice pack" />
                      </SelectTrigger>
                      <SelectContent>
                        {voicePacks?.map(pack => (
                          <SelectItem key={pack.id} value={pack.id}>
                            {pack.name} - {pack.style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleRemix}
                  disabled={remixMutation.isPending}
                  data-testid="button-remix"
                >
                  {remixMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing & Remixing...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Remix Thread
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* Analysis Card */}
            {remixResult && (
              <Card data-testid="card-analysis">
                <CardHeader>
                  <CardTitle className="text-lg">Structure Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{remixResult.analysis.hookType} hook</Badge>
                    <Badge variant="outline">{remixResult.analysis.tweetCount} tweets</Badge>
                    <Badge variant="outline" className={getCringeColor(remixResult.cringeScore)}>
                      {100 - remixResult.cringeScore}% authentic
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Pattern Detected:</p>
                    <p className="text-sm text-muted-foreground">{remixResult.analysis.pattern}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Elements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {remixResult.analysis.keyElements.map((element, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">-</span>
                          {element}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Remixed Thread Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background border rounded-lg p-4 space-y-4 max-h-[500px] overflow-y-auto" data-testid="preview-container">
                  {remixResult ? (
                    remixResult.content.map((tweet, index) => (
                      <TweetPreview
                        key={index}
                        content={tweet}
                        threadNumber={index + 1}
                        totalTweets={remixResult.content.length}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your remixed thread will appear here</p>
                      <p className="text-sm mt-1">Paste a viral thread and enter a new topic to get started</p>
                    </div>
                  )}
                </div>

                {remixResult && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-draft">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleRemix} disabled={remixMutation.isPending} data-testid="button-regenerate">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
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

function TweetPreview({ content, threadNumber, totalTweets }: { content: string; threadNumber: number; totalTweets: number }) {
  const charCount = content.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="border-b last:border-b-0 pb-4 last:pb-0" data-testid={`preview-tweet-${threadNumber}`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-[15px]">Your Name</span>
            <span className="text-muted-foreground text-sm">@yourhandle</span>
          </div>
          <p className="text-[15px] leading-snug whitespace-pre-wrap break-words">{content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{threadNumber}/{totalTweets}</span>
            <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
              {charCount}/280
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
