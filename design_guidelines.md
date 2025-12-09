# Twin - Design Guidelines

## Design Approach

**Reference-Based:** Drawing from Linear's precision + Notion's approachable editing + Twitter's familiar content display

**Justification:** Twin targets content creators who value both aesthetics and efficiency. The product bridges creative expression (thread writing) with analytical tools (performance data), requiring a design that feels premium yet accessible. Linear's clean typography and spatial confidence paired with Notion's flexible editor patterns creates the ideal foundation.

## Core Design Principles

1. **Confidence Over Caution** - Bold typography, generous spacing, clear hierarchy
2. **Creator-First** - Every interaction should feel empowering, not corporate
3. **Preview Obsession** - Live thread previews are the hero; make them pixel-perfect
4. **Data as Insight** - Analytics should tell stories, not just show numbers

## Typography

**Font Families:**
- Primary: Inter (headings, UI, body)
- Monospace: JetBrains Mono (for voice pack names, technical labels)

**Hierarchy:**
- Page Titles: text-4xl font-bold (tracking-tight)
- Section Headers: text-2xl font-semibold
- Component Titles: text-lg font-medium
- Body/UI: text-base
- Captions/Meta: text-sm text-muted-foreground
- Thread Preview Text: text-[15px] leading-snug (matches Twitter's native rendering)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight relationships: gap-2, p-2
- Component padding: p-4, p-6
- Section spacing: gap-8, py-12
- Page margins: px-6 lg:px-8, max-w-7xl mx-auto

**Grid Strategy:**
- Dashboard: 2-column on desktop (sidebar + main), single column mobile
- Thread Editor: 60/40 split (editor controls / live preview)
- Analytics: 4-column metric grid → 2 col tablet → 1 col mobile

## Component Library

### Navigation & Layout
**Sidebar (Dashboard):**
- Fixed left, w-64, border-r
- Logo at top (h-12)
- Nav items with icons (Heroicons), subtle hover states
- Bottom: User profile + settings

**Top Bar:**
- h-14, border-b, sticky
- Breadcrumbs (left), Actions (right)
- Beta badge: Small pill with "BETA" text

### Core Components

**Thread Composer (Main Editor):**
- Split panel design
- Left: Textarea with character counter, voice selector dropdown, hook generator button
- Right: Live Twitter preview with authentic mobile frame, username/avatar, timestamp
- Bottom toolbar: Generate button (primary, large), Schedule, Save Draft

**Voice Pack Selector:**
- Card-based grid when choosing
- Dropdown when in editor
- Each pack shows: Name, emoji/icon, description snippet, sample text preview

**Tweet Preview Card:**
- Exact Twitter dimensions and typography
- Avatar (40px circle), username (@handle), timestamp
- Thread numbering (1/7, 2/7)
- Engagement buttons (visual only, not functional)

**Magic Generate Button:**
- Large, gradient background (subtle animation optional)
- Icon: Sparkles/wand
- States: Default, Loading (spinner), Success (checkmark briefly)

**Cringe Meter:**
- Horizontal gauge, 0-100 scale
- Green zone (0-20), Yellow (21-50), Red (51-100)
- Animated needle on check

**Analytics Cards:**
- Metric tiles: 2-column grid
- Large number (text-3xl), label below (text-sm)
- Trend indicator (↑ ↓ with percentage)
- Sparkline charts for historical view

**Calendar Scheduler:**
- Week view by default
- Drag-drop indicators
- Scheduled posts as compact cards with preview thumbnail
- Time slots clearly marked

### Forms & Inputs
- Consistent rounded corners (rounded-lg)
- Focus states with ring-2
- Labels always above inputs
- Helper text below in text-sm
- Textarea for thread content with auto-expanding height

### Data Display
**Performance Table:**
- Compact rows
- Sortable columns
- Hover highlights
- Mini sparklines in cells for engagement trends

## Images

**Landing Page Hero:**
- Full-width hero section with gradient background (not image)
- Centered: Large headline "Your Digital Self. Only Better."
- Subheading explaining voice cloning
- CTA buttons (Start Free Trial, Watch Demo) with backdrop-blur-sm bg-white/10
- Mockup below fold: Screenshot of thread editor showing before/after transformation

**Dashboard:**
- Empty states use simple illustrations (not photos)
- Tutorial cards use icon + minimal graphics
- No decorative hero images in dashboard

**Thread Preview:**
- User avatars pulled from Twitter API or placeholder
- Generated meme/images displayed in preview cards when applicable

## Special Interactions

**Voice Cloning Upload:**
- Drag-drop zone with dashed border
- Upload progress with percentage
- Sample text appears as pills/tags below

**Hook A/B Selector:**
- Radio cards showing 5 hook variants
- Hover to preview full thread with that hook
- Select to apply

**Beta Header:**
- Dismissible banner at top: "App in Beta - Pricing Coming Soon"
- Subtle, non-intrusive (h-10, border-b)

## Responsive Strategy
- Desktop-first design for dashboard/editor (creator tools are desktop-heavy)
- Mobile: Stack panels vertically, collapsible sidebar
- Thread previews always mobile-sized (authenticity matters)