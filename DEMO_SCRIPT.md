# Twin Demo Script

## Video Demo Script for Hackathon Submission

**Duration:** ~5 minutes

---

## INTRO (30 seconds)

**Say:**
> "Hi! I'm presenting Twin - a Content Operating System for creators. Twin helps you clone your writing voice and generate viral Twitter threads that actually sound like you. What makes this project special is that all AI features are powered by ADK-TS, the Agent Development Kit for TypeScript."

---

## PART 1: Voice Packs (1 minute)

### Navigate to Voice Packs page

**Say:**
> "First, let me show you Voice Packs. This is where creators define their unique writing style."

### Click "Create Voice Pack"

**Say:**
> "I'll create a new voice pack. You give it a name, describe your writing style, and optionally add sample tweets so the AI can learn how you write."

### Fill in the form:
- **Name:** "Tech Thought Leader"
- **Style:** "Punchy, data-driven, uses contrarian takes"
- **Description:** "I write about startups, AI, and productivity. I prefer short sentences and bold claims backed by evidence."

**Say:**
> "Now when I generate content, Twin will match this exact voice. No more generic AI content."

---

## PART 2: Thread Generation with ADK-TS (1.5 minutes)

### Navigate to Compose page

**Say:**
> "Now let's generate a Twitter thread. This is where ADK-TS shines."

### Enter topic: "Why most startups fail in their first year"

### Select hook type: "Contrarian"

### Select your voice pack

**Say:**
> "I'll use a contrarian hook - these tend to go viral because they challenge common beliefs. And I'm using my voice pack so it sounds like me."

### Click Generate

**Say:**
> "Behind the scenes, we're using ADK-TS with the AgentBuilder pattern. Here's what the code looks like:"

**Show code snippet (optional):**
```typescript
const { runner } = await AgentBuilder
  .create("twin-ai")
  .withModel("claude-sonnet-4-5")
  .withInstruction(systemPrompt)
  .build();
```

**Wait for generation, then say:**
> "Look at that - a complete thread with a strong hook, valuable insights, and a call-to-action. Each tweet is under 280 characters. No hashtags, no emojis - just authentic content."

---

## PART 3: Thread Remix (1 minute)

### Navigate to Remix section (if separate) or use Compose

**Say:**
> "One of my favorite features is Thread Remix. You can take any viral thread and remix it into your own topic while keeping the winning structure."

### Paste a sample thread or use a saved one

### Enter new topic: "Why remote work is here to stay"

### Click Remix

**Say:**
> "Twin analyzes the original thread - identifying the hook type, flow pattern, and emotional beats. Then it creates a new thread on my topic using the same structure. Same viral potential, completely new content."

---

## PART 4: Reply Guy (45 seconds)

### Navigate to Reply Guy page

**Say:**
> "Reply Guy helps you engage with other creators. Paste any tweet, choose a tone, and get three reply options."

### Paste a sample tweet: "Just shipped our biggest feature yet after 6 months of work"

### Select tone: "Witty"

### Click Generate

**Say:**
> "Perfect for building relationships and growing your audience. All replies are authentic - no generic 'Great post!' responses."

---

## PART 5: AI Coach (45 seconds)

### Navigate to AI Coach page

**Say:**
> "Finally, AI Coach analyzes your content history and gives personalized tips to improve."

### Show the coaching tips

**Say:**
> "It tracks your content score, identifies your strengths, and tells you exactly what to work on. It's like having a content strategist in your pocket."

---

## CLOSING (30 seconds)

**Say:**
> "To recap - Twin uses ADK-TS to power five AI features: Thread Generation, Thread Remix, Content Repurposing, Reply Guy, and AI Coach. The AgentBuilder pattern makes it incredibly clean to create AI agents with specific instructions and models."

> "Twin helps creators maintain their authentic voice while scaling content production. Thanks for watching!"

---

## TECHNICAL NOTES FOR DEMO

### If something fails:
- The AI needs a moment to generate - just wait and keep talking
- If an error occurs, refresh the page and try again
- Keep the conversation going: "Sometimes AI needs a moment to think..."

### Key talking points to remember:
1. **ADK-TS** - Agent Development Kit for TypeScript
2. **AgentBuilder pattern** - Clean, declarative way to create AI agents
3. **Voice Packs** - Personalized writing style profiles
4. **5 AI features** - All powered by the same ADK-TS helper function

### Environment check before demo:
- Make sure app is running on port 5000
- Test one generation to ensure API is working
- Have a voice pack already created as backup
- Keep browser console open to catch any errors

---

## SAMPLE DATA TO USE

### Voice Pack Example:
- Name: "Startup Founder Voice"
- Style: "Direct, optimistic, data-driven with founder insights"
- Description: "Writes about building products, fundraising, and team culture"

### Thread Topics:
- "Why most startups fail in their first year"
- "The hidden cost of technical debt"
- "What I learned from my first 100 customers"

### Sample Tweet for Reply Guy:
- "Just crossed 10k followers! Grateful for this community"
- "Unpopular opinion: meetings are actually productive if done right"

### Hook Types to Demo:
- **Contrarian** - Goes against common belief
- **Numbers** - Uses specific data
- **Story** - Narrative hook
