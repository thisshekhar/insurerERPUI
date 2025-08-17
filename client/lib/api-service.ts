// API Service Layer for Backend Communication
import { Policy } from "./policy-data";
import { PolicyRider } from "./rider-data";

// Base API configuration
const API_BASE_URL = "/api";
const API_DELAY = 500; // Simulate network delay

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Request options
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// Query parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate request ID
const generateRequestId = () =>
  `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// API Service Class
class APIService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: QueryParams): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object") {
            url.searchParams.append(key, JSON.stringify(value));
          } else {
            url.searchParams.append(key, value.toString());
          }
        }
      });
    }

    return url.toString();
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    params?: QueryParams,
  ): Promise<APIResponse<T>> {
    const { method = "GET", body, headers = {}, timeout = 10000 } = options;

    const requestId = generateRequestId();
    console.log(`[API] ${method} ${endpoint}`, { requestId, body, params });

    try {
      // Simulate network delay
      await delay(API_DELAY);

      const url = this.buildURL(endpoint, params);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}`);
      }

      const apiResponse: APIResponse<T> = {
        success: true,
        data: responseData.data || responseData,
        message: responseData.message,
        timestamp: new Date().toISOString(),
        requestId,
      };

      console.log(`[API] ${method} ${endpoint} - Success`, apiResponse);
      return apiResponse;
    } catch (error) {
      const errorResponse: APIResponse<T> = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        requestId,
      };

      console.error(`[API] ${method} ${endpoint} - Error`, errorResponse);
      return errorResponse;
    }
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: QueryParams,
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" }, params);
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  // PUT request
  async put<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  // PATCH request
  async patch<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Upload file
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: any,
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Create API service instance
export const apiService = new APIService();

// Specific API endpoints
export const endpoints = {
  // Dashboard & Analytics
  dashboard: {
    metrics: "/dashboard/metrics",
    performance: "/dashboard/performance",
    recentActivity: "/dashboard/recent-activity",
  },

  // Policies
  policies: {
    list: "/policies",
    create: "/policies",
    get: (id: string) => `/policies/${id}`,
    update: (id: string) => `/policies/${id}`,
    delete: (id: string) => `/policies/${id}`,
    riders: (id: string) => `/policies/${id}/riders`,
    documents: (id: string) => `/policies/${id}/documents`,
    renew: (id: string) => `/policies/${id}/renew`,
  },

  // Customers
  customers: {
    list: "/customers",
    create: "/customers",
    get: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    policies: (id: string) => `/customers/${id}/policies`,
    claims: (id: string) => `/customers/${id}/claims`,
  },

  // Claims
  claims: {
    list: "/claims",
    create: "/claims",
    get: (id: string) => `/claims/${id}`,
    update: (id: string) => `/claims/${id}`,
    delete: (id: string) => `/claims/${id}`,
    documents: (id: string) => `/claims/${id}/documents`,
    approve: (id: string) => `/claims/${id}/approve`,
    reject: (id: string) => `/claims/${id}/reject`,
  },

  // Agents
  agents: {
    list: "/agents",
    create: "/agents",
    get: (id: string) => `/agents/${id}`,
    update: (id: string) => `/agents/${id}`,
    delete: (id: string) => `/agents/${id}`,
    performance: (id: string) => `/agents/${id}/performance`,
    commissions: (id: string) => `/agents/${id}/commissions`,
  },

  // Payments
  payments: {
    list: "/payments",
    create: "/payments",
    get: (id: string) => `/payments/${id}`,
    process: "/payments/process",
    refund: (id: string) => `/payments/${id}/refund`,
  },

  // Documents
  documents: {
    list: "/documents",
    upload: "/documents/upload",
    get: (id: string) => `/documents/${id}`,
    delete: (id: string) => `/documents/${id}`,
    download: (id: string) => `/documents/${id}/download`,
  },

  // Reports
  reports: {
    business: "/reports/business",
    financial: "/reports/financial",
    claims: "/reports/claims",
    agents: "/reports/agents",
    export: "/reports/export",
  },

  // AI Features
  ai: {
    insights: "/ai/insights",
    predictions: "/ai/predictions",
    riskAssessment: "/ai/risk-assessment",
    fraudDetection: "/ai/fraud-detection",
  },

  // Riders
  riders: {
    available: "/riders/available",
    byPolicyType: (type: string) => `/riders/policy-type/${type}`,
  },

  // Settings
  settings: {
    get: "/settings",
    update: "/settings",
    ai: "/settings/ai",
  },
};

// Type-safe API methods
export const api = {
  // Dashboard methods
  getDashboardMetrics: () => apiService.get<any>(endpoints.dashboard.metrics),

  getDashboardPerformance: () =>
    apiService.get<any>(endpoints.dashboard.performance),

  getRecentActivity: () =>
    apiService.get<any>(endpoints.dashboard.recentActivity),

  // Policy methods
  getPolicies: (params?: QueryParams) =>
    apiService.get<PaginatedResponse<Policy>>(endpoints.policies.list, params),

  createPolicy: (policy: Partial<Policy>) =>
    apiService.post<Policy>(endpoints.policies.create, policy),

  getPolicy: (id: string) => apiService.get<Policy>(endpoints.policies.get(id)),

  updatePolicy: (id: string, policy: Partial<Policy>) =>
    apiService.put<Policy>(endpoints.policies.update(id), policy),

  deletePolicy: (id: string) =>
    apiService.delete<void>(endpoints.policies.delete(id)),

  // Customer methods
  getCustomers: (params?: QueryParams) =>
    apiService.get<PaginatedResponse<any>>(endpoints.customers.list, params),

  createCustomer: (customer: any) =>
    apiService.post<any>(endpoints.customers.create, customer),

  // Claims methods
  getClaims: (params?: QueryParams) =>
    apiService.get<PaginatedResponse<any>>(endpoints.claims.list, params),

  createClaim: (claim: any) =>
    apiService.post<any>(endpoints.claims.create, claim),

  // Agents methods
  getAgents: (params?: QueryParams) =>
    apiService.get<PaginatedResponse<any>>(endpoints.agents.list, params),

  // Reports methods
  getBusinessReport: (params?: any) =>
    apiService.get<any>(endpoints.reports.business, params),

  getFinancialReport: (params?: any) =>
    apiService.get<any>(endpoints.reports.financial, params),

  getClaimsReport: (params?: any) =>
    apiService.get<any>(endpoints.reports.claims, params),

  getAgentsReport: (params?: any) =>
    apiService.get<any>(endpoints.reports.agents, params),

  // AI methods
  getAIInsights: () => apiService.get<any>(endpoints.ai.insights),

  getAIPredictions: () => apiService.get<any>(endpoints.ai.predictions),

  // Riders methods
  getAvailableRiders: (policyType?: string) =>
    policyType
      ? apiService.get<PolicyRider[]>(endpoints.riders.byPolicyType(policyType))
      : apiService.get<PolicyRider[]>(endpoints.riders.available),
};

export default apiService;
