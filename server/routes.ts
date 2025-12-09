import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoicePackSchema, insertThreadSchema } from "@shared/schema";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client using Replit AI Integrations
const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
});

// Demo user ID for development (before auth is fully implemented)
const DEMO_USER_ID = "demo-user";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Generate a Twitter thread about: ${topic}`,
          },
        ],
        system: systemPrompt,
      });

      // Parse the response
      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      let tweets: string[];
      try {
        tweets = JSON.parse(content.text);
      } catch {
        // If parsing fails, try to extract from text
        const match = content.text.match(/\[[\s\S]*\]/);
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

  return httpServer;
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
