import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoicePackSchema, insertThreadSchema, insertConnectedAccountSchema, insertAgencyClientSchema, insertClientVoicePackSchema } from "@shared/schema";
import { AgentBuilder } from "@iqai/adk";

// Configure ADK to use Replit AI Integrations
if (process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  process.env.ANTHROPIC_API_KEY = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
}
if (process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL && !process.env.ANTHROPIC_BASE_URL) {
  process.env.ANTHROPIC_BASE_URL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
}

// Helper function to call AI using ADK AgentBuilder
async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  const { runner } = await AgentBuilder
    .create("twin-ai")
    .withModel("claude-sonnet-4-5")
    .withInstruction(systemPrompt)
    .build();
  
  const result = await runner.runAsync({ userId: "system", message: userMessage });
  return result || "";
}

// Demo user ID for development (before auth is fully implemented)
const DEMO_USER_ID = "demo-user";

// Ensure demo user exists on startup
async function ensureDemoUser() {
  const existingUser = await storage.getUser(DEMO_USER_ID);
  if (!existingUser) {
    await storage.upsertUser({
      id: DEMO_USER_ID,
      email: "demo@twin.app",
      firstName: "Demo",
      lastName: "User",
    });
    console.log("Created demo user for development");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Ensure demo user exists for development
  await ensureDemoUser();

  // Voice Packs API
  app.get("/api/voice-packs", async (req, res) => {
    try {
      const packs = await storage.getVoicePacks(DEMO_USER_ID);
      res.json(packs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice packs" });
    }
  });

  app.post("/api/voice-packs", async (req, res) => {
    try {
      const validated = insertVoicePackSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const pack = await storage.createVoicePack(validated);
      res.json(pack);
    } catch (error) {
      res.status(400).json({ error: "Invalid voice pack data" });
    }
  });

  app.delete("/api/voice-packs/:id", async (req, res) => {
    try {
      await storage.deleteVoicePack(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete voice pack" });
    }
  });

  // Threads API
  app.get("/api/threads", async (req, res) => {
    try {
      const threads = await storage.getThreads(DEMO_USER_ID);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  app.post("/api/threads", async (req, res) => {
    try {
      const validated = insertThreadSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const thread = await storage.createThread(validated);
      res.json(thread);
    } catch (error) {
      res.status(400).json({ error: "Invalid thread data" });
    }
  });

  app.patch("/api/threads/:id", async (req, res) => {
    try {
      const thread = await storage.updateThread(req.params.id, req.body);
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: "Failed to update thread" });
    }
  });

  app.delete("/api/threads/:id", async (req, res) => {
    try {
      await storage.deleteThread(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete thread" });
    }
  });

  // Thread Generation API
  app.post("/api/threads/generate", async (req, res) => {
    try {
      const { topic, hookType, voicePackId } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      // Get voice pack if specified
      let voiceContext = "";
      if (voicePackId) {
        const voicePack = await storage.getVoicePack(voicePackId);
        if (voicePack) {
          voiceContext = `
Writing Style: ${voicePack.style}
Voice Description: ${voicePack.description || "No description"}
${voicePack.writingSamples && voicePack.writingSamples.length > 0 
  ? `Sample Writings:\n${voicePack.writingSamples.join("\n---\n")}` 
  : ""}
          `.trim();
        }
      }

      const hookInstructions = getHookInstructions(hookType);

      const systemPrompt = `You are Twin, an AI that generates viral Twitter threads. Your job is to create engaging, authentic content that sounds human and avoids corporate jargon.

${voiceContext ? `USER'S VOICE PROFILE:\n${voiceContext}\n\n` : ""}
RULES:
1. Write 5-7 tweets per thread
2. Each tweet must be under 280 characters
3. Use the specified hook type for the first tweet
4. Make content punchy, valuable, and shareable
5. NO hashtags, NO emojis
6. Sound like a real person, not a marketer
7. Include actionable insights or surprising facts
8. End with a strong call-to-action or thought-provoking question

HOOK TYPE: ${hookType}
${hookInstructions}

Respond with ONLY a JSON array of strings, each string being one tweet in the thread.`;

      const responseText = await callAI(systemPrompt, `Generate a Twitter thread about: ${topic}`);

      // Parse the response
      let tweets: string[];
      try {
        tweets = JSON.parse(responseText);
      } catch {
        // If parsing fails, try to extract from text
        const match = responseText.match(/\[[\s\S]*\]/);
        if (match) {
          tweets = JSON.parse(match[0]);
        } else {
          throw new Error("Failed to parse thread content");
        }
      }

      // Calculate cringe score (simple heuristic)
      const cringeScore = calculateCringeScore(tweets);

      res.json({ content: tweets, cringeScore });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: "Failed to generate thread" });
    }
  });

  // Thread Remix API - Analyze and remix viral threads
  app.post("/api/threads/remix", async (req, res) => {
    try {
      const { originalThread, newTopic, voicePackId } = req.body;

      if (!originalThread || !newTopic) {
        return res.status(400).json({ error: "Original thread and new topic are required" });
      }

      // Get voice pack if specified
      let voiceContext = "";
      if (voicePackId) {
        const voicePack = await storage.getVoicePack(voicePackId);
        if (voicePack) {
          voiceContext = `
Writing Style: ${voicePack.style}
Voice Description: ${voicePack.description || "No description"}
${voicePack.writingSamples && voicePack.writingSamples.length > 0 
  ? `Sample Writings:\n${voicePack.writingSamples.join("\n---\n")}` 
  : ""}
          `.trim();
        }
      }

      const systemPrompt = `You are Twin, an AI that analyzes viral Twitter threads and remixes them into new topics while preserving the winning structure.

${voiceContext ? `USER'S VOICE PROFILE:\n${voiceContext}\n\n` : ""}

Your task:
1. Analyze the ORIGINAL THREAD to identify:
   - Hook type (negative, numbers, story, contrarian, list)
   - Flow pattern (how ideas progress)
   - Sentence structures and rhythm
   - Emotional hooks and tension points
   - Call-to-action style

2. Create a NEW THREAD about the given topic that:
   - Uses the EXACT same structural pattern
   - Matches the tweet count of the original
   - Mirrors the hook style and progression
   - Adapts emotional beats to the new topic
   - Sounds authentic and human

RULES:
- Each tweet must be under 280 characters
- NO hashtags, NO emojis
- Preserve the original's pacing and momentum
- Make it feel like the same author wrote both threads

Respond with a JSON object containing:
{
  "analysis": {
    "hookType": "string",
    "tweetCount": number,
    "pattern": "brief description of the structural pattern",
    "keyElements": ["list of key structural elements identified"]
  },
  "remixedThread": ["array of tweets"]
}`;

      const responseText = await callAI(systemPrompt, `ORIGINAL THREAD:\n${originalThread}\n\nNEW TOPIC: ${newTopic}`);

      // Parse the response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // Try to extract JSON from text with multiple patterns
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch {
            throw new Error("Failed to parse extracted JSON");
          }
        } else {
          throw new Error("No valid JSON found in response");
        }
      }

      // Validate required fields
      if (!result.analysis || !result.remixedThread) {
        throw new Error("Response missing required fields (analysis or remixedThread)");
      }

      if (!Array.isArray(result.remixedThread) || result.remixedThread.length === 0) {
        throw new Error("remixedThread must be a non-empty array");
      }

      // Ensure analysis has required fields with defaults
      const analysis = {
        hookType: result.analysis.hookType || "unknown",
        tweetCount: result.remixedThread.length,
        pattern: result.analysis.pattern || "Pattern analysis not available",
        keyElements: Array.isArray(result.analysis.keyElements) ? result.analysis.keyElements : [],
      };

      // Validate and truncate tweets if needed
      const tweets = result.remixedThread.map((tweet: unknown, index: number) => {
        if (typeof tweet !== "string") {
          return `Tweet ${index + 1}: Content unavailable`;
        }
        return tweet;
      });

      // Calculate cringe score
      const cringeScore = calculateCringeScore(tweets);

      res.json({
        analysis,
        content: tweets,
        cringeScore,
      });
    } catch (error) {
      console.error("Remix error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: `Failed to remix thread: ${errorMessage}` });
    }
  });

  // Thread Repurpose API - Convert threads to other formats
  app.post("/api/threads/repurpose", async (req, res) => {
    try {
      const { content, targetFormat, voicePackId } = req.body;

      if (!content || !Array.isArray(content) || content.length === 0) {
        return res.status(400).json({ error: "Thread content is required (array of tweets)" });
      }

      const validFormats = ["linkedin", "newsletter", "script"];
      if (!targetFormat || !validFormats.includes(targetFormat)) {
        return res.status(400).json({ error: `Target format must be one of: ${validFormats.join(", ")}` });
      }

      // Get voice pack if specified
      let voiceContext = "";
      if (voicePackId) {
        const voicePack = await storage.getVoicePack(voicePackId);
        if (voicePack) {
          voiceContext = `
Writing Style: ${voicePack.style}
Voice Description: ${voicePack.description || "No description"}
${voicePack.writingSamples && voicePack.writingSamples.length > 0 
  ? `Sample Writings:\n${voicePack.writingSamples.join("\n---\n")}` 
  : ""}
          `.trim();
        }
      }

      const formatInstructions = getFormatInstructions(targetFormat);
      const threadText = content.join("\n\n");

      const systemPrompt = `You are Twin, an AI that repurposes Twitter threads into other content formats while maintaining the original voice and message.

${voiceContext ? `USER'S VOICE PROFILE:\n${voiceContext}\n\n` : ""}

Your task is to convert the following Twitter thread into a ${targetFormat} format.

${formatInstructions}

RULES:
1. Preserve the core message and insights from the original thread
2. Adapt the structure and tone for the target platform
3. Expand on ideas where appropriate for the new format
4. Keep the authentic voice - no corporate jargon
5. Make it engaging and valuable for the target audience

Respond with a JSON object containing:
{
  "title": "A compelling title for the content",
  "content": "The full repurposed content as a single string",
  "summary": "A 1-2 sentence summary of the content"
}`;

      const responseText = await callAI(systemPrompt, `ORIGINAL TWITTER THREAD:\n${threadText}`);

      // Parse the response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // Try to extract JSON from text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch {
            throw new Error("Failed to parse extracted JSON");
          }
        } else {
          throw new Error("No valid JSON found in response");
        }
      }

      // Validate required fields
      if (!result.content) {
        throw new Error("Response missing content field");
      }

      const wordCount = result.content.split(/\s+/).filter((w: string) => w.length > 0).length;

      res.json({
        format: targetFormat,
        title: result.title || "Untitled",
        content: result.content,
        summary: result.summary || "",
        wordCount,
      });
    } catch (error) {
      console.error("Repurpose error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: `Failed to repurpose thread: ${errorMessage}` });
    }
  });

  // Analytics API
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(DEMO_USER_ID);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Hooks API
  app.get("/api/hooks", async (req, res) => {
    try {
      const hooks = await storage.getHooks();
      res.json(hooks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hooks" });
    }
  });

  // Reply Guy API - Generate contextual replies
  app.post("/api/reply/generate", async (req, res) => {
    try {
      const { tweetContent, replyTone, voicePackId } = req.body;

      if (!tweetContent) {
        return res.status(400).json({ error: "Tweet content is required" });
      }

      let voiceContext = "";
      if (voicePackId) {
        const voicePack = await storage.getVoicePack(voicePackId);
        if (voicePack) {
          voiceContext = `
Writing Style: ${voicePack.style}
Voice Description: ${voicePack.description || "No description"}
${voicePack.writingSamples && voicePack.writingSamples.length > 0 
  ? `Sample Writings:\n${voicePack.writingSamples.join("\n---\n")}` 
  : ""}
          `.trim();
        }
      }

      const toneInstructions = getReplyToneInstructions(replyTone || "friendly");

      const systemPrompt = `You are Twin's Reply Guy, an AI that generates authentic, engaging Twitter replies. Your job is to craft replies that feel human and drive meaningful conversations.

${voiceContext ? `USER'S VOICE PROFILE:\n${voiceContext}\n\n` : ""}

REPLY TONE: ${replyTone || "friendly"}
${toneInstructions}

RULES:
1. Keep replies under 280 characters
2. Be authentic - no corporate speak
3. Add value to the conversation
4. NO hashtags, NO emojis
5. Sound like a real person, not a bot
6. Be respectful and constructive
7. Match the energy of the original tweet

Generate 3 different reply options with varying approaches.

Respond with a JSON array of 3 reply strings.`;

      const responseText = await callAI(systemPrompt, `Generate replies to this tweet:\n\n"${tweetContent}"`);

      let replies: string[];
      try {
        replies = JSON.parse(responseText);
      } catch {
        const match = responseText.match(/\[[\s\S]*\]/);
        if (match) {
          replies = JSON.parse(match[0]);
        } else {
          throw new Error("Failed to parse replies");
        }
      }

      res.json({ replies });
    } catch (error) {
      console.error("Reply generation error:", error);
      res.status(500).json({ error: "Failed to generate replies" });
    }
  });

  // AI Coach API - Get coaching tips based on threads
  app.get("/api/coaching/tips", async (req, res) => {
    try {
      const threads = await storage.getThreads(DEMO_USER_ID);
      const analyticsData = await storage.getAnalytics(DEMO_USER_ID);

      // Calculate summary stats
      const totalThreads = threads.length;
      const totalEngagement = analyticsData.reduce((sum, a) => 
        sum + (a.likes || 0) + (a.replies || 0) + (a.retweets || 0), 0);
      const avgEngagement = totalThreads > 0 ? Math.round(totalEngagement / totalThreads) : 0;

      // Generate AI coaching tips
      const systemPrompt = `You are Twin's AI Coach, providing personalized content advice to help creators improve their Twitter threads and grow their audience.

Based on the user's content history, provide 3 specific, actionable coaching tips.

RULES:
1. Be specific and actionable - not generic advice
2. Focus on what they can improve immediately
3. Reference patterns from successful threads
4. Keep each tip concise (1-2 sentences)
5. Be encouraging but honest

Respond with a JSON object:
{
  "tips": [
    {"title": "short title", "tip": "the actionable advice", "category": "hooks|engagement|voice|timing"}
  ],
  "contentScore": number between 1-100,
  "topStrength": "what they're doing well",
  "topOpportunity": "biggest area for improvement"
}`;

      const responseText = await callAI(systemPrompt, `User has ${totalThreads} threads with average engagement of ${avgEngagement}. Recent thread topics: ${threads.slice(0, 5).map(t => t.topic).join(", ") || "No threads yet"}`);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) {
          result = JSON.parse(match[0]);
        } else {
          throw new Error("Failed to parse coaching tips");
        }
      }

      res.json({
        tips: result.tips || [],
        contentScore: result.contentScore || 50,
        topStrength: result.topStrength || "Getting started",
        topOpportunity: result.topOpportunity || "Create more content",
        stats: {
          totalThreads,
          avgEngagement,
          totalEngagement,
        },
      });
    } catch (error) {
      console.error("Coaching error:", error);
      res.status(500).json({ error: "Failed to get coaching tips" });
    }
  });

  // Connected Accounts API
  app.get("/api/connected-accounts", async (req, res) => {
    try {
      const accounts = await storage.getConnectedAccounts(DEMO_USER_ID);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connected accounts" });
    }
  });

  app.post("/api/connected-accounts/connect", async (req, res) => {
    try {
      const { platform, platformUsername } = req.body;
      
      if (!platform) {
        return res.status(400).json({ error: "Platform is required" });
      }

      const account = await storage.upsertConnectedAccount({
        userId: DEMO_USER_ID,
        platform,
        platformUsername: platformUsername || null,
        isConnected: true,
        connectedAt: new Date(),
      });

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect account" });
    }
  });

  app.post("/api/connected-accounts/disconnect", async (req, res) => {
    try {
      const { platform } = req.body;
      
      if (!platform) {
        return res.status(400).json({ error: "Platform is required" });
      }

      await storage.disconnectAccount(DEMO_USER_ID, platform);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect account" });
    }
  });

  // Agency Clients API
  app.get("/api/agency/clients", async (req, res) => {
    try {
      const clients = await storage.getAgencyClients(DEMO_USER_ID);
      
      // Get voice pack counts for each client
      const clientsWithPacks = await Promise.all(
        clients.map(async (client) => {
          const packs = await storage.getClientVoicePacks(client.id);
          return { ...client, voicePackCount: packs.length };
        })
      );
      
      res.json(clientsWithPacks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agency clients" });
    }
  });

  app.post("/api/agency/clients", async (req, res) => {
    try {
      const validated = insertAgencyClientSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const client = await storage.createAgencyClient(validated);
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  app.patch("/api/agency/clients/:id", async (req, res) => {
    try {
      const client = await storage.updateAgencyClient(req.params.id, req.body);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/agency/clients/:id", async (req, res) => {
    try {
      await storage.deleteAgencyClient(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Client Voice Pack Assignments
  app.get("/api/agency/clients/:clientId/voice-packs", async (req, res) => {
    try {
      const assignments = await storage.getClientVoicePacks(req.params.clientId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client voice packs" });
    }
  });

  app.post("/api/agency/clients/:clientId/voice-packs", async (req, res) => {
    try {
      const { voicePackId } = req.body;
      if (!voicePackId) {
        return res.status(400).json({ error: "Voice pack ID is required" });
      }

      const assignment = await storage.assignVoicePackToClient({
        clientId: req.params.clientId,
        voicePackId,
      });
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to assign voice pack" });
    }
  });

  app.delete("/api/agency/clients/:clientId/voice-packs/:voicePackId", async (req, res) => {
    try {
      await storage.unassignVoicePackFromClient(req.params.clientId, req.params.voicePackId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unassign voice pack" });
    }
  });

  return httpServer;
}

function getReplyToneInstructions(tone: string): string {
  const instructions: Record<string, string> = {
    friendly: "Be warm, approachable, and conversational. Use casual language.",
    witty: "Be clever and playful. Add a touch of humor without being mean.",
    professional: "Be polished and insightful. Focus on adding value and expertise.",
    supportive: "Be encouraging and empathetic. Validate their point and add positivity.",
    curious: "Ask thoughtful follow-up questions. Show genuine interest in their perspective.",
  };
  return instructions[tone] || instructions.friendly;
}

function getFormatInstructions(format: string): string {
  const instructions: Record<string, string> = {
    linkedin: `FORMAT: LinkedIn Post
- Professional but personable tone
- Start with a hook that grabs attention
- Use line breaks for readability (one idea per paragraph)
- Include a call-to-action at the end
- Aim for 150-300 words
- Can include bullet points for lists
- End with a question or invitation to engage`,
    newsletter: `FORMAT: Email Newsletter
- Friendly, conversational tone like writing to a friend
- Include a compelling subject line suggestion at the top
- Structure with clear sections: intro, main content, takeaways
- Expand on ideas with examples and context
- Aim for 500-800 words
- Include a personal sign-off
- Add P.S. with a key takeaway or call-to-action`,
    script: `FORMAT: Video/Podcast Script
- Conversational, spoken-word style
- Start with a hook that captures attention in first 10 seconds
- Include [PAUSE] markers for dramatic effect
- Structure: Hook → Problem → Insights → Takeaways → CTA
- Use short sentences for clarity when spoken
- Aim for 400-600 words (about 3-4 minutes spoken)
- End with a strong call-to-action`,
  };
  return instructions[format] || instructions.linkedin;
}

function getHookInstructions(hookType: string): string {
  const instructions: Record<string, string> = {
    negative: "Start with what NOT to do or a common mistake. Example: 'Stop doing X if you want Y'",
    numbers: "Lead with a specific number. Example: '7 ways to 10x your Z' or 'I spent 3 years learning this'",
    story: "Open with a personal story or experience. Example: 'In 2019, I was broke. Here's what changed.'",
    contrarian: "Challenge a common belief. Example: 'Unpopular opinion: X is dead' or 'Everyone says X. They're wrong.'",
    list: "Promise a comprehensive list. Example: 'Everything I learned about X in one thread' or 'A complete guide to Y'",
  };
  return instructions[hookType] || instructions.negative;
}

function calculateCringeScore(tweets: string[]): number {
  const cringeWords = [
    "synergy", "leverage", "paradigm", "holistic", "disrupt",
    "thought leader", "game-changer", "crushing it", "hustle",
    "grind", "boss babe", "entrepreneur journey", "10x",
    "unlock", "monetize", "scale", "pivot", "growth hack",
    "influencer", "personal brand", "value bomb", "epic"
  ];

  const text = tweets.join(" ").toLowerCase();
  let score = 0;

  for (const word of cringeWords) {
    const regex = new RegExp(word, "gi");
    const matches = text.match(regex);
    if (matches) {
      score += matches.length * 10;
    }
  }

  // Check for excessive exclamation marks
  const exclamations = (text.match(/!/g) || []).length;
  score += Math.max(0, exclamations - 2) * 5;

  // Check for all caps words
  const allCaps = tweets.join(" ").match(/\b[A-Z]{3,}\b/g) || [];
  score += allCaps.length * 3;

  return Math.min(100, score);
}
