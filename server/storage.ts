import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, voicePacks, threads, analytics, hooks, connectedAccounts, agencyClients, clientVoicePacks,
  type User, type InsertUser,
  type VoicePack, type InsertVoicePack,
  type Thread, type InsertThread,
  type Analytics, type InsertAnalytics,
  type Hook, type InsertHook,
  type ConnectedAccount, type InsertConnectedAccount,
  type AgencyClient, type InsertAgencyClient,
  type ClientVoicePack, type InsertClientVoicePack,
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

  // Connected Accounts
  getConnectedAccounts(userId: string): Promise<ConnectedAccount[]>;
  getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined>;
  upsertConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount>;
  disconnectAccount(userId: string, platform: string): Promise<void>;

  // Agency Clients
  getAgencyClients(userId: string): Promise<AgencyClient[]>;
  getAgencyClient(id: string): Promise<AgencyClient | undefined>;
  createAgencyClient(client: InsertAgencyClient): Promise<AgencyClient>;
  updateAgencyClient(id: string, client: Partial<InsertAgencyClient>): Promise<AgencyClient | undefined>;
  deleteAgencyClient(id: string): Promise<void>;

  // Client Voice Pack Assignments
  getClientVoicePacks(clientId: string): Promise<ClientVoicePack[]>;
  assignVoicePackToClient(assignment: InsertClientVoicePack): Promise<ClientVoicePack>;
  unassignVoicePackFromClient(clientId: string, voicePackId: string): Promise<void>;
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

  // Connected Accounts
  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    return db.select().from(connectedAccounts).where(eq(connectedAccounts.userId, userId));
  }

  async getConnectedAccount(userId: string, platform: string): Promise<ConnectedAccount | undefined> {
    const results = await db.select().from(connectedAccounts)
      .where(eq(connectedAccounts.userId, userId));
    return results.find(a => a.platform === platform);
  }

  async upsertConnectedAccount(account: InsertConnectedAccount): Promise<ConnectedAccount> {
    const existing = await this.getConnectedAccount(account.userId, account.platform);
    if (existing) {
      const [updated] = await db.update(connectedAccounts)
        .set(account)
        .where(eq(connectedAccounts.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(connectedAccounts).values(account).returning();
    return created;
  }

  async disconnectAccount(userId: string, platform: string): Promise<void> {
    const account = await this.getConnectedAccount(userId, platform);
    if (account) {
      await db.update(connectedAccounts)
        .set({ isConnected: false, platformUsername: null })
        .where(eq(connectedAccounts.id, account.id));
    }
  }

  // Agency Clients
  async getAgencyClients(userId: string): Promise<AgencyClient[]> {
    return db.select().from(agencyClients).where(eq(agencyClients.userId, userId));
  }

  async getAgencyClient(id: string): Promise<AgencyClient | undefined> {
    const [client] = await db.select().from(agencyClients).where(eq(agencyClients.id, id));
    return client;
  }

  async createAgencyClient(client: InsertAgencyClient): Promise<AgencyClient> {
    const [created] = await db.insert(agencyClients).values(client).returning();
    return created;
  }

  async updateAgencyClient(id: string, client: Partial<InsertAgencyClient>): Promise<AgencyClient | undefined> {
    const [updated] = await db.update(agencyClients).set(client).where(eq(agencyClients.id, id)).returning();
    return updated;
  }

  async deleteAgencyClient(id: string): Promise<void> {
    await db.delete(clientVoicePacks).where(eq(clientVoicePacks.clientId, id));
    await db.delete(agencyClients).where(eq(agencyClients.id, id));
  }

  // Client Voice Pack Assignments
  async getClientVoicePacks(clientId: string): Promise<ClientVoicePack[]> {
    return db.select().from(clientVoicePacks).where(eq(clientVoicePacks.clientId, clientId));
  }

  async assignVoicePackToClient(assignment: InsertClientVoicePack): Promise<ClientVoicePack> {
    const [created] = await db.insert(clientVoicePacks).values(assignment).returning();
    return created;
  }

  async unassignVoicePackFromClient(clientId: string, voicePackId: string): Promise<void> {
    const assignments = await this.getClientVoicePacks(clientId);
    const toDelete = assignments.find(a => a.voicePackId === voicePackId);
    if (toDelete) {
      await db.delete(clientVoicePacks).where(eq(clientVoicePacks.id, toDelete.id));
    }
  }
}

export const storage = new DatabaseStorage();
