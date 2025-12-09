import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Copy, RefreshCw, Linkedin, Mail, Video, Check, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { VoicePack, Thread } from "@shared/schema";

interface RepurposeResult {
  format: string;
  title: string;
  content: string;
  summary: string;
  wordCount: number;
}

const formatOptions = [
  { value: "linkedin", label: "LinkedIn Post", icon: Linkedin, description: "Professional networking post" },
  { value: "newsletter", label: "Newsletter", icon: Mail, description: "Email newsletter format" },
  { value: "script", label: "Video Script", icon: Video, description: "Video or podcast script" },
];

export default function Repurpose() {
  const [inputMode, setInputMode] = useState<"existing" | "paste">("existing");
  const [selectedThread, setSelectedThread] = useState<string>("");
  const [pastedContent, setPastedContent] = useState("");
  const [targetFormat, setTargetFormat] = useState<string>("linkedin");
  const [selectedVoicePack, setSelectedVoicePack] = useState<string>("");
  const [repurposeResult, setRepurposeResult] = useState<RepurposeResult | null>(null);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  const { data: threads, isLoading: loadingThreads } = useQuery<Thread[]>({
    queryKey: ["/api/threads"],
  });

  const { data: voicePacks, isLoading: loadingVoicePacks } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const repurposeMutation = useMutation({
    mutationFn: async (data: { content: string[]; targetFormat: string; voicePackId?: string }) => {
      const response = await apiRequest("POST", "/api/threads/repurpose", data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to repurpose thread");
      }
      return result as RepurposeResult;
    },
    onSuccess: (data) => {
      setRepurposeResult(data);
      toast({ title: "Content repurposed", description: `Your ${data.format} content is ready.` });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Repurpose failed", 
        description: error.message || "Please try again.", 
        variant: "destructive" 
      });
    },
  });

  const getThreadContent = (): string[] | null => {
    if (inputMode === "existing" && selectedThread) {
      const thread = threads?.find(t => t.id === selectedThread);
      return thread?.content || null;
    } else if (inputMode === "paste" && pastedContent.trim()) {
      return pastedContent.split("\n").filter(line => line.trim());
    }
    return null;
  };

  const handleRepurpose = () => {
    const content = getThreadContent();
    if (!content || content.length === 0) {
      toast({ 
        title: "Content required", 
        description: inputMode === "existing" 
          ? "Please select a thread to repurpose." 
          : "Please paste thread content.", 
        variant: "destructive" 
      });
      return;
    }
    if (!targetFormat) {
      toast({ title: "Format required", description: "Please select a target format.", variant: "destructive" });
      return;
    }
    repurposeMutation.mutate({
      content,
      targetFormat,
      voicePackId: selectedVoicePack || undefined,
    });
  };

  const handleCopy = async () => {
    if (!repurposeResult) return;
    try {
      await navigator.clipboard.writeText(repurposeResult.content);
      setCopied(true);
      toast({ title: "Copied", description: "Content copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please select and copy manually.", variant: "destructive" });
    }
  };

  const getFormatIcon = (format: string) => {
    const option = formatOptions.find(f => f.value === format);
    const Icon = option?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Omni-Repurpose</h1>
          <p className="text-muted-foreground mt-1">
            Transform your Twitter threads into LinkedIn posts, newsletters, and video scripts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Source Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "existing" | "paste")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing" data-testid="tab-existing">Select Thread</TabsTrigger>
                    <TabsTrigger value="paste" data-testid="tab-paste">Paste Content</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Select a thread from your library</Label>
                      {loadingThreads ? (
                        <Skeleton className="h-10 w-full" />
                      ) : threads && threads.length > 0 ? (
                        <Select value={selectedThread} onValueChange={setSelectedThread}>
                          <SelectTrigger data-testid="select-thread">
                            <SelectValue placeholder="Choose a thread" />
                          </SelectTrigger>
                          <SelectContent>
                            {threads.map(thread => (
                              <SelectItem key={thread.id} value={thread.id}>
                                {thread.topic} ({thread.content?.length || 0} tweets)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No threads yet. Create one in Compose or paste content below.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="paste" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="paste-content">Paste your thread content</Label>
                      <Textarea
                        id="paste-content"
                        placeholder="Paste your Twitter thread here. Each tweet on a new line..."
                        value={pastedContent}
                        onChange={(e) => setPastedContent(e.target.value)}
                        className="min-h-[200px] resize-none"
                        data-testid="input-paste-content"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tip: Each line will be treated as a separate tweet
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Output Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Format</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {formatOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTargetFormat(option.value)}
                        className={`flex items-center gap-3 p-3 rounded-md border text-left transition-colors ${
                          targetFormat === option.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover-elevate"
                        }`}
                        data-testid={`button-format-${option.value}`}
                      >
                        <option.icon className={`h-5 w-5 ${targetFormat === option.value ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="flex-1">
                          <p className={`font-medium ${targetFormat === option.value ? "text-foreground" : ""}`}>
                            {option.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {targetFormat === option.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
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
                  onClick={handleRepurpose}
                  disabled={repurposeMutation.isPending}
                  data-testid="button-repurpose"
                >
                  {repurposeMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Transforming...
                    </>
                  ) : (
                    <>
                      {getFormatIcon(targetFormat)}
                      <span className="ml-2">Repurpose to {formatOptions.find(f => f.value === targetFormat)?.label}</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    {repurposeResult && getFormatIcon(repurposeResult.format)}
                    Repurposed Content
                  </span>
                  {repurposeResult && (
                    <Badge variant="secondary">{repurposeResult.wordCount} words</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {repurposeResult ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg" data-testid="text-result-title">
                        {repurposeResult.title}
                      </h3>
                      {repurposeResult.summary && (
                        <p className="text-sm text-muted-foreground" data-testid="text-result-summary">
                          {repurposeResult.summary}
                        </p>
                      )}
                    </div>
                    <div 
                      className="bg-muted/50 border rounded-lg p-4 max-h-[400px] overflow-y-auto"
                      data-testid="content-result"
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        {repurposeResult.content}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={handleCopy}
                        data-testid="button-copy"
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={handleRepurpose} 
                        disabled={repurposeMutation.isPending}
                        data-testid="button-regenerate"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your repurposed content will appear here</p>
                    <p className="text-sm mt-1">Select a thread and format to get started</p>
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
