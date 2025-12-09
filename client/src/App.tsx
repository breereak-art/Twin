import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { BetaBanner } from "@/components/beta-banner";
import Home from "@/pages/home";
import VoicePacks from "@/pages/voice-packs";
import Compose from "@/pages/compose";
import Remixer from "@/pages/remixer";
import Repurpose from "@/pages/repurpose";
import Schedule from "@/pages/schedule";
import Analytics from "@/pages/analytics";
import Pricing from "@/pages/pricing";
import Connect from "@/pages/connect";
import Images from "@/pages/images";
import Reply from "@/pages/reply";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/voice-packs" component={VoicePacks} />
      <Route path="/compose" component={Compose} />
      <Route path="/remixer" component={Remixer} />
      <Route path="/repurpose" component={Repurpose} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/connect" component={Connect} />
      <Route path="/images" component={Images} />
      <Route path="/reply" component={Reply} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <BetaBanner />
                <header className="h-14 flex items-center justify-between gap-4 px-4 border-b sticky top-0 z-50 bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
