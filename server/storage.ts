import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, voicePacks, threads, analytics, hooks,
  type User, type InsertUser,
  type VoicePack, type InsertVoicePack,
  type Thread, type InsertThread,
  type Analytics, type InsertAnalytics,
  type Hook, type InsertHook,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: InsertUser & { id: string }): Promise<User>;

  // Voice Packs
  getVoicePacks(userId: string): Promise<VoicePack[]>;
  getVoicePack(id: string): Promise<VoicePack | undefined>;
  createVoicePack(pack: InsertVoicePack): Promise<VoicePack>;
  updateVoicePack(id: string, pack: Partial<InsertVoicePack>): Promise<VoicePack | undefined>;
  deleteVoicePack(id: string): Promise<void>;

  // Threads
  getThreads(userId: string): Promise<Thread[]>;
  getThread(id: string): Promise<Thread | undefined>;
  createThread(thread: InsertThread): Promise<Thread>;
  updateThread(id: string, thread: Partial<InsertThread>): Promise<Thread | undefined>;
  deleteThread(id: string): Promise<void>;

  // Analytics
  getAnalytics(userId: string): Promise<Analytics[]>;
  getThreadAnalytics(threadId: string): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: string, data: Partial<InsertAnalytics>): Promise<Analytics | undefined>;

  // Hooks
  getHooks(): Promise<Hook[]>;
  getHooksByCategory(category: string): Promise<Hook[]>;
  createHook(hook: InsertHook): Promise<Hook>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertUser(userData: InsertUser & { id: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
        },
      })
      .returning();
    return user;
  }

  // Voice Packs
  async getVoicePacks(userId: string): Promise<VoicePack[]> {
    return db.select().from(voicePacks).where(eq(voicePacks.userId, userId));
  }

  async getVoicePack(id: string): Promise<VoicePack | undefined> {
    const [pack] = await db.select().from(voicePacks).where(eq(voicePacks.id, id));
    return pack;
  }

  async createVoicePack(pack: InsertVoicePack): Promise<VoicePack> {
    const [created] = await db.insert(voicePacks).values(pack).returning();
    return created;
  }

  async updateVoicePack(id: string, pack: Partial<InsertVoicePack>): Promise<VoicePack | undefined> {
    const [updated] = await db.update(voicePacks).set(pack).where(eq(voicePacks.id, id)).returning();
    return updated;
  }

  async deleteVoicePack(id: string): Promise<void> {
    await db.delete(voicePacks).where(eq(voicePacks.id, id));
  }

  // Threads
  async getThreads(userId: string): Promise<Thread[]> {
    return db.select().from(threads).where(eq(threads.userId, userId));
  }

  async getThread(id: string): Promise<Thread | undefined> {
    const [thread] = await db.select().from(threads).where(eq(threads.id, id));
    return thread;
  }

  async createThread(thread: InsertThread): Promise<Thread> {
    const [created] = await db.insert(threads).values(thread).returning();
    return created;
  }

  async updateThread(id: string, thread: Partial<InsertThread>): Promise<Thread | undefined> {
    const [updated] = await db.update(threads).set(thread).where(eq(threads.id, id)).returning();
    return updated;
  }

  async deleteThread(id: string): Promise<void> {
    await db.delete(threads).where(eq(threads.id, id));
  }

  // Analytics
  async getAnalytics(userId: string): Promise<Analytics[]> {
    const userThreads = await this.getThreads(userId);
    const threadIds = userThreads.map(t => t.id);
    if (threadIds.length === 0) return [];
    
    const results: Analytics[] = [];
    for (const threadId of threadIds) {
      const threadAnalytics = await this.getThreadAnalytics(threadId);
      if (threadAnalytics) results.push(threadAnalytics);
    }
    return results;
  }

  async getThreadAnalytics(threadId: string): Promise<Analytics | undefined> {
    const [result] = await db.select().from(analytics).where(eq(analytics.threadId, threadId));
    return result;
  }

  async createAnalytics(data: InsertAnalytics): Promise<Analytics> {
    const [created] = await db.insert(analytics).values(data).returning();
    return created;
  }

  async updateAnalytics(id: string, data: Partial<InsertAnalytics>): Promise<Analytics | undefined> {
    const [updated] = await db.update(analytics).set(data).where(eq(analytics.id, id)).returning();
    return updated;
  }

  // Hooks
  async getHooks(): Promise<Hook[]> {
    return db.select().from(hooks);
  }

  async getHooksByCategory(category: string): Promise<Hook[]> {
    return db.select().from(hooks).where(eq(hooks.category, category));
  }

  async createHook(hook: InsertHook): Promise<Hook> {
    const [created] = await db.insert(hooks).values(hook).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
