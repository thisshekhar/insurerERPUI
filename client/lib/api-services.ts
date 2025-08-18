// API Services using centralized API client
import { apiClient, ApiResponse, PaginatedResponse } from './api-client';
import { Policy } from './policy-data';

// Service interfaces
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  customerName: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Investigating';
  dateReported: string;
  description: string;
  type: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  policiesCount: number;
  totalCommission: number;
  rating: number;
}

export interface Payment {
  id: string;
  policyId: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Failed' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface DashboardMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalCustomers: number;
  totalClaims: number;
  pendingClaims: number;
  totalPremiums: number;
  totalCoverage: number;
  claimsAmount: number;
  monthlyGrowth: number;
  customerSatisfaction: number;
}

export interface PerformanceData {
  month: string;
  policies: number;
  premiums: number;
  claims: number;
  customers: number;
}

export interface RecentActivity {
  recentPolicies: Policy[];
  recentClaims: Claim[];
  notifications: Array<{
    id: number;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

// Query parameters interface
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  policyType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard API Services
export const dashboardApi = {
  getMetrics: (): Promise<ApiResponse<DashboardMetrics>> => {
    return apiClient.get<DashboardMetrics>('/dashboard/metrics');
  },

  getPerformance: (): Promise<ApiResponse<PerformanceData[]>> => {
    return apiClient.get<PerformanceData[]>('/dashboard/performance');
  },

  getRecentActivity: (): Promise<ApiResponse<RecentActivity>> => {
    return apiClient.get<RecentActivity>('/dashboard/recent-activity');
  },
};

// Customer API Services
export const customerApi = {
  getAll: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    return apiClient.get<PaginatedResponse<Customer>>('/customers', params);
  },

  getById: (id: string): Promise<ApiResponse<Customer>> => {
    return apiClient.get<Customer>(`/customers/${id}`);
  },

  create: (customer: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    return apiClient.post<Customer>('/customers', customer);
  },

  update: (id: string, customer: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    return apiClient.put<Customer>(`/customers/${id}`, customer);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/customers/${id}`);
  },

  search: (query: string): Promise<ApiResponse<Customer[]>> => {
    return apiClient.get<Customer[]>('/customers', { search: query });
  },
};

// Policy API Services
export const policyApi = {
  getAll: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Policy>>> => {
    return apiClient.get<PaginatedResponse<Policy>>('/policies', params);
  },

  getById: (id: string): Promise<ApiResponse<Policy>> => {
    return apiClient.get<Policy>(`/policies/${id}`);
  },

  create: (policy: Partial<Policy>): Promise<ApiResponse<Policy>> => {
    return apiClient.post<Policy>('/policies', policy);
  },

  update: (id: string, policy: Partial<Policy>): Promise<ApiResponse<Policy>> => {
    return apiClient.put<Policy>(`/policies/${id}`, policy);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/policies/${id}`);
  },

  renew: (id: string, renewalData: any): Promise<ApiResponse<Policy>> => {
    return apiClient.post<Policy>(`/policies/${id}/renew`, renewalData);
  },

  addRider: (id: string, rider: any): Promise<ApiResponse<Policy>> => {
    return apiClient.post<Policy>(`/policies/${id}/riders`, rider);
  },

  removeRider: (id: string, riderId: string): Promise<ApiResponse<Policy>> => {
    return apiClient.delete<Policy>(`/policies/${id}/riders/${riderId}`);
  },
};

// Claims API Services
export const claimApi = {
  getAll: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Claim>>> => {
    return apiClient.get<PaginatedResponse<Claim>>('/claims', params);
  },

  getById: (id: string): Promise<ApiResponse<Claim>> => {
    return apiClient.get<Claim>(`/claims/${id}`);
  },

  create: (claim: Partial<Claim>): Promise<ApiResponse<Claim>> => {
    return apiClient.post<Claim>('/claims', claim);
  },

  update: (id: string, claim: Partial<Claim>): Promise<ApiResponse<Claim>> => {
    return apiClient.put<Claim>(`/claims/${id}`, claim);
  },

  approve: (id: string, approvalData?: any): Promise<ApiResponse<Claim>> => {
    return apiClient.post<Claim>(`/claims/${id}/approve`, approvalData);
  },

  reject: (id: string, rejectionReason: string): Promise<ApiResponse<Claim>> => {
    return apiClient.post<Claim>(`/claims/${id}/reject`, { reason: rejectionReason });
  },

  uploadDocument: (id: string, file: File): Promise<ApiResponse<any>> => {
    return apiClient.upload(`/claims/${id}/documents`, file);
  },
};

// Agent API Services
export const agentApi = {
  getAll: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Agent>>> => {
    return apiClient.get<PaginatedResponse<Agent>>('/agents', params);
  },

  getById: (id: string): Promise<ApiResponse<Agent>> => {
    return apiClient.get<Agent>(`/agents/${id}`);
  },

  create: (agent: Partial<Agent>): Promise<ApiResponse<Agent>> => {
    return apiClient.post<Agent>('/agents', agent);
  },

  update: (id: string, agent: Partial<Agent>): Promise<ApiResponse<Agent>> => {
    return apiClient.put<Agent>(`/agents/${id}`, agent);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/agents/${id}`);
  },

  getPerformance: (id: string, period?: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/agents/${id}/performance`, { period });
  },

  getCommissions: (id: string, period?: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/agents/${id}/commissions`, { period });
  },
};

// Payment API Services
export const paymentApi = {
  getAll: (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    return apiClient.get<PaginatedResponse<Payment>>('/payments', params);
  },

  getById: (id: string): Promise<ApiResponse<Payment>> => {
    return apiClient.get<Payment>(`/payments/${id}`);
  },

  process: (paymentData: {
    policyId: string;
    amount: number;
    paymentMethod: string;
    cardDetails?: any;
  }): Promise<ApiResponse<Payment>> => {
    return apiClient.post<Payment>('/payments/process', paymentData);
  },

  refund: (id: string, refundData: {
    amount: number;
    reason: string;
  }): Promise<ApiResponse<Payment>> => {
    return apiClient.post<Payment>(`/payments/${id}/refund`, refundData);
  },

  getByPolicy: (policyId: string): Promise<ApiResponse<Payment[]>> => {
    return apiClient.get<Payment[]>('/payments', { policyId });
  },
};

// Document API Services
export const documentApi = {
  upload: (file: File, metadata?: any): Promise<ApiResponse<any>> => {
    return apiClient.upload('/documents/upload', file, metadata);
  },

  getById: (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/documents/${id}`);
  },

  delete: (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/documents/${id}`);
  },

  download: (id: string): Promise<ApiResponse<Blob>> => {
    return apiClient.get<Blob>(`/documents/${id}/download`);
  },

  getByEntity: (entityType: string, entityId: string): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/documents', { entityType, entityId });
  },
};

// AI API Services
export const aiApi = {
  getInsights: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/insights');
  },

  getPredictions: (type?: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/predictions', { type });
  },

  getRiskAssessment: (entityType: string, entityId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/risk-assessment', { entityType, entityId });
  },

  getFraudDetection: (claimId?: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/ai/fraud-detection', { claimId });
  },

  analyzeDocument: (file: File): Promise<ApiResponse<any>> => {
    return apiClient.upload('/ai/analyze-document', file);
  },
};

// Settings API Services
export const settingsApi = {
  get: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/settings');
  },

  update: (settings: any): Promise<ApiResponse<any>> => {
    return apiClient.put<any>('/settings', settings);
  },

  getAIConfig: (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/settings/ai');
  },

  updateAIConfig: (config: any): Promise<ApiResponse<any>> => {
    return apiClient.put<any>('/settings/ai', config);
  },
};

// Health check
export const healthApi = {
  check: (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    return apiClient.healthCheck();
  },
};

// Unified API object for easy imports
export const api = {
  dashboard: dashboardApi,
  customers: customerApi,
  policies: policyApi,
  claims: claimApi,
  agents: agentApi,
  payments: paymentApi,
  documents: documentApi,
  ai: aiApi,
  settings: settingsApi,
  health: healthApi,
};

// All services are already exported individually above
// No need for additional exports here

export default api;
