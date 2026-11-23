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

// Fast client-side in-memory cache for GET requests (20s TTL)
const getCache = new Map<string, { data: any; expiry: number }>();

export function clearApiCache(endpointPrefix?: string) {
  if (!endpointPrefix) {
    getCache.clear();
  } else {
    for (const key of getCache.keys()) {
      if (key.includes(endpointPrefix)) {
        getCache.delete(key);
      }
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

  // Serve from memory cache if GET request and still fresh
  const isGet = method === 'GET';
  const cacheKey = `${url}`;
  if (isGet && typeof window !== 'undefined' && options.cache !== 'no-store') {
    const cached = getCache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
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

  // Cache successful GET responses for 20 seconds
  if (isGet && typeof window !== 'undefined' && data?.success) {
    getCache.set(cacheKey, { data, expiry: Date.now() + 20_000 });
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
