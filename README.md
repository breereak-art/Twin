# Twin - Content Operating System

Twin is an AI-powered content operating system for creators, designed to clone writing voices and generate viral Twitter threads. Built for the hackathon using **@iqai/adk** (Agent Development Kit for TypeScript).

## Features

- **Voice Packs**: Create personalized writing style profiles that capture your unique voice
- **Thread Generation**: Generate viral Twitter threads with AI that sounds like you
- **Thread Remix**: Analyze viral threads and remix them into new topics
- **Content Repurposing**: Convert threads to LinkedIn posts, newsletters, or video scripts
- **Reply Guy**: Generate contextual, authentic Twitter replies
- **AI Coach**: Get personalized tips to improve your content
- **Agency Dashboard**: Manage multiple clients and their voice packs
- **Connect**: Link your social media accounts

## ADK-TS Integration

This project demonstrates the use of **@iqai/adk** (Agent Development Kit for TypeScript) for building AI-powered features. ADK-TS provides a clean, declarative way to create AI agents using the AgentBuilder pattern.

### Implementation

All AI features use a centralized helper function that leverages ADK's AgentBuilder:

```typescript
import { AgentBuilder } from "@iqai/adk";

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  const { runner } = await AgentBuilder
    .create("twin-ai")
    .withModel("claude-sonnet-4-5")
    .withInstruction(systemPrompt)
    .build();
  
  const result = await runner.runAsync({ userId: "system", message: userMessage });
  return result || "";
}
```

### AI-Powered Endpoints

| Endpoint | Feature | Description |
|----------|---------|-------------|
| `POST /api/threads/generate` | Thread Generation | Creates viral Twitter threads based on topics and voice packs |
| `POST /api/threads/remix` | Thread Remix | Analyzes and remixes viral thread patterns into new topics |
| `POST /api/threads/repurpose` | Content Repurposing | Converts threads to LinkedIn, newsletters, or scripts |
| `POST /api/reply/generate` | Reply Guy | Generates contextual Twitter replies in multiple tones |
| `GET /api/coaching/tips` | AI Coach | Provides personalized content improvement tips |

### Why ADK-TS?

- **Clean API**: The AgentBuilder pattern provides a fluent, readable way to configure AI agents
- **Model Flexibility**: Easy to swap models (claude-sonnet-4-5, etc.)
- **Instruction Management**: System prompts are cleanly separated from user messages
- **Async Runner**: Built-in async support for non-blocking AI calls

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: @iqai/adk with Anthropic Claude
- **State Management**: TanStack React Query

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Anthropic API key (via Replit AI Integrations)

### Environment Variables

The following environment variables are required:

```
DATABASE_URL=postgresql://...
AI_INTEGRATIONS_ANTHROPIC_API_KEY=your-api-key
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=https://...
```

### Development

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The app runs on port 5000 with hot reload enabled.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
twin/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components (shadcn/ui)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API routes with ADK-TS integration
│   ├── storage.ts          # Database storage interface
│   └── db.ts               # Database connection
├── shared/                 # Shared code
│   └── schema.ts           # Drizzle schema (types for frontend/backend)
└── README.md
```

## API Reference

### Voice Packs

- `GET /api/voice-packs` - List all voice packs
- `POST /api/voice-packs` - Create a new voice pack
- `DELETE /api/voice-packs/:id` - Delete a voice pack

### Threads

- `GET /api/threads` - List all threads
- `POST /api/threads` - Save a thread
- `PATCH /api/threads/:id` - Update a thread
- `DELETE /api/threads/:id` - Delete a thread
- `POST /api/threads/generate` - Generate a new thread with AI
- `POST /api/threads/remix` - Remix an existing thread
- `POST /api/threads/repurpose` - Repurpose a thread to another format

### AI Features

- `POST /api/reply/generate` - Generate reply suggestions
- `GET /api/coaching/tips` - Get AI coaching tips

### Agency

- `GET /api/agency/clients` - List agency clients
- `POST /api/agency/clients` - Add a client
- `PATCH /api/agency/clients/:id` - Update a client
- `DELETE /api/agency/clients/:id` - Delete a client

## License

MIT
