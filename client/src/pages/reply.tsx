import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Zap, Copy, RefreshCw, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VoicePack } from "@shared/schema";

const replyTones = [
  { value: "friendly", label: "Friendly", description: "Warm and conversational" },
  { value: "witty", label: "Witty", description: "Clever with a touch of humor" },
  { value: "professional", label: "Professional", description: "Polished and insightful" },
  { value: "supportive", label: "Supportive", description: "Encouraging and empathetic" },
  { value: "curious", label: "Curious", description: "Thoughtful follow-up questions" },
];

export default function Reply() {
  const [tweetContent, setTweetContent] = useState("");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("");
  const [generatedReplies, setGeneratedReplies] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: voicePacks = [] } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reply/generate", {
        tweetContent,
        replyTone: selectedTone,
        voicePackId: selectedVoicePack || undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedReplies(data.replies || []);
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Failed to generate replies. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4" data-testid="text-reply-title">
          Reply Guy
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-reply-subtitle">
          Generate authentic, engaging replies to any tweet. Craft responses that 
          drive conversations and grow your network - all in your unique voice.
        </p>
      </div>

      <Card className="mb-8" data-testid="card-tweet-input">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Generate Reply</CardTitle>
          </div>
          <CardDescription>
            Paste a tweet and get AI-powered reply suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tweet to reply to</label>
            <Textarea
              placeholder="Paste the tweet you want to reply to..."
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              className="min-h-[100px]"
              data-testid="input-tweet-content"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Reply Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger data-testid="select-tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {replyTones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      <div className="flex flex-col">
                        <span>{tone.label}</span>
                        <span className="text-xs text-muted-foreground">{tone.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Voice Pack (optional)</label>
              <Select value={selectedVoicePack} onValueChange={setSelectedVoicePack}>
                <SelectTrigger data-testid="select-voice-pack">
                  <SelectValue placeholder="Use your voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No voice pack</SelectItem>
                  {voicePacks.map((pack) => (
                    <SelectItem key={pack.id} value={pack.id}>
                      {pack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => generateMutation.mutate()}
            disabled={!tweetContent.trim() || generateMutation.isPending}
            className="w-full"
            data-testid="button-generate-replies"
          >
            {generateMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Replies
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedReplies.length > 0 && (
        <Card className="mb-8" data-testid="card-generated-replies">
          <CardHeader>
            <CardTitle className="text-lg">Generated Replies</CardTitle>
            <CardDescription>
              Choose a reply or use as inspiration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedReplies.map((reply, index) => (
              <div
                key={index}
                className="p-4 rounded-md bg-muted/50 flex items-start gap-4"
                data-testid={`reply-option-${index}`}
              >
                <div className="flex-1">
                  <p className="text-sm">{reply}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reply.length}/280 characters
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(reply, index)}
                  data-testid={`button-copy-${index}`}
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {replyTones.map((tone) => (
          <Card key={tone.value} data-testid={`card-tone-${tone.value}`}>
            <CardHeader className="flex flex-row flex-wrap items-center gap-4 space-y-0">
              <div className="p-3 rounded-md bg-muted">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-base">{tone.label}</CardTitle>
                <CardDescription>{tone.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
