import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Brain, Zap, Target, MessageSquare, Send, Lightbulb, TrendingUp } from "lucide-react";

const replyFeatures = [
  {
    id: "context-analysis",
    title: "Context Analysis",
    description: "AI analyzes tweet context, sentiment, and intent to craft relevant responses",
    icon: Brain,
    features: ["Sentiment detection", "Topic extraction", "Intent analysis"],
  },
  {
    id: "voice-matching",
    title: "Voice Matching",
    description: "Replies are generated in your unique voice using your trained Voice Pack",
    icon: Target,
    features: ["Style matching", "Tone adaptation", "Vocabulary alignment"],
  },
  {
    id: "quick-replies",
    title: "Quick Replies",
    description: "Generate multiple reply options instantly for fast engagement",
    icon: Zap,
    features: ["3 reply options", "One-click copy", "Edit before posting"],
  },
  {
    id: "engagement-boost",
    title: "Engagement Boost",
    description: "Craft replies designed to spark conversation and increase visibility",
    icon: TrendingUp,
    features: ["Hook phrases", "Question prompts", "Call-to-action"],
  },
];

export default function Reply() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <h1 className="text-4xl font-bold" data-testid="text-reply-title">
            Reply Guy
          </h1>
          <Badge variant="secondary" data-testid="badge-coming-soon">
            Coming Soon
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-reply-subtitle">
          Never miss an engagement opportunity. Paste any tweet and get AI-powered reply 
          suggestions that match your voice and maximize engagement.
        </p>
      </div>

      <Card className="mb-8 border-dashed" data-testid="card-tweet-input">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Tweet to Reply To</CardTitle>
          </div>
          <CardDescription>
            Paste a tweet URL or content to generate context-aware replies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Paste tweet URL or tweet content here..."
            className="min-h-24 resize-none"
            disabled
            data-testid="input-tweet-content"
          />
          <div className="flex flex-wrap gap-3">
            <Button disabled data-testid="button-analyze">
              <Brain className="h-4 w-4 mr-2" />
              Analyze Tweet
            </Button>
            <Button variant="outline" disabled data-testid="button-generate-replies">
              <Zap className="h-4 w-4 mr-2" />
              Generate Replies
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-muted/30 border-dashed" data-testid="card-reply-preview">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">AI Reply Suggestions</CardTitle>
          </div>
          <CardDescription>
            Choose from multiple reply options tailored to your voice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className="p-4 rounded-md bg-background border border-dashed flex items-center justify-between gap-4"
                data-testid={`reply-option-${num}`}
              >
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground italic">
                    Reply option {num} will appear here...
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled data-testid={`button-copy-${num}`}>
                    Copy
                  </Button>
                  <Button size="sm" disabled data-testid={`button-send-${num}`}>
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {replyFeatures.map((feature) => (
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

      <div className="mt-12 p-6 rounded-lg bg-muted/50" data-testid="section-workflow">
        <div className="flex items-start gap-4">
          <MessageCircle className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-workflow-title">
              Seamless Reply Workflow
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-workflow-description">
              Copy a tweet link, paste it here, and get instant reply suggestions. Connect your 
              Twitter account to post replies directly from Twin with one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
