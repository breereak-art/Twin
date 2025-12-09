import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Palette, Sparkles, Wand2, Type, Download, Layers } from "lucide-react";

const imageFeatures = [
  {
    id: "meme-generator",
    title: "Meme Generator",
    description: "Create viral memes with AI-generated captions that match your brand voice",
    icon: Type,
    features: ["Custom text overlays", "Trending formats", "Brand voice matching"],
  },
  {
    id: "quote-cards",
    title: "Quote Cards",
    description: "Transform your best tweets into shareable quote graphics",
    icon: Layers,
    features: ["Multiple templates", "Auto-styling", "One-click export"],
  },
  {
    id: "thread-visuals",
    title: "Thread Visuals",
    description: "Generate eye-catching images to boost engagement on your threads",
    icon: Sparkles,
    features: ["Hook images", "Data visualizations", "Carousel graphics"],
  },
  {
    id: "brand-graphics",
    title: "Brand Graphics",
    description: "Create consistent branded visuals using your color palette",
    icon: Palette,
    features: ["Logo integration", "Color consistency", "Template library"],
  },
];

export default function Images() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <h1 className="text-4xl font-bold" data-testid="text-images-title">
            AI Image Studio
          </h1>
          <Badge variant="secondary" data-testid="badge-coming-soon">
            Coming Soon
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-images-subtitle">
          Create stunning visuals that match your brand. Generate memes, quote cards, 
          and thread graphics using AI - all styled with your custom colors.
        </p>
      </div>

      <Card className="mb-8 border-dashed" data-testid="card-brand-colors">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Your Brand Colors</CardTitle>
          </div>
          <CardDescription>
            AI-generated images will automatically use your brand palette for consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded-md bg-primary" 
                title="Primary"
                data-testid="color-swatch-primary"
              />
              <div 
                className="w-10 h-10 rounded-md bg-secondary" 
                title="Secondary"
                data-testid="color-swatch-secondary"
              />
              <div 
                className="w-10 h-10 rounded-md bg-accent" 
                title="Accent"
                data-testid="color-swatch-accent"
              />
              <div 
                className="w-10 h-10 rounded-md bg-muted" 
                title="Muted"
                data-testid="color-swatch-muted"
              />
            </div>
            <Button variant="outline" size="sm" disabled data-testid="button-customize-colors">
              Customize Colors
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {imageFeatures.map((feature) => (
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
              <div className="flex flex-wrap gap-2 mb-4">
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
              <Button 
                variant="secondary"
                className="w-full"
                disabled
                data-testid={`button-try-${feature.id}`}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Try {feature.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50" data-testid="section-preview">
        <div className="flex items-start gap-4">
          <Download className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2" data-testid="text-preview-title">
              Export in multiple formats
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-preview-description">
              Download your creations in PNG, JPG, or WebP. All images are optimized 
              for social media with perfect dimensions for Twitter, LinkedIn, and Instagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
