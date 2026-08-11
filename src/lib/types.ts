export type EngineType = 'indexnow' | 'ping' | 'google_api' | 'bing_api';

export type SubmissionStatus = 'queued' | 'validating' | 'submitting' | 'success' | 'partial' | 'failed';

export type UrlStatus = 'pending' | 'checking_http' | 'indexnow_success' | 'ping_success' | 'google_success' | 'failed' | 'skipped';

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

export interface UserCredentials {
  googleServiceAccount?: GoogleServiceAccount | null;
  bingApiKey?: string | null;
  indexNowKey?: string;
}

export interface IndexingStats {
  totalJobs: number;
  totalUrlsSubmitted: number;
  successRatePercent: number;
  activeDomainsCount: number;
  averageSpeedMs: number;
}
