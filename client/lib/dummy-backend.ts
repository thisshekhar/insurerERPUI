// Dummy Backend API Server
import { mockCustomers, mockClaims } from './mock-data';
import { mockPolicies, Policy } from './policy-data';
import { mockAgents } from './agent-data';
import { mockPayments } from './payment-data';
import { mockPolicyRiders, availableRidersByPolicyType } from './rider-data';

// In-memory database simulation
class DummyDatabase {
  private customers = [...mockCustomers];
  private policies = [...mockPolicies];
  private claims = [...mockClaims];
  private agents = [...mockAgents];
  private payments = [...mockPayments];
  private policyRiders = [...mockPolicyRiders];

  // Customers
  getCustomers(filters?: any) {
    let result = [...this.customers];
    if (filters?.search) {
      result = result.filter(c => 
        c.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return result;
  }

  createCustomer(customer: any) {
    const newCustomer = {
      ...customer,
      id: `CUST-${String(this.customers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  getCustomer(id: string) {
    return this.customers.find(c => c.id === id);
  }

  updateCustomer(id: string, updates: any) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updates, updatedAt: new Date().toISOString() };
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id: string) {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      return this.customers.splice(index, 1)[0];
    }
    return null;
  }

  // Policies
  getPolicies(filters?: any) {
    let result = [...this.policies];
    if (filters?.search) {
      result = result.filter(p => 
        p.policyNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.policyType.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.policyType) {
      result = result.filter(p => p.policyType === filters.policyType);
    }
    return result;
  }

  createPolicy(policy: any) {
    const newPolicy = {
      ...policy,
      id: `POL-${String(this.policies.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.policies.push(newPolicy);
    return newPolicy;
  }

  getPolicy(id: string) {
    return this.policies.find(p => p.id === id);
  }

  updatePolicy(id: string, updates: any) {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.policies[index] = { ...this.policies[index], ...updates, updatedAt: new Date().toISOString() };
      return this.policies[index];
    }
    return null;
  }

  deletePolicy(id: string) {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      return this.policies.splice(index, 1)[0];
    }
    return null;
  }

  // Claims
  getClaims(filters?: any) {
    let result = [...this.claims];
    if (filters?.search) {
      result = result.filter(c => 
        c.claimNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters?.status) {
      result = result.filter(c => c.status === filters.status);
    }
    return result;
  }

  createClaim(claim: any) {
    const newClaim = {
      ...claim,
      id: `CLM-${String(this.claims.length + 1).padStart(3, '0')}`,
      claimNumber: `CLM-${new Date().getFullYear()}-${String(this.claims.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.claims.push(newClaim);
    return newClaim;
  }

  // Agents
  getAgents(filters?: any) {
    let result = [...this.agents];
    if (filters?.search) {
      result = result.filter(a => 
        a.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return result;
  }

  // Analytics and Reports
  getDashboardMetrics() {
    return {
      totalPolicies: this.policies.length,
      activePolicies: this.policies.filter(p => p.status === 'Active').length,
      totalCustomers: this.customers.length,
      totalClaims: this.claims.length,
      pendingClaims: this.claims.filter(c => c.status === 'Pending').length,
      totalPremiums: this.policies.reduce((sum, p) => sum + p.premiumAmount, 0),
      totalCoverage: this.policies.reduce((sum, p) => sum + p.coverageAmount, 0),
      claimsAmount: this.claims.reduce((sum, c) => sum + c.amount, 0),
      avgPolicyValue: this.policies.reduce((sum, p) => sum + p.premiumAmount, 0) / this.policies.length,
      monthlyGrowth: 8.5,
      customerSatisfaction: 94.2,
    };
  }

  getPerformanceData() {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        policies: Math.floor(Math.random() * 50) + 50,
        premiums: Math.floor(Math.random() * 100000) + 200000,
        claims: Math.floor(Math.random() * 20) + 10,
        customers: Math.floor(Math.random() * 30) + 20,
      };
    }).reverse();

    return last6Months;
  }

  getBusinessReport(dateRange?: any) {
    const policies = this.getPolicies();
    const claims = this.getClaims();
    
    return {
      summary: {
        totalPolicies: policies.length,
        activePolicies: policies.filter(p => p.status === 'Active').length,
        totalPremiums: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
        totalClaims: claims.length,
        totalClaimsAmount: claims.reduce((sum, c) => sum + c.amount, 0),
        profitMargin: 23.5,
        customerRetention: 89.2,
      },
      policyBreakdown: this.getPolicyTypeBreakdown(),
      monthlyTrends: this.getPerformanceData(),
      topPerformingAgents: this.getTopAgents(5),
      riskAnalysis: this.getRiskAnalysis(),
    };
  }

  getFinancialReport(dateRange?: any) {
    const policies = this.getPolicies();
    const claims = this.getClaims();
    const payments = this.payments;

    return {
      revenue: {
        totalPremiums: policies.reduce((sum, p) => sum + p.premiumAmount, 0),
        paidPremiums: payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
        pendingPremiums: payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
        overduePremiums: payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0),
      },
      expenses: {
        totalClaims: claims.reduce((sum, c) => sum + c.amount, 0),
        paidClaims: claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0),
        pendingClaims: claims.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0),
        commissions: this.agents.reduce((sum, a) => sum + a.totalCommission, 0),
      },
      profitability: {
        grossProfit: 2450000,
        netProfit: 1890000,
        profitMargin: 23.5,
        roi: 18.2,
      },
      cashFlow: this.getCashFlowData(),
    };
  }

  getClaimsReport() {
    const claims = this.getClaims();
    
    return {
      summary: {
        totalClaims: claims.length,
        approvedClaims: claims.filter(c => c.status === 'Approved').length,
        pendingClaims: claims.filter(c => c.status === 'Pending').length,
        rejectedClaims: claims.filter(c => c.status === 'Rejected').length,
        avgProcessingTime: 12.5,
        approvalRate: 78.3,
      },
      claimsByType: this.getClaimsByType(),
      claimsByStatus: this.getClaimsByStatus(),
      monthlyClaimsTrend: this.getMonthlyClaimsTrend(),
      topClaimReasons: this.getTopClaimReasons(),
    };
  }

  getAgentsReport() {
    const agents = this.getAgents();
    
    return {
      summary: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'Active').length,
        totalPoliciesSold: agents.reduce((sum, a) => sum + a.policiesCount, 0),
        totalCommissions: agents.reduce((sum, a) => sum + a.totalCommission, 0),
        avgRating: agents.reduce((sum, a) => sum + a.rating, 0) / agents.length,
      },
      performance: agents.map(agent => ({
        ...agent,
        conversionRate: Math.random() * 30 + 60, // 60-90%
        customerSatisfaction: Math.random() * 20 + 80, // 80-100%
      })),
      topPerformers: this.getTopAgents(10),
      commissionTrends: this.getCommissionTrends(),
    };
  }

  // Helper methods for reports
  private getPolicyTypeBreakdown() {
    const policies = this.getPolicies();
    const breakdown: Record<string, number> = {};
    
    policies.forEach(policy => {
      breakdown[policy.policyType] = (breakdown[policy.policyType] || 0) + 1;
    });

    return Object.entries(breakdown).map(([type, count]) => ({
      type,
      count,
      percentage: (count / policies.length) * 100,
    }));
  }

  private getTopAgents(limit: number) {
    return this.agents
      .sort((a, b) => b.totalCommission - a.totalCommission)
      .slice(0, limit);
  }

  private getRiskAnalysis() {
    return {
      lowRisk: this.policies.filter(p => p.riskAssessment === 'Low').length,
      mediumRisk: this.policies.filter(p => p.riskAssessment === 'Medium').length,
      highRisk: this.policies.filter(p => p.riskAssessment === 'High').length,
    };
  }

  private getCashFlowData() {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        inflow: Math.floor(Math.random() * 500000) + 800000,
        outflow: Math.floor(Math.random() * 300000) + 400000,
      };
    }).reverse();
  }

  private getClaimsByType() {
    const claims = this.getClaims();
    const breakdown: Record<string, number> = {};
    
    claims.forEach(claim => {
      breakdown[claim.type] = (breakdown[claim.type] || 0) + 1;
    });

    return Object.entries(breakdown).map(([type, count]) => ({
      type,
      count,
      amount: claims.filter(c => c.type === type).reduce((sum, c) => sum + c.amount, 0),
    }));
  }

  private getClaimsByStatus() {
    const claims = this.getClaims();
    const breakdown: Record<string, number> = {};
    
    claims.forEach(claim => {
      breakdown[claim.status] = (breakdown[claim.status] || 0) + 1;
    });

    return breakdown;
  }

  private getMonthlyClaimsTrend() {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        claims: Math.floor(Math.random() * 30) + 20,
        amount: Math.floor(Math.random() * 200000) + 100000,
      };
    }).reverse();
  }

  private getTopClaimReasons() {
    return [
      { reason: 'Accident', count: 45, percentage: 32.1 },
      { reason: 'Theft', count: 28, percentage: 20.0 },
      { reason: 'Natural Disaster', count: 22, percentage: 15.7 },
      { reason: 'Medical Emergency', count: 18, percentage: 12.9 },
      { reason: 'Property Damage', count: 15, percentage: 10.7 },
      { reason: 'Other', count: 12, percentage: 8.6 },
    ];
  }

  private getCommissionTrends() {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        totalCommissions: Math.floor(Math.random() * 50000) + 100000,
        avgCommissionPerAgent: Math.floor(Math.random() * 5000) + 8000,
      };
    }).reverse();
  }
}

// Create database instance
const db = new DummyDatabase();

// API Response wrapper
const createResponse = (data: any, success: boolean = true, message?: string) => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
});

const createErrorResponse = (error: string) => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
});

// Pagination helper
const paginate = (items: any[], page: number = 1, pageSize: number = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    total,
    page,
    pageSize,
    totalPages,
  };
};

// Dummy Backend API Routes
export const dummyBackend = {
  // Dashboard endpoints
  'GET /api/dashboard/metrics': () => {
    return createResponse(db.getDashboardMetrics());
  },

  'GET /api/dashboard/performance': () => {
    return createResponse(db.getPerformanceData());
  },

  'GET /api/dashboard/recent-activity': () => {
    const recentPolicies = db.getPolicies().slice(-5);
    const recentClaims = db.getClaims().slice(-5);
    
    return createResponse({
      recentPolicies,
      recentClaims,
      notifications: [
        { id: 1, type: 'policy', message: 'New policy created', timestamp: new Date().toISOString() },
        { id: 2, type: 'claim', message: 'Claim pending review', timestamp: new Date().toISOString() },
      ],
    });
  },

  // Customer endpoints
  'GET /api/customers': (params: any) => {
    const { page = 1, pageSize = 10, search } = params;
    const customers = db.getCustomers({ search });
    return createResponse(paginate(customers, page, pageSize));
  },

  'POST /api/customers': (body: any) => {
    const customer = db.createCustomer(body);
    return createResponse(customer, true, 'Customer created successfully');
  },

  'GET /api/customers/:id': (params: any) => {
    const customer = db.getCustomer(params.id);
    if (!customer) {
      return createErrorResponse('Customer not found');
    }
    return createResponse(customer);
  },

  // Policy endpoints
  'GET /api/policies': (params: any) => {
    const { page = 1, pageSize = 10, search, status, policyType } = params;
    const policies = db.getPolicies({ search, status, policyType });
    return createResponse(paginate(policies, page, pageSize));
  },

  'POST /api/policies': (body: any) => {
    const policy = db.createPolicy(body);
    return createResponse(policy, true, 'Policy created successfully');
  },

  'GET /api/policies/:id': (params: any) => {
    const policy = db.getPolicy(params.id);
    if (!policy) {
      return createErrorResponse('Policy not found');
    }
    return createResponse(policy);
  },

  // Claims endpoints
  'GET /api/claims': (params: any) => {
    const { page = 1, pageSize = 10, search, status } = params;
    const claims = db.getClaims({ search, status });
    return createResponse(paginate(claims, page, pageSize));
  },

  'POST /api/claims': (body: any) => {
    const claim = db.createClaim(body);
    return createResponse(claim, true, 'Claim created successfully');
  },

  // Agent endpoints
  'GET /api/agents': (params: any) => {
    const { page = 1, pageSize = 10, search } = params;
    const agents = db.getAgents({ search });
    return createResponse(paginate(agents, page, pageSize));
  },

  // Report endpoints
  'GET /api/reports/business': (params: any) => {
    return createResponse(db.getBusinessReport(params));
  },

  'GET /api/reports/financial': (params: any) => {
    return createResponse(db.getFinancialReport(params));
  },

  'GET /api/reports/claims': () => {
    return createResponse(db.getClaimsReport());
  },

  'GET /api/reports/agents': () => {
    return createResponse(db.getAgentsReport());
  },

  // AI endpoints
  'GET /api/ai/insights': () => {
    return createResponse({
      riskScore: 82,
      fraudAlerts: 3,
      predictions: [
        { type: 'Churn Risk', value: 'Low', confidence: 89 },
        { type: 'Revenue Growth', value: '+12%', confidence: 76 },
        { type: 'Claims Spike', value: 'Moderate', confidence: 68 },
      ],
      recommendations: [
        'Review high-risk policies for premium adjustment',
        'Focus on customer retention in the 45-65 age group',
        'Increase fraud monitoring for auto insurance claims',
      ],
    });
  },

  // Riders endpoints
  'GET /api/riders/available': () => {
    return createResponse(Object.values(availableRidersByPolicyType).flat());
  },

  'GET /api/riders/policy-type/:type': (params: any) => {
    const riders = availableRidersByPolicyType[params.type as keyof typeof availableRidersByPolicyType] || [];
    return createResponse(riders);
  },
};

// Mock fetch interceptor
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();
  const method = init?.method || 'GET';
  const routeKey = `${method} ${url.split('?')[0]}`;
  
  // Check if this is an API route we should mock
  if (url.startsWith('/api')) {
    console.log(`[Dummy Backend] ${routeKey}`);
    
    // Find matching route (including parameterized routes)
    const matchingRoute = Object.keys(dummyBackend).find(route => {
      const routePath = route.split(' ')[1];
      const urlPath = url.split('?')[0];
      
      // Simple parameter matching
      const routeParts = routePath.split('/');
      const urlParts = urlPath.split('/');
      
      if (routeParts.length !== urlParts.length) return false;
      
      return routeParts.every((part, index) => {
        return part.startsWith(':') || part === urlParts[index];
      });
    });

    if (matchingRoute) {
      const handler = dummyBackend[matchingRoute as keyof typeof dummyBackend];
      
      // Extract parameters
      const routePath = matchingRoute.split(' ')[1];
      const urlPath = url.split('?')[0];
      const routeParts = routePath.split('/');
      const urlParts = urlPath.split('/');
      const params: any = {};
      
      routeParts.forEach((part, index) => {
        if (part.startsWith(':')) {
          params[part.slice(1)] = urlParts[index];
        }
      });

      // Extract query parameters
      const urlObj = new URL(url, window.location.origin);
      const queryParams: any = {};
      urlObj.searchParams.forEach((value, key) => {
        try {
          queryParams[key] = JSON.parse(value);
        } catch {
          queryParams[key] = value;
        }
      });

      // Get request body
      let body = null;
      if (init?.body) {
        try {
          body = JSON.parse(init.body as string);
        } catch {
          body = init.body;
        }
      }

      // Call handler
      const result = handler({ ...params, ...queryParams, body });
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  
  // Fall back to original fetch for non-API requests
  return originalFetch(input, init);
};

export { db };
