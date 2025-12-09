# Twin - Content Operating System

## Overview

Twin is an AI-powered content operating system for creators, designed to clone writing voices and generate viral Twitter threads. The platform enables content creators, agencies, and ghostwriters to scale content production while maintaining authentic personal voice through AI-powered voice cloning, thread generation, content repurposing, and coaching features.

Key capabilities:
- **Voice Packs**: Personalized writing style profiles that capture unique voice
- **Thread Generation**: AI-generated Twitter threads that match user's style
- **Content Repurposing**: Convert threads to LinkedIn posts, newsletters, or video scripts
- **Agency Dashboard**: Multi-client management for content agencies
- **AI Coaching**: Personalized content improvement recommendations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api/*`
- **AI Integration**: @iqai/adk (Agent Development Kit) with Claude claude-sonnet-4-5 model via Anthropic API
- **Development**: Hot module reloading via Vite middleware in development

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)

### Project Structure
```
client/           # React frontend application
  src/
    components/   # UI components (shadcn/ui)
    pages/        # Page components (route handlers)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between frontend/backend
  schema.ts       # Drizzle database schema
```

### AI Implementation Pattern
All AI features use a centralized helper function that leverages ADK's AgentBuilder:
- Thread generation with voice pack personality matching
- Thread remixing to adapt viral patterns to new topics
- Content repurposing across platforms (LinkedIn, newsletters, scripts)
- Reply generation with customizable tones
- Coaching tips generation based on user analytics

## External Dependencies

### AI Services
- **@iqai/adk**: Agent Development Kit for building AI agents
- **Anthropic Claude API**: Primary LLM provider (claude-sonnet-4-5 model)
- Environment variables: `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL` (or Replit AI Integrations equivalents)

### Database
- **PostgreSQL**: Primary database
- **Drizzle ORM**: Type-safe database access
- Environment variable: `DATABASE_URL`

### UI Libraries
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **react-icons**: Additional platform icons (social media)

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development