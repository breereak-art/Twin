import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for Replit Auth
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  subscriptionTier: text("subscription_tier").default("free"),
  brandColors: jsonb("brand_colors").$type<string[]>(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Voice Packs - personalized writing style profiles
export const voicePacks = pgTable("voice_packs", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  style: text("style").default("personal"), // personal, professional, casual
  basePrompt: text("base_prompt"),
  writingSamples: jsonb("writing_samples").$type<string[]>(),
  isDefault: boolean("is_default").default(false),
});

export const insertVoicePackSchema = createInsertSchema(voicePacks).omit({ id: true });
export type InsertVoicePack = z.infer<typeof insertVoicePackSchema>;
export type VoicePack = typeof voicePacks.$inferSelect;

// Threads - generated Twitter threads
export const threads = pgTable("threads", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  voicePackId: varchar("voice_pack_id", { length: 255 }).references(() => voicePacks.id),
  topic: text("topic").notNull(),
  hookType: text("hook_type"), // negative, numbers, story, contrarian, list
  status: text("status").default("draft"), // draft, scheduled, posted
  content: jsonb("content").$type<string[]>(), // array of tweets
  cringeScore: integer("cringe_score"),
  scheduledFor: timestamp("scheduled_for"),
  postedAt: timestamp("posted_at"),
});

export const insertThreadSchema = createInsertSchema(threads).omit({ id: true });
export type InsertThread = z.infer<typeof insertThreadSchema>;
export type Thread = typeof threads.$inferSelect;

// Analytics - thread performance data
export const analytics = pgTable("analytics", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id", { length: 255 }).notNull().references(() => threads.id),
  impressions: integer("impressions").default(0),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  retweets: integer("retweets").default(0),
  profileClicks: integer("profile_clicks").default(0),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Hooks - viral hook templates
export const hooks = pgTable("hooks", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // negative, numbers, story, contrarian, list
  templateText: text("template_text").notNull(),
  isPremium: boolean("is_premium").default(false),
});

export const insertHookSchema = createInsertSchema(hooks).omit({ id: true });
export type InsertHook = z.infer<typeof insertHookSchema>;
export type Hook = typeof hooks.$inferSelect;

// Sessions table for auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});
