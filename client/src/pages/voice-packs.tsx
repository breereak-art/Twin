import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Mic2, User, Briefcase, Coffee, Star, Upload, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { VoicePack } from "@shared/schema";

const styleIcons = {
  personal: User,
  professional: Briefcase,
  casual: Coffee,
};

const styleLabels = {
  personal: "Personal",
  professional: "Professional", 
  casual: "Casual",
};

export default function VoicePacks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPack, setNewPack] = useState({
    name: "",
    description: "",
    style: "personal",
    writingSamples: [] as string[],
    currentSample: "",
  });

  const { toast } = useToast();

  const { data: voicePacks, isLoading } = useQuery<VoicePack[]>({
    queryKey: ["/api/voice-packs"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; style: string; writingSamples: string[] }) => {
      const response = await apiRequest("POST", "/api/voice-packs", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voice-packs"] });
      setIsDialogOpen(false);
      setNewPack({ name: "", description: "", style: "personal", writingSamples: [], currentSample: "" });
      toast({ title: "Voice pack created", description: "Your new voice pack is ready to use." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create voice pack.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/voice-packs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voice-packs"] });
      toast({ title: "Voice pack deleted" });
    },
  });

  const addSample = () => {
    if (newPack.currentSample.trim()) {
      setNewPack(prev => ({
        ...prev,
        writingSamples: [...prev.writingSamples, prev.currentSample.trim()],
        currentSample: "",
      }));
    }
  };

  const removeSample = (index: number) => {
    setNewPack(prev => ({
      ...prev,
      writingSamples: prev.writingSamples.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = () => {
    if (!newPack.name.trim()) {
      toast({ title: "Name required", description: "Please enter a name for your voice pack.", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      name: newPack.name,
      description: newPack.description,
      style: newPack.style,
      writingSamples: newPack.writingSamples,
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-page-title">Voice Packs</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your personalized writing styles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-voice-pack">
              <Plus className="mr-2 h-4 w-4" />
              Create Voice Pack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Voice Pack</DialogTitle>
              <DialogDescription>
                Train AI on your unique writing style with samples of your best work.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="My Personal Voice"
                  value={newPack.name}
                  onChange={(e) => setNewPack(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-voice-pack-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Casual, witty, straight-to-the-point..."
                  value={newPack.description}
                  onChange={(e) => setNewPack(prev => ({ ...prev, description: e.target.value }))}
                  data-testid="input-voice-pack-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={newPack.style} onValueChange={(value) => setNewPack(prev => ({ ...prev, style: value }))}>
                  <SelectTrigger data-testid="select-voice-pack-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Writing Samples</Label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Paste a tweet or writing sample..."
                    value={newPack.currentSample}
                    onChange={(e) => setNewPack(prev => ({ ...prev, currentSample: e.target.value }))}
                    className="min-h-[80px]"
                    data-testid="input-writing-sample"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSample} data-testid="button-add-sample">
                  <Upload className="mr-2 h-3 w-3" />
                  Add Sample
                </Button>
                {newPack.writingSamples.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPack.writingSamples.map((sample, i) => (
                      <Badge key={i} variant="secondary" className="max-w-[200px] truncate">
                        {sample.slice(0, 30)}...
                        <button
                          onClick={() => removeSample(i)}
                          className="ml-1 hover:text-destructive"
                          data-testid={`button-remove-sample-${i}`}
                        >
                          x
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending} data-testid="button-save-voice-pack">
                {createMutation.isPending ? "Creating..." : "Create Voice Pack"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : voicePacks && voicePacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voicePacks.map(pack => {
            const StyleIcon = styleIcons[pack.style as keyof typeof styleIcons] || User;
            return (
              <Card key={pack.id} data-testid={`card-voice-pack-${pack.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <StyleIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-mono">{pack.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {styleLabels[pack.style as keyof typeof styleLabels] || pack.style}
                        </Badge>
                      </div>
                    </div>
                    {pack.isDefault && <Star className="h-4 w-4 text-primary" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{pack.description || "No description"}</p>
                  {pack.writingSamples && pack.writingSamples.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {pack.writingSamples.length} writing sample{pack.writingSamples.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(pack.id)}
                    data-testid={`button-delete-voice-pack-${pack.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Mic2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No voice packs yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first voice pack to start generating threads in your unique style.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-voice-pack">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Voice Pack
          </Button>
        </Card>
      )}
    </div>
  );
}
