import { getAuthToken, removeAuthToken } from '../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Universal fetch wrapper that automatically injects the JWT Authorization header
 * and normalizes error handling.
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle unauthorized or expired sessions
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      removeAuthToken();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?error=session_expired';
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || `API request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

// Domain-Specific Services
export const authService = {
  register: (userData: { email: string; password: string; name: string; role: string }) =>
    api.post<{ message: string; user: any }>('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post<{ message: string; token: string; user: any }>('/auth/login', credentials),
  me: () => api.get('/auth/me'),
};

export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  getGrades: () => api.get('/student/grades'),
};

export const registrarService = {
  getDashboard: () => api.get('/registrar/dashboard'),
  getEnrollments: () => api.get('/registrar/enrollments'),
};

export const saoService = {
  getDashboard: () => api.get('/sao/dashboard'),
};

export const librarianService = {
  getDashboard: () => api.get('/librarian/dashboard'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

