// Dummy Web API Backend
import { mockCustomers, mockClaims } from './mock-data';
import { mockPolicies, Policy } from './policy-data';
import { mockAgents } from './agent-data';
import { mockPayments } from './payment-data';

// API Response structure
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

// Pagination structure
interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// In-memory database simulation
class MockDatabase {
  private data = {
    customers: [...mockCustomers],
    policies: [...mockPolicies],
    claims: [...mockClaims],
    agents: [...mockAgents],
    payments: [...mockPayments],
    settings: {
      ai: {
        enabled: true,
        features: {
          insights: true,
          assistant: true,
          predictions: true,
          riskAssessment: true,
          fraudDetection: true,
          navigation: true,
          branding: true,
        }
      }
    }
  };

  // Generic CRUD operations
  findAll<T>(collection: keyof typeof this.data): T[] {
    return [...(this.data[collection] as T[])];
  }

  findById<T>(collection: keyof typeof this.data, id: string): T | null {
    const items = this.data[collection] as any[];
    return items.find(item => item.id === id) || null;
  }

  create<T>(collection: keyof typeof this.data, item: T): T {
    const items = this.data[collection] as any[];
    const newItem = {
      ...item,
      id: this.generateId(collection),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    return newItem;
  }

  update<T>(collection: keyof typeof this.data, id: string, updates: Partial<T>): T | null {
    const items = this.data[collection] as any[];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return items[index];
  }

  delete(collection: keyof typeof this.data, id: string): boolean {
    const items = this.data[collection] as any[];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    items.splice(index, 1);
    return true;
  }

  // Search and filter
  search<T>(collection: keyof typeof this.data, query: string, fields: string[]): T[] {
    const items = this.data[collection] as any[];
    if (!query) return items;

    return items.filter(item =>
      fields.some(field =>
        item[field]?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  filter<T>(collection: keyof typeof this.data, filters: Record<string, any>): T[] {
    const items = this.data[collection] as any[];
    
    return items.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        return item[key] === value;
      })
    );
  }

  // Pagination
  paginate<T>(items: T[], page: number = 1, pageSize: number = 10): PaginatedData<T> {
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
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  // Generate ID for new items
  private generateId(collection: keyof typeof this.data): string {
    const items = this.data[collection] as any[];
    const prefixes: Record<string, string> = {
      customers: 'CUST',
      policies: 'POL',
      claims: 'CLM',
      agents: 'AGT',
      payments: 'PAY',
    };
    
    const prefix = prefixes[collection as string] || 'GEN';
    const nextNumber = items.length + 1;
    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
  }

  // Analytics methods
  getDashboardMetrics() {
    return {
      totalPolicies: this.data.policies.length,
      activePolicies: this.data.policies.filter(p => p.status === 'Active').length,
      totalCustomers: this.data.customers.length,
      totalClaims: this.data.claims.length,
      pendingClaims: this.data.claims.filter(c => c.status === 'Pending').length,
      totalPremiums: this.data.policies.reduce((sum, p) => sum + p.premiumAmount, 0),
      totalCoverage: this.data.policies.reduce((sum, p) => sum + p.coverageAmount, 0),
      claimsAmount: this.data.claims.reduce((sum, c) => sum + c.amount, 0),
      monthlyGrowth: 8.5,
      customerSatisfaction: 94.2,
    };
  }

  getPerformanceData() {
    return Array.from({ length: 6 }, (_, i) => {
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
  }

  getRecentActivity() {
    return {
      recentPolicies: this.data.policies.slice(-5),
      recentClaims: this.data.claims.slice(-5),
      notifications: [
        { id: 1, type: 'policy', message: 'New policy created', timestamp: new Date().toISOString() },
        { id: 2, type: 'claim', message: 'Claim pending review', timestamp: new Date().toISOString() },
        { id: 3, type: 'payment', message: 'Payment received', timestamp: new Date().toISOString() },
      ]
    };
  }
}

// Create database instance
const db = new MockDatabase();

// API response helper
const createResponse = <T>(data: T, success = true, message?: string): APIResponse<T> => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
});

const createErrorResponse = (error: string, code = 400): APIResponse => ({
  success: false,
  error,
  timestamp: new Date().toISOString(),
  requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
});

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Routes Definition
export const apiRoutes = {
  // Health check
  'GET /api/health': async () => {
    await delay(100);
    return createResponse({ status: 'ok', timestamp: new Date().toISOString() });
  },

  // Dashboard endpoints
  'GET /api/dashboard/metrics': async () => {
    await delay(300);
    return createResponse(db.getDashboardMetrics());
  },

  'GET /api/dashboard/performance': async () => {
    await delay(200);
    return createResponse(db.getPerformanceData());
  },

  'GET /api/dashboard/recent-activity': async () => {
    await delay(250);
    return createResponse(db.getRecentActivity());
  },

  // Customer endpoints
  'GET /api/customers': async (params: any) => {
    await delay(400);
    const { page = 1, pageSize = 10, search, status } = params;
    
    let customers = db.findAll('customers');
    
    if (search) {
      customers = db.search('customers', search, ['firstName', 'lastName', 'email', 'phone']);
    }
    
    if (status) {
      customers = customers.filter(c => c.status === status);
    }

    const paginatedData = db.paginate(customers, parseInt(page), parseInt(pageSize));
    return createResponse(paginatedData);
  },

  'GET /api/customers/:id': async (params: any) => {
    await delay(200);
    const customer = db.findById('customers', params.id);
    
    if (!customer) {
      return createErrorResponse('Customer not found', 404);
    }
    
    return createResponse(customer);
  },

  'POST /api/customers': async (params: any) => {
    await delay(500);
    const { body } = params;
    
    if (!body.firstName || !body.lastName || !body.email) {
      return createErrorResponse('Missing required fields: firstName, lastName, email');
    }
    
    const newCustomer = db.create('customers', body);
    return createResponse(newCustomer, true, 'Customer created successfully');
  },

  'PUT /api/customers/:id': async (params: any) => {
    await delay(400);
    const { id, body } = params;
    
    const updatedCustomer = db.update('customers', id, body);
    
    if (!updatedCustomer) {
      return createErrorResponse('Customer not found', 404);
    }
    
    return createResponse(updatedCustomer, true, 'Customer updated successfully');
  },

  'DELETE /api/customers/:id': async (params: any) => {
    await delay(300);
    const success = db.delete('customers', params.id);
    
    if (!success) {
      return createErrorResponse('Customer not found', 404);
    }
    
    return createResponse(null, true, 'Customer deleted successfully');
  },

  // Policy endpoints
  'GET /api/policies': async (params: any) => {
    await delay(400);
    const { page = 1, pageSize = 10, search, status, policyType } = params;
    
    let policies = db.findAll('policies');
    
    if (search) {
      policies = db.search('policies', search, ['policyNumber', 'customerName', 'policyType']);
    }
    
    const filters: any = {};
    if (status) filters.status = status;
    if (policyType) filters.policyType = policyType;
    
    if (Object.keys(filters).length > 0) {
      policies = db.filter('policies', filters);
    }

    const paginatedData = db.paginate(policies, parseInt(page), parseInt(pageSize));
    return createResponse(paginatedData);
  },

  'POST /api/policies': async (params: any) => {
    await delay(600);
    const { body } = params;
    
    if (!body.customerName || !body.policyType || !body.premiumAmount) {
      return createErrorResponse('Missing required fields: customerName, policyType, premiumAmount');
    }
    
    const newPolicy = db.create('policies', {
      ...body,
      policyNumber: `POL-${new Date().getFullYear()}-${String(db.findAll('policies').length + 1).padStart(4, '0')}`,
      status: 'Pending',
      issueDate: new Date().toISOString().split('T')[0],
    });
    
    return createResponse(newPolicy, true, 'Policy created successfully');
  },

  // Claims endpoints
  'GET /api/claims': async (params: any) => {
    await delay(350);
    const { page = 1, pageSize = 10, search, status } = params;
    
    let claims = db.findAll('claims');
    
    if (search) {
      claims = db.search('claims', search, ['claimNumber', 'customerName', 'description']);
    }
    
    if (status) {
      claims = db.filter('claims', { status });
    }

    const paginatedData = db.paginate(claims, parseInt(page), parseInt(pageSize));
    return createResponse(paginatedData);
  },

  'POST /api/claims': async (params: any) => {
    await delay(500);
    const { body } = params;
    
    if (!body.customerName || !body.policyId || !body.amount) {
      return createErrorResponse('Missing required fields: customerName, policyId, amount');
    }
    
    const newClaim = db.create('claims', {
      ...body,
      claimNumber: `CLM-${new Date().getFullYear()}-${String(db.findAll('claims').length + 1).padStart(4, '0')}`,
      status: 'Pending',
      dateReported: new Date().toISOString().split('T')[0],
    });
    
    return createResponse(newClaim, true, 'Claim created successfully');
  },

  // Agent endpoints
  'GET /api/agents': async (params: any) => {
    await delay(300);
    const { page = 1, pageSize = 10, search } = params;
    
    let agents = db.findAll('agents');
    
    if (search) {
      agents = db.search('agents', search, ['name', 'email', 'phone']);
    }

    const paginatedData = db.paginate(agents, parseInt(page), parseInt(pageSize));
    return createResponse(paginatedData);
  },

  // Payment endpoints
  'GET /api/payments': async (params: any) => {
    await delay(300);
    const { page = 1, pageSize = 10, status } = params;
    
    let payments = db.findAll('payments');
    
    if (status) {
      payments = db.filter('payments', { status });
    }

    const paginatedData = db.paginate(payments, parseInt(page), parseInt(pageSize));
    return createResponse(paginatedData);
  },

  'POST /api/payments/process': async (params: any) => {
    await delay(1000); // Simulate payment processing time
    const { body } = params;
    
    if (!body.amount || !body.policyId) {
      return createErrorResponse('Missing required fields: amount, policyId');
    }
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (!success) {
      return createErrorResponse('Payment processing failed. Please try again.');
    }
    
    const payment = db.create('payments', {
      ...body,
      status: 'Paid',
      transactionId: `TXN-${Date.now()}`,
      paidDate: new Date().toISOString().split('T')[0],
    });
    
    return createResponse(payment, true, 'Payment processed successfully');
  },

  // Settings endpoints
  'GET /api/settings': async () => {
    await delay(200);
    return createResponse(db.findAll('settings')[0] || {});
  },

  'PUT /api/settings': async (params: any) => {
    await delay(300);
    const { body } = params;
    
    // For simplicity, we'll just return the updated settings
    return createResponse(body, true, 'Settings updated successfully');
  },

  // AI endpoints
  'GET /api/ai/insights': async () => {
    await delay(800); // AI processing takes longer
    return createResponse({
      riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
      fraudAlerts: Math.floor(Math.random() * 5),
      predictions: [
        { type: 'Churn Risk', value: Math.random() > 0.5 ? 'Low' : 'Medium', confidence: Math.floor(Math.random() * 40) + 60 },
        { type: 'Revenue Growth', value: `+${(Math.random() * 20 + 5).toFixed(1)}%`, confidence: Math.floor(Math.random() * 30) + 70 },
        { type: 'Claims Spike', value: Math.random() > 0.7 ? 'High' : 'Moderate', confidence: Math.floor(Math.random() * 50) + 50 },
      ],
      recommendations: [
        'Review high-risk policies for premium adjustment',
        'Focus on customer retention in the 45-65 age group',
        'Increase fraud monitoring for auto insurance claims',
        'Consider expanding health insurance offerings',
      ].slice(0, Math.floor(Math.random() * 3) + 2),
    });
  },

  // File upload endpoint
  'POST /api/documents/upload': async (params: any) => {
    await delay(1500); // File upload takes time
    const { file } = params;
    
    if (!file) {
      return createErrorResponse('No file provided');
    }
    
    // Simulate file processing
    const document = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      url: `/documents/${file.name}`,
    };
    
    return createResponse(document, true, 'File uploaded successfully');
  },
};

// Request interceptor to handle API routing
export function setupDummyAPI() {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';
    
    // Check if this is an API request
    if (url.startsWith('/api') || url.includes('/api/')) {
      console.log(`[Dummy API] Intercepting ${method} ${url}`);
      console.log(`[Dummy API] Available routes:`, Object.keys(apiRoutes));
      
      // Extract the route pattern - handle both full URLs and paths
      let urlPath = url.split('?')[0];
      if (urlPath.includes('://')) {
        // If it's a full URL, extract just the pathname
        const urlObj = new URL(url);
        urlPath = urlObj.pathname;
      }
      const routeKey = `${method} ${urlPath}`;
      
      // Find matching route handler
      let handler = apiRoutes[routeKey as keyof typeof apiRoutes];
      console.log(`[Dummy API] Looking for route: ${routeKey}, found: ${!!handler}`);

      // Handle parameterized routes
      if (!handler) {
        for (const [pattern, routeHandler] of Object.entries(apiRoutes)) {
          const [patternMethod, patternPath] = pattern.split(' ');
          const [, urlPath] = url.split('?');
          
          if (patternMethod === method && isRouteMatch(patternPath, urlPath || url)) {
            handler = routeHandler;
            break;
          }
        }
      }
      
      if (handler) {
        try {
          // Extract parameters and query string
          const urlObj = new URL(url, window.location.origin);
          const params: any = {};
          
          // Parse query parameters
          urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
          });
          
          // Parse path parameters
          const pathParams = extractPathParams(url);
          Object.assign(params, pathParams);
          
          // Parse request body
          if (init?.body && typeof init.body === 'string') {
            try {
              params.body = JSON.parse(init.body);
            } catch {
              params.body = init.body;
            }
          }
          
          // Call the handler
          const result = await handler(params);
          
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            statusText: result.success ? 'OK' : 'Bad Request',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
          
        } catch (error) {
          console.error('[Dummy API] Handler error:', error);
          
          const errorResponse = createErrorResponse(
            error instanceof Error ? error.message : 'Internal server error'
          );
          
          return new Response(JSON.stringify(errorResponse), {
            status: 500,
            statusText: 'Internal Server Error',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }
    }
    
    // Fall back to original fetch for non-API requests
    return originalFetch(input, init);
  };
  
  console.log('[Dummy API] Setup completed - API routes are now intercepted');
}

// Helper functions
function isRouteMatch(pattern: string, url: string): boolean {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');
  
  if (patternParts.length !== urlParts.length) return false;
  
  return patternParts.every((part, index) => {
    return part.startsWith(':') || part === urlParts[index];
  });
}

function extractPathParams(url: string): Record<string, string> {
  // Simple implementation - in a real app you'd use a proper router
  const pathParams: Record<string, string> = {};
  
  // Extract ID from common patterns like /api/customers/123
  const idMatch = url.match(/\/([^\/]+)\/([^\/\?]+)$/);
  if (idMatch) {
    pathParams.id = idMatch[2];
  }
  
  return pathParams;
}

// Initialize the dummy API
export function initializeDummyAPI() {
  setupDummyAPI();
  
  // Optionally add some startup data or notifications
  console.log('[Dummy API] Initialized with mock data:', {
    customers: db.findAll('customers').length,
    policies: db.findAll('policies').length,
    claims: db.findAll('claims').length,
    agents: db.findAll('agents').length,
  });
}

export default { setupDummyAPI, initializeDummyAPI };
