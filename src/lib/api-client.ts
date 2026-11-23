export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  error?: string;
  details?: any;
  statusCode?: number;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fast multi-tier client-side cache for GET requests (45s TTL)
const getCache = new Map<string, { data: any; expiry: number }>();
const CACHE_PREFIX = 'fixmate_api_cache_';

export function clearApiCache(endpointPrefix?: string) {
  getCache.clear();
  if (typeof window !== 'undefined') {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          if (!endpointPrefix || key.includes(endpointPrefix)) {
            sessionStorage.removeItem(key);
          }
        }
      }
    } catch {
      // ignore sessionStorage access errors
    }
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Multi-tier cache lookup for GET requests: memory -> sessionStorage
  const isGet = method === 'GET';
  const storageKey = `${CACHE_PREFIX}${url}`;
  if (isGet && typeof window !== 'undefined' && options.cache !== 'no-store') {
    // 1. In-memory lookup (0ms)
    const memoryCached = getCache.get(url);
    if (memoryCached && Date.now() < memoryCached.expiry) {
      return memoryCached.data;
    }

    // 2. SessionStorage lookup (survives route switches & soft reloads)
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Date.now() < parsed.expiry) {
          getCache.set(url, parsed);
          return parsed.data;
        }
      }
    } catch {
      // ignore JSON parse or storage errors
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fixmate_token');
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Capture auth token if returned via custom header
  if (typeof window !== 'undefined') {
    const authJwt = response.headers.get('set-auth-token') || response.headers.get('set-auth-jwt');
    if (authJwt) {
      localStorage.setItem('fixmate_token', authJwt);
    }
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  // Cache successful GET responses for 45 seconds across memory and session
  if (isGet && typeof window !== 'undefined' && data?.success) {
    const cacheEntry = { data, expiry: Date.now() + 45_000 };
    getCache.set(url, cacheEntry);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(cacheEntry));
    } catch {
      // storage limit or disabled
    }
  }

  // On data-mutating requests (POST, PATCH, DELETE), invalidate cache
  if (!isGet) {
    clearApiCache();
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};
