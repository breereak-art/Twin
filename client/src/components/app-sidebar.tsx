import { Home, Mic2, FileText, Shuffle, Repeat, Calendar, BarChart3, Settings, Sparkles, CreditCard, Link2, ImageIcon, MessageCircle, Building2, Brain } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Voice Packs", url: "/voice-packs", icon: Mic2 },
  { title: "Compose", url: "/compose", icon: FileText },
  { title: "Remixer", url: "/remixer", icon: Shuffle },
  { title: "Repurpose", url: "/repurpose", icon: Repeat },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Connect", url: "/connect", icon: Link2 },
  { title: "Images", url: "/images", icon: ImageIcon },
  { title: "Reply Guy", url: "/reply", icon: MessageCircle },
  { title: "Agency", url: "/agency", icon: Building2 },
  { title: "AI Coach", url: "/coaching", icon: Brain },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Twin</span>
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" data-testid="link-nav-settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
