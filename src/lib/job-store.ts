import fs from 'fs';
import path from 'path';
import { IndexingJob, UserCredentials, LogEntry } from './types';

// Ensure data persistence directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreData {
  jobs: IndexingJob[];
  credentials: UserCredentials;
}

// Global cache object to survive hot-reloading in dev mode
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
    credentials: {
      googleServiceAccount: null,
      bingApiKey: null,
    },
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      loadedData = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error initializing store:', err);
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

export function getAllJobs(): IndexingJob[] {
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
    store.jobs.unshift(job); // Add newest first
  }
  saveStore();

  // Notify subscribers (SSE streams)
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

export function getUserCredentials(): UserCredentials {
  return getStoreData().credentials;
}

export function saveUserCredentials(creds: Partial<UserCredentials>): UserCredentials {
  const store = getStoreData();
  store.credentials = {
    ...store.credentials,
    ...creds,
  };
  saveStore();
  return store.credentials;
}

// Event Subscribers for SSE (Real-Time Live Feed)
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
