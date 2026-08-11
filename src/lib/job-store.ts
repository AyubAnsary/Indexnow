import fs from 'fs';
import path from 'path';
import { IndexingJob, UserAccount, LogEntry, PLAN_TIERS, SubscriptionTier, GoogleServiceAccount } from './types';
import { hashPassword, encryptData, decryptData } from './security';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  jobs: IndexingJob[];
  users: UserAccount[];
}

const globalForStore = globalThis as unknown as {
  __indexnow_store__?: StoreData;
  __indexnow_subscribers__?: Set<(job: IndexingJob) => void>;
};

function initStore(): StoreData {
  if (globalForStore.__indexnow_store__) {
    return globalForStore.__indexnow_store__;
  }

  let loadedData: StoreData = {
    jobs: [],
    users: [],
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      loadedData.jobs = Array.isArray(parsed.jobs) ? parsed.jobs : [];
      loadedData.users = Array.isArray(parsed.users) ? parsed.users : [];
    }
  } catch (err) {
    console.error('Error initializing store:', err);
  }

  // Ensure default Admin Account exists
  const hasAdmin = loadedData.users.some((u) => u.email.toLowerCase() === 'admin@indexpulse.com');
  if (!hasAdmin) {
    const adminAuth = hashPassword('admin123', '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d');
    const defaultAdmin: UserAccount = {
      id: 'usr_admin',
      email: 'admin@indexpulse.com',
      name: 'System Admin',
      passwordHash: adminAuth.hash,
      passwordSalt: adminAuth.salt,
      role: 'admin',
      tier: 'custom',
      planStatus: 'active',
      monthlyQuota: 100000,
      urlsUsedThisMonth: 0,
      currentPeriodStart: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    loadedData.users.unshift(defaultAdmin);
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(loadedData, null, 2), 'utf-8');
    } catch {}
  }

  globalForStore.__indexnow_store__ = loadedData;
  return loadedData;
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(getStoreData(), null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store file:', err);
  }
}

export function getStoreData(): StoreData {
  return initStore();
}

// User Accounts Management
export function getAllUsers(): UserAccount[] {
  return getStoreData().users || [];
}

export function getUserById(id: string): UserAccount | undefined {
  const users = getStoreData().users || [];
  const user = users.find((u) => u.id === id);
  if (user) {
    checkAndResetMonthlyQuota(user);
  }
  return user;
}

export function getUserByEmail(email: string): UserAccount | undefined {
  const users = getStoreData().users || [];
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    checkAndResetMonthlyQuota(user);
  }
  return user;
}

export function createUser(email: string, name: string, passwordHash: string, passwordSalt: string): UserAccount {
  const store = getStoreData();
  const newUser: UserAccount = {
    id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    email: email.toLowerCase(),
    name,
    passwordHash,
    passwordSalt,
    role: 'user',
    tier: 'free',
    planStatus: 'active',
    monthlyQuota: PLAN_TIERS.free.monthlyQuota, // 10 URLs/month
    urlsUsedThisMonth: 0,
    currentPeriodStart: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  saveStore();
  return newUser;
}

export function saveUser(user: UserAccount): void {
  const store = getStoreData();
  const idx = store.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    store.users[idx] = user;
  } else {
    store.users.push(user);
  }
  saveStore();
}

// Monthly Quota Reset Check (Every 30 Days)
function checkAndResetMonthlyQuota(user: UserAccount): void {
  const start = new Date(user.currentPeriodStart).getTime();
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 3600 * 1000;

  if (now - start > thirtyDaysMs) {
    user.urlsUsedThisMonth = 0;
    user.currentPeriodStart = new Date().toISOString();
    saveUser(user);
  }
}

/**
 * Checks if a user has sufficient quota for a requested number of URLs.
 * Deducts quota if valid.
 */
export function checkAndDeductQuota(
  userId: string,
  requestedCount: number
): { allowed: boolean; remaining: number; totalQuota: number; errorMsg?: string } {
  const user = getUserById(userId);
  if (!user) {
    return { allowed: false, remaining: 0, totalQuota: 0, errorMsg: 'User account not found.' };
  }

  const remaining = Math.max(0, user.monthlyQuota - user.urlsUsedThisMonth);
  if (requestedCount > remaining) {
    return {
      allowed: false,
      remaining,
      totalQuota: user.monthlyQuota,
      errorMsg: `Monthly URL quota exceeded. You have ${remaining} URLs remaining out of ${user.monthlyQuota}/month on your ${user.tier.toUpperCase()} plan. Please upgrade to submit more URLs.`,
    };
  }

  user.urlsUsedThisMonth += requestedCount;
  saveUser(user);

  return {
    allowed: true,
    remaining: user.monthlyQuota - user.urlsUsedThisMonth,
    totalQuota: user.monthlyQuota,
  };
}

// Multi-tenant Job Management
export function getJobsForUser(userId: string): IndexingJob[] {
  return getStoreData().jobs.filter((j) => j.userId === userId);
}

export function getAllJobsAdmin(): IndexingJob[] {
  return getStoreData().jobs;
}

export function getJobById(id: string): IndexingJob | undefined {
  return getStoreData().jobs.find((j) => j.id === id);
}

export function saveJob(job: IndexingJob): void {
  const store = getStoreData();
  const idx = store.jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    store.jobs[idx] = job;
  } else {
    store.jobs.unshift(job);
  }
  saveStore();
  notifySubscribers(job);
}

export function addJobLog(jobId: string, log: Omit<LogEntry, 'id' | 'timestamp'>): void {
  const job = getJobById(jobId);
  if (!job) return;

  const newLog: LogEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    ...log,
  };

  job.logs.push(newLog);
  job.updatedAt = new Date().toISOString();
  saveJob(job);
}

// Encrypted Per-User Google API Credentials Management
export function saveUserGoogleCredentials(userId: string, serviceAccountJson: string): void {
  const user = getUserById(userId);
  if (!user) return;

  user.googleServiceAccountEncrypted = encryptData(serviceAccountJson);
  saveUser(user);
}

export function getUserGoogleCredentials(userId: string): GoogleServiceAccount | null {
  const user = getUserById(userId);
  if (!user || !user.googleServiceAccountEncrypted) return null;

  try {
    const decryptedJson = decryptData(user.googleServiceAccountEncrypted);
    if (!decryptedJson) return null;
    return JSON.parse(decryptedJson);
  } catch {
    return null;
  }
}

// Admin Management Functions
export function approveUserPlan(userId: string, newTier: SubscriptionTier): void {
  const user = getUserById(userId);
  if (!user) return;

  user.tier = newTier;
  user.planStatus = 'active';
  user.requestedTier = undefined;
  user.monthlyQuota = PLAN_TIERS[newTier]?.monthlyQuota || user.monthlyQuota;
  saveUser(user);
}

export function grantCustomQuota(userId: string, customQuota: number, customPrice?: number): void {
  const user = getUserById(userId);
  if (!user) return;

  user.tier = 'custom';
  user.planStatus = 'active';
  user.monthlyQuota = customQuota;
  if (customPrice !== undefined) {
    user.customPriceAmount = customPrice;
  }
  saveUser(user);
}

// SSE Real-Time Event Subscribers
export function subscribeToJobUpdates(callback: (job: IndexingJob) => void): () => void {
  if (!globalForStore.__indexnow_subscribers__) {
    globalForStore.__indexnow_subscribers__ = new Set();
  }
  globalForStore.__indexnow_subscribers__.add(callback);

  return () => {
    globalForStore.__indexnow_subscribers__?.delete(callback);
  };
}

function notifySubscribers(job: IndexingJob) {
  if (globalForStore.__indexnow_subscribers__) {
    for (const callback of globalForStore.__indexnow_subscribers__) {
      try {
        callback(job);
      } catch (e) {
        console.error('Subscriber notify error:', e);
      }
    }
  }
}
