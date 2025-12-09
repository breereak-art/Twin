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

// Connected accounts - social platform connections
export const connectedAccounts = pgTable("connected_accounts", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  platform: text("platform").notNull(), // twitter, linkedin, threads, bluesky
  platformUsername: text("platform_username"),
  isConnected: boolean("is_connected").default(false),
  connectedAt: timestamp("connected_at"),
});

export const insertConnectedAccountSchema = createInsertSchema(connectedAccounts).omit({ id: true });
export type InsertConnectedAccount = z.infer<typeof insertConnectedAccountSchema>;
export type ConnectedAccount = typeof connectedAccounts.$inferSelect;

// Agency clients - for managing multiple client voice profiles
export const agencyClients = pgTable("agency_clients", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientLogo: text("client_logo"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgencyClientSchema = createInsertSchema(agencyClients).omit({ id: true, createdAt: true });
export type InsertAgencyClient = z.infer<typeof insertAgencyClientSchema>;
export type AgencyClient = typeof agencyClients.$inferSelect;

// Client voice pack assignments
export const clientVoicePacks = pgTable("client_voice_packs", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id", { length: 255 }).notNull().references(() => agencyClients.id),
  voicePackId: varchar("voice_pack_id", { length: 255 }).notNull().references(() => voicePacks.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const insertClientVoicePackSchema = createInsertSchema(clientVoicePacks).omit({ id: true, assignedAt: true });
export type InsertClientVoicePack = z.infer<typeof insertClientVoicePackSchema>;
export type ClientVoicePack = typeof clientVoicePacks.$inferSelect;
