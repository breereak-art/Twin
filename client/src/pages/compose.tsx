import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Save, Calendar, RefreshCw, AlertTriangle, CheckCircle2, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { VoicePack, Thread } from "@shared/schema";

const hookTypes = [
  { value: "negative", label: "Negative", example: "Stop doing X if you want Y" },
  { value: "numbers", label: "Numbers", example: "7 ways to 10x your Z" },
  { value: "story", label: "Story", example: "I spent 3 years learning..." },
  { value: "contrarian", label: "Contrarian", example: "Unpopular opinion: X is dead" },
  { value: "list", label: "List", example: "Everything I learned about X" },
];

export default function Compose() {
  const [topic, setTopic] = useState("");
  const [hookType, setHookType] = useState("negative");
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [cringeScore, setCringeScore] = useState<number | null>(null);

  const { toast } = useToast();

  const { data: voicePacks, isLoading: loadingVoicePacks } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { topic: string; hookType: string; voicePackId?: string }) => {
      const response = await apiRequest("/api/threads/generate", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response as { content: string[]; cringeScore: number };
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setCringeScore(data.cringeScore);
      toast({ title: "Thread generated", description: "Your thread is ready for review." });
    },
    onError: () => {
      toast({ title: "Generation failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { topic: string; hookType: string; content: string[]; cringeScore: number; voicePackId?: string }) => {
      return apiRequest("/api/threads", {
        method: "POST",
        body: JSON.stringify({ ...data, status: "draft" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/threads"] });
      toast({ title: "Thread saved", description: "Your thread has been saved as a draft." });
    },
    onError: () => {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({ title: "Topic required", description: "Please enter a topic for your thread.", variant: "destructive" });
      return;
    }
    generateMutation.mutate({
      topic,
      hookType,
      voicePackId: selectedVoicePack || undefined,
    });
  };

  const handleSave = () => {
    if (generatedContent.length === 0) {
      toast({ title: "Nothing to save", description: "Generate a thread first.", variant: "destructive" });
      return;
    }
    saveMutation.mutate({
      topic,
      hookType,
      content: generatedContent,
      cringeScore: cringeScore || 0,
      voicePackId: selectedVoicePack || undefined,
    });
  };

  const getCringeColor = (score: number) => {
    if (score <= 20) return "text-green-500";
    if (score <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getCringeProgressColor = (score: number) => {
    if (score <= 20) return "bg-green-500";
    if (score <= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Thread Composer</h1>
          <p className="text-muted-foreground mt-1">
            Generate viral Twitter threads with AI-powered hooks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="What should your thread be about?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    data-testid="input-topic"
                  />
                </div>

                {/* Voice Pack Selector */}
                <div className="space-y-2">
                  <Label>Voice Pack</Label>
                  {loadingVoicePacks ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedVoicePack} onValueChange={setSelectedVoicePack}>
                      <SelectTrigger data-testid="select-voice-pack">
                        <SelectValue placeholder="Select a voice pack (optional)" />
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

                {/* Hook Type Selector */}
                <div className="space-y-3">
                  <Label>Hook Type</Label>
                  <RadioGroup value={hookType} onValueChange={setHookType} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hookTypes.map(hook => (
                      <Label
                        key={hook.value}
                        htmlFor={hook.value}
                        className="flex items-start gap-3 p-3 rounded-md border cursor-pointer hover-elevate [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                      >
                        <RadioGroupItem value={hook.value} id={hook.value} data-testid={`radio-hook-${hook.value}`} />
                        <div className="space-y-1">
                          <span className="font-medium text-sm">{hook.label}</span>
                          <p className="text-xs text-muted-foreground">{hook.example}</p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Generate Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  data-testid="button-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Thread
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Cringe Meter */}
            {cringeScore !== null && (
              <Card data-testid="card-cringe-meter">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {cringeScore <= 20 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className={`h-5 w-5 ${getCringeColor(cringeScore)}`} />
                    )}
                    Cringe Meter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Authenticity Score</span>
                      <span className={`font-medium ${getCringeColor(cringeScore)}`}>
                        {100 - cringeScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getCringeProgressColor(cringeScore)}`}
                        style={{ width: `${100 - cringeScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cringeScore <= 20
                        ? "Your thread sounds authentic and natural."
                        : cringeScore <= 50
                        ? "Some corporate jargon detected. Consider revising."
                        : "High cringe alert! Too much buzzword usage."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Twitter Preview */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background border rounded-lg p-4 space-y-4" data-testid="preview-container">
                  {generatedContent.length > 0 ? (
                    generatedContent.map((tweet, index) => (
                      <TweetPreview
                        key={index}
                        content={tweet}
                        threadNumber={index + 1}
                        totalTweets={generatedContent.length}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Your thread preview will appear here</p>
                      <p className="text-sm mt-1">Generate a thread to see it</p>
                    </div>
                  )}
                </div>

                {generatedContent.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-draft">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="flex-1" data-testid="button-schedule">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
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
