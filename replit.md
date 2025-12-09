# Twin - Content Operating System

## Overview

Twin is a content operating system for creators, designed to clone writing voices and generate viral Twitter threads. The platform combines AI-powered content generation with analytics and scheduling tools, enabling creators to maintain their authentic voice while scaling content production.

The application follows a modern full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence. Core functionality includes voice pack creation (personalized writing style profiles), AI-powered thread generation with multiple hook types, content scheduling, and performance analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React Context for UI state (theme, sidebar)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based architecture with shared components. Key pages include Home (landing), Voice Packs (style profile management), Compose (thread generation), Schedule (calendar view), and Analytics (performance metrics).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API with `/api` prefix
- **AI Integration**: Anthropic Claude via Replit AI Integrations for content generation
- **Database ORM**: Drizzle ORM with PostgreSQL

The server uses a modular structure with separate files for routes, database connections, and storage abstractions. A storage interface pattern allows for easy testing and potential database swapping.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Key Tables**:
  - `users`: User accounts with subscription tiers and brand colors
  - `voicePacks`: Personalized writing style profiles with samples
  - `threads`: Generated content with status tracking (draft/scheduled/posted)
  - `analytics`: Performance metrics per thread
  - `hooks`: Viral hook templates library

### Authentication
- Currently using demo user ID for development
- Schema supports Replit Auth integration via user ID references
- Subscription tier tracking built into user model

### Build and Development
- **Development**: `npm run dev` runs both Vite dev server and Express with hot reload
- **Production Build**: Custom build script using esbuild for server bundling and Vite for client
- **Database Migrations**: Drizzle Kit with `npm run db:push`

## External Dependencies

### AI Services
- **Anthropic Claude**: Content generation via Replit AI Integrations (`AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY`)

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable

### File Upload (Configured but may not be active)
- **Uppy**: Client-side upload library with AWS S3 integration configured

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `zod` / `drizzle-zod`: Schema validation
- `date-fns`: Date manipulation for scheduling
- `lucide-react`: Icon library
- Full shadcn/ui component suite via Radix UI primitives