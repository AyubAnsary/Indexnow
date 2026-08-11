export type EngineType = 'indexnow' | 'ping' | 'google_api' | 'bing_api';

export type SubmissionStatus = 'queued' | 'validating' | 'submitting' | 'success' | 'partial' | 'failed';

export type UrlStatus = 'pending' | 'checking_http' | 'indexnow_success' | 'ping_success' | 'google_success' | 'failed' | 'skipped';

export type UserRole = 'user' | 'admin';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'custom';

export type PlanStatus = 'active' | 'approval_pending' | 'cancelled';

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  monthlyQuota: number;
  description: string;
  features: string[];
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  tier: SubscriptionTier;
  planStatus: PlanStatus;
  requestedTier?: SubscriptionTier;
  monthlyQuota: number;
  urlsUsedThisMonth: number;
  customPriceAmount?: number;
  currentPeriodStart: string;
  createdAt: string;
  googleServiceAccountEncrypted?: string; // Encrypted AES-256-GCM JSON string
  activeSessionId?: string; // Anti-Group Buy: Single Active Device Lock
  activeFingerprint?: string; // Anti-Group Buy: IP + User-Agent Fingerprint
  lastIpAddress?: string;
}

export interface DispatchedEngineResult {
  engine: EngineType;
  endpoint: string;
  success: boolean;
  statusCode?: number;
  message?: string;
  timestamp: string;
}

export interface UrlSubmissionItem {
  id: string;
  url: string;
  domain: string;
  httpStatus?: number;
  httpStatusText?: string;
  status: UrlStatus;
  engineResults: DispatchedEngineResult[];
  submittedAt?: string;
  errorMessage?: string;
}

export interface IndexingJob {
  id: string;
  userId: string; // Multi-tenant isolation
  createdAt: string;
  updatedAt: string;
  totalUrls: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  status: SubmissionStatus;
  enginesSelected: EngineType[];
  urls: UrlSubmissionItem[];
  logs: LogEntry[];
  keyUsed?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  engine?: EngineType;
  message: string;
  details?: Record<string, unknown>;
}

export interface IndexNowOptions {
  hostKey?: string;
  keyLocation?: string;
  customEndpoints?: string[];
}

export interface GoogleServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri?: string;
  token_uri?: string;
}

export interface SitemapMonitor {
  id: string;
  userId: string;
  sitemapUrl: string;
  domain: string;
  checkIntervalMinutes: number; // e.g. 60, 360, 1440
  lastCheckedAt: string | null;
  lastUrlCount: number;
  discoveredUrlsCount: number;
  status: 'active' | 'paused' | 'error';
  lastError?: string | null;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyPrefix: string; // e.g. sk_silverstone_a1b2
  hashedKey: string; // Hashed secret key
  createdAt: string;
  lastUsedAt?: string | null;
}

export interface IndexingStats {
  totalJobs: number;
  totalUrlsSubmitted: number;
  successRatePercent: number;
  activeDomainsCount: number;
  averageSpeedMs: number;
  remainingQuota: number;
  monthlyQuota: number;
  tier: SubscriptionTier;
}

export const PLAN_TIERS: Record<SubscriptionTier, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Tier',
    priceMonthly: 0,
    monthlyQuota: 10,
    description: 'Perfect for trying out instant indexing.',
    features: [
      '10 URLs / month',
      'Instant IndexNow Protocol (Bing, Yandex)',
      'Global Crawl Ping Network',
      'Real-time SSE Telemetry Feed',
      '7-day History Retention',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter Plan',
    priceMonthly: 5,
    monthlyQuota: 100,
    description: 'Ideal for blogs, niche sites, and small businesses.',
    features: [
      '100 URLs / month',
      'Everything in Free',
      'Connect Own Google Indexing API',
      'XML Sitemap Auto-Extractor',
      '30-day History Retention',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    priceMonthly: 15,
    monthlyQuota: 500,
    description: 'Designed for high-traffic sites, e-commerce & content creators.',
    features: [
      '500 URLs / month',
      'Everything in Starter',
      'Priority Queue Processing',
      'Pre-flight HTTP 200 OK Inspector',
      'CSV & JSON Audit Reports',
    ],
  },
  custom: {
    id: 'custom',
    name: 'Agency / Custom',
    priceMonthly: 0, // Custom Quote
    monthlyQuota: 2500, // Custom Quota
    description: 'Tailored for agencies, large enterprise networks, and high volume.',
    features: [
      'Custom URL Quota (2,500 - 100,000+ URLs)',
      'Everything in Pro',
      'Admin Granted Custom Pricing',
      'Whitelabel Client PDF Reports',
      'Dedicated Priority Account Support',
    ],
  },
};
