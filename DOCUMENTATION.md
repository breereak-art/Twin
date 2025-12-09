# Twin - Content Operating System

## Complete Documentation

---

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
   - [Voice Packs](#voice-packs)
   - [Thread Composer](#thread-composer)
   - [Thread Remix](#thread-remix)
   - [Content Repurposing](#content-repurposing)
   - [Reply Guy](#reply-guy)
   - [AI Coach](#ai-coach)
   - [Connect](#connect)
   - [Agency Dashboard](#agency-dashboard)
   - [Analytics](#analytics)
   - [Schedule](#schedule)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Future Roadmap](#future-roadmap)
7. [Getting Started](#getting-started)

---

## Overview

Twin is a **Content Operating System for Creators** - an all-in-one platform designed to help content creators, thought leaders, and agencies scale their content production while maintaining authentic voice and maximizing engagement.

### What Makes Twin Different

- **Voice Cloning**: Unlike generic AI tools, Twin learns YOUR writing style through Voice Packs
- **Cringe Detection**: Built-in AI filters to keep content authentic (no corporate buzzwords)
- **Multi-Platform Ready**: One thread, multiple platforms (X, LinkedIn, Threads, Bluesky)
- **Agency-First**: Manage multiple clients from a single dashboard
- **AI-Powered Everything**: From generation to coaching to optimization

### Target Users

1. **Individual Creators**: Writers, thought leaders, entrepreneurs building personal brands
2. **Content Agencies**: Teams managing multiple client accounts
3. **Marketing Teams**: In-house teams needing consistent content output
4. **Ghostwriters**: Professionals writing for multiple voices

---

## Core Features

### Voice Packs

**What It Is:**
Voice Packs are personalized writing style profiles that capture your unique voice, tone, and writing patterns. They're the foundation of everything Twin generates.

**How It Works:**
1. Create a Voice Pack with a name (e.g., "Professional Thought Leader", "Casual Storyteller")
2. Select a writing style: Casual, Professional, Storytelling, Educational, Provocative, or Inspirational
3. Add 3-5 writing samples (your best tweets, posts, or paragraphs)
4. Twin analyzes these samples to understand your vocabulary, sentence structure, humor style, and patterns

**Use Cases:**
- Personal brand consistency across all content
- Agency clients - one Voice Pack per client
- Different contexts - "Casual Twitter" vs "LinkedIn Professional"
- Ghostwriting - capture the voice of who you're writing for

**Technical Details:**
- Stored in PostgreSQL with array fields for writing samples
- Samples are concatenated and fed to Claude as context
- Used across Thread Generation, Reply Guy, and Repurposing

---

### Thread Composer

**What It Is:**
The main content generation engine. Enter a topic, select a hook type, and get a viral-ready Twitter thread.

**Hook Types Available:**

| Hook Type | Description | Example |
|-----------|-------------|---------|
| **Negative** | Starts with what's wrong | "Stop doing X. It's killing your growth..." |
| **Numbers** | Data-driven opener | "I analyzed 1,000 viral threads. Here's what works..." |
| **Story** | Personal narrative | "3 years ago, I was broke. Today, I run a 7-figure business..." |
| **Contrarian** | Against conventional wisdom | "Everyone says X. They're wrong. Here's why..." |
| **How-To** | Practical guide | "How to go from 0 to 10K followers in 90 days (step-by-step)..." |
| **List** | Numbered items | "10 books that changed how I think about money..." |

**Cringe Score:**
Every generated thread gets a "Cringe Score" (0-100). This measures:
- Overused buzzwords ("synergy", "leverage", "game-changer")
- Corporate jargon
- Excessive enthusiasm (too many exclamation points)
- Generic motivational phrases

Lower score = more authentic. Twin aims for < 20.

**Generation Process:**
1. User enters topic and selects hook type
2. Optional: Select a Voice Pack for personalized style
3. Claude generates 5-7 tweets following the structure
4. Cringe score is calculated
5. User can regenerate or save as draft

---

### Thread Remix

**What It Is:**
Take a viral thread that worked for someone else and adapt its winning structure to your topic - in your voice.

**How It Works:**
1. Paste the original viral thread
2. Enter your new topic
3. Optional: Select your Voice Pack
4. Twin analyzes the original thread's:
   - Hook type and style
   - Progression pattern (how ideas flow)
   - Sentence rhythm and length
   - Emotional beats and tension points
   - Call-to-action style
5. Generates a new thread matching that structure for your topic

**Why This Matters:**
Viral threads have proven structures. The hook-to-CTA flow, the pacing, the emotional arc - these patterns work. Remix lets you leverage winning formulas without copying content.

**Output Includes:**
- Analysis of the original thread's structure
- New thread in your voice
- Cringe score
- Key structural elements identified

---

### Content Repurposing

**What It Is:**
Turn one Twitter thread into content for other platforms - automatically adapted for each format.

**Supported Formats:**

| Format | Description | Typical Length |
|--------|-------------|----------------|
| **LinkedIn Post** | Professional tone, paragraph format, engagement hooks | 1,300 characters |
| **Newsletter** | Email-ready with intro, body, CTA sections | 500-800 words |
| **Video Script** | Spoken-word format with timing cues | 2-3 minute read |

**Adaptation Process:**
- Expands short tweets into fuller paragraphs
- Adjusts tone for platform expectations
- Adds appropriate CTAs for each platform
- Maintains core message and insights

---

### Reply Guy

**What It Is:**
AI-powered reply generator to help you engage authentically with other creators' tweets and grow your network through meaningful conversations.

**Reply Tones:**

| Tone | Description | Best For |
|------|-------------|----------|
| **Friendly** | Warm and conversational | General engagement |
| **Witty** | Clever with a touch of humor | Standing out |
| **Professional** | Polished and insightful | B2B networking |
| **Supportive** | Encouraging and empathetic | Building relationships |
| **Curious** | Thoughtful follow-up questions | Starting conversations |

**How It Works:**
1. Paste the tweet you want to reply to
2. Select your desired tone
3. Optional: Apply your Voice Pack
4. Get 3 reply options with varying approaches
5. Copy your favorite and engage!

**Why It Matters:**
Engagement is how you grow on Twitter. Quality replies get noticed by the original poster and their audience. Reply Guy helps you scale authentic engagement without spending hours crafting responses.

---

### AI Coach

**What It Is:**
Your personal AI content strategist. Analyzes your content history and provides actionable feedback to improve performance.

**What It Provides:**

1. **Content Score (0-100)**: Overall assessment of your content quality
2. **Performance Stats**:
   - Total threads created
   - Average engagement per thread
   - Total engagement across all content
3. **Top Strength**: What you're doing well (e.g., "Strong storytelling hooks")
4. **Growth Opportunity**: Where you can improve (e.g., "Add more actionable takeaways")
5. **Personalized Tips**: 3 specific, actionable recommendations

**Tip Categories:**
- **Hooks**: Improving your thread openers
- **Engagement**: Getting more replies and shares
- **Voice**: Strengthening your unique perspective
- **Timing**: When to post for maximum reach

**How It Gets Smarter:**
The more content you create with Twin, the more data the AI Coach has to analyze. Over time, recommendations become increasingly personalized to your specific patterns and audience.

---

### Connect

**What It Is:**
Link your social media accounts to enable direct publishing from Twin.

**Supported Platforms:**

| Platform | Status | Publishing Support |
|----------|--------|-------------------|
| **X (Twitter)** | Ready for integration | Threads, single tweets |
| **LinkedIn** | Ready for integration | Articles, posts |
| **Threads** | Ready for integration | Posts |
| **Bluesky** | Ready for integration | Posts |

**Current Implementation:**
- Username-based connection tracking
- Connection status persistence
- Disconnect/reconnect functionality

**Note on X API Pricing:**
The X (Twitter) API requires a paid subscription for posting:
- Free tier: Very limited (500 posts/month, mostly unusable)
- Basic: $200/month (10K tweets)
- Pro: $5,000/month (serious volume)

Twin is built to integrate when you have API credentials.

---

### Agency Dashboard

**What It Is:**
A complete client management system for agencies and teams managing multiple brands.

**Features:**

1. **Client Roster**
   - Add unlimited clients
   - Track client details (name, email)
   - Active/inactive status

2. **Voice Pack Assignment**
   - Create Voice Packs for each client
   - Assign multiple Voice Packs per client
   - Track assignments across the agency

3. **Overview Stats**
   - Total clients
   - Active clients
   - Total Voice Packs assigned

**Workflow for Agencies:**
1. Onboard new client → Add to Agency Dashboard
2. Gather client's writing samples → Create Voice Pack
3. Assign Voice Pack to client
4. Generate content using client's Voice Pack
5. Schedule and publish across platforms

**Security:**
- Client data is isolated by user account
- Role-based access (future feature)
- Audit logs for accountability (future feature)

---

### Analytics

**What It Is:**
Track the performance of your published content.

**Metrics Tracked:**
- Likes
- Replies
- Retweets/Reposts
- Impressions (when available)

**Views:**
- Per-thread breakdown
- Aggregate totals
- Time-based trends (future feature)

**Current Status:**
Analytics infrastructure is in place. Full tracking will activate when platform integrations (X API, etc.) are connected.

---

### Schedule

**What It Is:**
Plan and schedule your content in advance with a visual calendar view.

**Features:**
- Calendar view of scheduled content
- Drag-and-drop scheduling (future feature)
- Queue management
- Best-time suggestions based on AI Coach analysis

**Thread States:**
- **Draft**: Saved but not scheduled
- **Scheduled**: Set to post at specific time
- **Posted**: Published to platforms

---

## Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│   React 18 + TypeScript + Tailwind CSS + shadcn/ui  │
│            Wouter (routing) + TanStack Query         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Backend                           │
│           Express.js + TypeScript                    │
│              RESTful JSON API                        │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────────┐  ┌──────────┐
    │PostgreSQL│  │ Anthropic    │  │ Platform │
    │ (Drizzle)│  │ Claude API   │  │   APIs   │
    └──────────┘  └──────────────┘  └──────────┘
```

### Frontend Details

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight, ~1.5KB)
- **State Management**: TanStack React Query (server state), React Context (UI state)
- **Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Dark Mode**: Full support with class-based toggling

### Backend Details

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **ORM**: Drizzle ORM with PostgreSQL
- **AI Integration**: Anthropic Claude via Replit AI Integrations
- **Validation**: Zod schemas (shared between frontend and backend)

### AI Integration

Twin uses **Claude claude-sonnet-4-5** for all AI features:
- Thread generation
- Thread remixing
- Content repurposing
- Reply generation
- Coaching tips

The integration uses Replit's AI Integrations for simplified API key management.

---

## Database Schema

### Tables

#### users
```sql
- id: varchar (primary key)
- email: varchar (unique)
- name: varchar
- profileImageUrl: varchar (nullable)
- subscriptionTier: varchar (free/pro/agency)
- brandColors: json (nullable)
- createdAt: timestamp
```

#### voicePacks
```sql
- id: varchar (primary key)
- userId: varchar (foreign key → users)
- name: varchar
- description: text (nullable)
- style: varchar (casual/professional/storytelling/educational/provocative/inspirational)
- writingSamples: text[] (array)
- isActive: boolean
- createdAt: timestamp
```

#### threads
```sql
- id: varchar (primary key)
- userId: varchar (foreign key → users)
- voicePackId: varchar (foreign key → voicePacks, nullable)
- topic: varchar
- hookType: varchar
- content: text[] (array of tweets)
- cringeScore: integer (nullable)
- status: varchar (draft/scheduled/posted)
- scheduledFor: timestamp (nullable)
- postedAt: timestamp (nullable)
- createdAt: timestamp
```

#### analytics
```sql
- id: varchar (primary key)
- threadId: varchar (foreign key → threads)
- likes: integer
- replies: integer
- retweets: integer
- impressions: integer (nullable)
- measuredAt: timestamp
```

#### hooks
```sql
- id: varchar (primary key)
- type: varchar (negative/numbers/story/contrarian/how-to/list)
- template: text
- example: text
- successRate: integer (nullable)
```

#### connectedAccounts
```sql
- id: varchar (primary key)
- userId: varchar (foreign key → users)
- platform: varchar (twitter/linkedin/threads/bluesky)
- platformUsername: varchar (nullable)
- accessToken: text (nullable, encrypted)
- refreshToken: text (nullable, encrypted)
- isConnected: boolean
- connectedAt: timestamp (nullable)
```

#### agencyClients
```sql
- id: varchar (primary key)
- userId: varchar (foreign key → users)
- clientName: varchar
- clientEmail: varchar (nullable)
- isActive: boolean
- createdAt: timestamp
```

#### clientVoicePacks
```sql
- id: varchar (primary key)
- clientId: varchar (foreign key → agencyClients)
- voicePackId: varchar (foreign key → voicePacks)
- assignedAt: timestamp
```

---

## API Reference

### Voice Packs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/voice-packs` | List all voice packs |
| POST | `/api/voice-packs` | Create voice pack |
| DELETE | `/api/voice-packs/:id` | Delete voice pack |

### Threads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/threads` | List all threads |
| POST | `/api/threads` | Create/save thread |
| PATCH | `/api/threads/:id` | Update thread |
| DELETE | `/api/threads/:id` | Delete thread |
| POST | `/api/threads/generate` | AI generate thread |
| POST | `/api/threads/remix` | Remix viral thread |
| POST | `/api/threads/repurpose` | Repurpose to other formats |

### Reply Guy

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reply/generate` | Generate reply options |

### AI Coach

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coaching/tips` | Get coaching analysis |

### Connected Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/connected-accounts` | List connected accounts |
| POST | `/api/connected-accounts/connect` | Connect platform |
| POST | `/api/connected-accounts/disconnect` | Disconnect platform |

### Agency

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agency/clients` | List all clients |
| POST | `/api/agency/clients` | Add new client |
| PATCH | `/api/agency/clients/:id` | Update client |
| DELETE | `/api/agency/clients/:id` | Remove client |
| GET | `/api/agency/clients/:id/voice-packs` | List client's voice packs |
| POST | `/api/agency/clients/:id/voice-packs` | Assign voice pack |
| DELETE | `/api/agency/clients/:clientId/voice-packs/:packId` | Unassign voice pack |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics data |

### Hooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hooks` | List hook templates |

---

## Future Roadmap

### Phase 1: Core Enhancements (Near-term)

#### Images Feature
- AI-generated images for threads
- Custom graphics with brand colors
- Image templates for different content types
- Integration with image generation APIs (DALL-E, Midjourney API)

#### Advanced Scheduling
- Optimal posting time recommendations
- Queue system with auto-spacing
- Timezone support
- Bulk scheduling

#### Enhanced Analytics
- Engagement trends over time
- Best performing hook types
- Audience growth tracking
- Content performance heatmaps

### Phase 2: Platform Integrations (Medium-term)

#### Full X (Twitter) Integration
- Direct posting from Twin
- Engagement metrics sync
- Follower analytics
- Mention monitoring

#### LinkedIn Integration
- Cross-post threads as articles
- Professional network engagement
- Company page support

#### Threads & Bluesky
- Native posting support
- Platform-specific formatting
- Cross-platform analytics

### Phase 3: Advanced AI Features (Medium-term)

#### Voice Pack V2
- Automatic voice analysis from Twitter history
- Voice similarity scoring
- Style transfer between voices
- Multi-language support

#### AI Coach V2
- Real-time writing suggestions
- A/B test predictions
- Competitor analysis
- Trend detection and topic suggestions

#### Thread Templates
- Pre-built viral structures
- Industry-specific templates
- Seasonal/event templates
- Custom template creation

### Phase 4: Team & Agency Features (Long-term)

#### Team Collaboration
- Multi-user workspaces
- Role-based permissions (admin, editor, viewer)
- Approval workflows
- Content calendars shared across team

#### White-Label Solution
- Custom branding for agencies
- Client-facing dashboards
- Branded reports
- Custom domains

#### Client Portal
- Self-service content approval
- Brand guidelines enforcement
- Feedback and revision system
- Usage analytics for clients

### Phase 5: Enterprise Features (Long-term)

#### Advanced Security
- SSO/SAML integration
- Audit logs
- Data retention policies
- GDPR compliance tools

#### API Access
- Public API for integrations
- Webhook support
- Zapier/Make integration
- Custom workflows

#### AI Training
- Custom model fine-tuning per client
- Proprietary data training
- Industry-specific models
- Compliance-aware content generation

### Potential Integrations

| Integration | Purpose |
|-------------|---------|
| Notion | Import content ideas |
| Airtable | Content calendar sync |
| Slack | Notifications & approvals |
| Buffer/Hootsuite | Extended scheduling |
| Canva | Visual content creation |
| Grammarly | Writing enhancement |
| SEMrush | SEO optimization |
| Stripe | Subscription billing |

---

## Getting Started

### For Creators

1. **Create Your First Voice Pack**
   - Go to Voice Packs page
   - Click "Create Voice Pack"
   - Add a name and select your style
   - Paste 3-5 of your best writing samples
   - Save

2. **Generate Your First Thread**
   - Go to Compose page
   - Enter your topic
   - Select a hook type
   - Choose your Voice Pack
   - Click Generate

3. **Refine and Save**
   - Review the generated content
   - Check the cringe score
   - Regenerate if needed
   - Save as draft or schedule

### For Agencies

1. **Set Up Your Agency**
   - Go to Agency Dashboard
   - Add your first client

2. **Create Client Voice Packs**
   - Go to Voice Packs
   - Create a Voice Pack with client's samples
   - Return to Agency Dashboard
   - Assign the Voice Pack to the client

3. **Generate Client Content**
   - Go to Compose
   - Select the client's Voice Pack
   - Generate content in their voice

---

## Support

For questions, issues, or feature requests, please contact the Twin team.

---

*Twin - Clone Your Voice. Scale Your Content. Grow Your Audience.*
