import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BetaBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("beta-banner-dismissed") === "true";
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("beta-banner-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="h-10 bg-primary/10 border-b flex items-center justify-center gap-2 px-4" data-testid="banner-beta">
      <span className="text-sm text-muted-foreground">
        App in Beta - Pricing Coming Soon
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleDismiss}
        data-testid="button-dismiss-banner"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
