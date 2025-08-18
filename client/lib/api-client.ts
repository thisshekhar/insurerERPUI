// Centralized API Client Service
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Request/Response interceptors
type RequestInterceptor = (config: ApiRequestConfig & { url: string }) => ApiRequestConfig & { url: string };
type ResponseInterceptor = (response: ApiResponse) => ApiResponse;
type ErrorInterceptor = (error: any) => Promise<ApiResponse>;

// API Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Add interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // Build URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  // Generate request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Apply request interceptors
  private applyRequestInterceptors(config: ApiRequestConfig & { url: string }): ApiRequestConfig & { url: string } {
    return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), config);
  }

  // Apply response interceptors
  private applyResponseInterceptors(response: ApiResponse): ApiResponse {
    return this.responseInterceptors.reduce((acc, interceptor) => interceptor(acc), response);
  }

  // Apply error interceptors
  private async applyErrorInterceptors(error: any): Promise<ApiResponse> {
    for (const interceptor of this.errorInterceptors) {
      try {
        return await interceptor(error);
      } catch (e) {
        continue;
      }
    }
    throw error;
  }

  // Main request method
  async request<T = any>(
    endpoint: string, 
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      timeout = 10000,
      retries = 1
    } = config;

    const requestId = this.generateRequestId();
    const url = this.buildUrl(endpoint, params);

    // Apply request interceptors
    const interceptedConfig = this.applyRequestInterceptors({
      ...config,
      url,
      method,
      headers: { ...this.defaultHeaders, ...headers }
    });

    console.log(`[API] ${method} ${endpoint}`, {
      requestId,
      params,
      config: interceptedConfig,
      finalUrl: interceptedConfig.url
    });

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchConfig: RequestInit = {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
          signal: controller.signal,
        };

        // Add body for POST/PUT/PATCH requests
        if (['POST', 'PUT', 'PATCH'].includes(method) && config.body) {
          fetchConfig.body = JSON.stringify(config.body);
        }

        const response = await fetch(interceptedConfig.url, fetchConfig);
        clearTimeout(timeoutId);

        console.log(`[API] Response status: ${response.status} ${response.statusText}`);
        console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()));

        let responseData: any;

        try {
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
          } else {
            responseData = await response.text();
          }
        } catch (streamError) {
          // If there's an error reading the stream, provide a default response
          console.warn('Stream read error, providing default response:', streamError);
          responseData = {
            success: false,
            error: 'Response parsing failed',
            message: `Failed to parse ${response.headers.get('content-type')} response`
          };
        }

        const apiResponse: ApiResponse<T> = {
          success: response.ok,
          data: responseData?.data || responseData,
          error: !response.ok ? (responseData?.error || `HTTP ${response.status}`) : undefined,
          message: responseData?.message,
          timestamp: new Date().toISOString(),
          requestId,
        };

        if (!response.ok) {
          // Create a new error object instead of throwing the response
          const error = new Error(apiResponse.error || `HTTP ${response.status}`);
          (error as any).apiResponse = apiResponse;
          throw error;
        }

        // Apply response interceptors
        const interceptedResponse = this.applyResponseInterceptors(apiResponse);
        
        console.log(`[API] ${method} ${endpoint} - Success`, interceptedResponse);
        return interceptedResponse;

      } catch (error) {
        console.error(`[API] ${method} ${endpoint} - Error (attempt ${attempt + 1})`, error);

        if (attempt === retries) {
          try {
            return await this.applyErrorInterceptors(error);
          } catch (finalError) {
            // Check if we have an API response attached to the error
            const apiResponse = (error as any)?.apiResponse;
            if (apiResponse) {
              return apiResponse;
            }

            const errorResponse: ApiResponse<T> = {
              success: false,
              error: error instanceof Error ? error.message : 'Network error',
              timestamp: new Date().toISOString(),
              requestId,
            };
            return errorResponse;
          }
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    // This should never be reached, but TypeScript requires it
    throw new Error('Unexpected error in API request');
  }

  // Convenience methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Upload file method
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const requestId = this.generateRequestId();
    const url = this.buildUrl(endpoint);

    console.log(`[API] POST ${endpoint} - File Upload`, { requestId, fileName: file.name });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser handle it
          'Accept': 'application/json',
        },
      });

      const responseData = await response.json();

      const apiResponse: ApiResponse<T> = {
        success: response.ok,
        data: responseData.data || responseData,
        error: !response.ok ? (responseData.error || `HTTP ${response.status}`) : undefined,
        message: responseData.message,
        timestamp: new Date().toISOString(),
        requestId,
      };

      if (!response.ok) {
        throw apiResponse;
      }

      console.log(`[API] POST ${endpoint} - Upload Success`, apiResponse);
      return apiResponse;

    } catch (error) {
      console.error(`[API] POST ${endpoint} - Upload Error`, error);
      
      const errorResponse: ApiResponse<T> = {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        timestamp: new Date().toISOString(),
        requestId,
      };
      
      return errorResponse;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health');
  }

  // Set auth token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove auth token
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Set custom header
  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  // Remove custom header
  removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Add default interceptors
apiClient.addRequestInterceptor((config) => {
  // Add timestamp to all requests
  config.headers = {
    ...config.headers,
    'X-Request-Time': new Date().toISOString(),
  };
  return config;
});

apiClient.addResponseInterceptor((response) => {
  // Log response times
  const requestTime = response.timestamp;
  console.log(`[API] Response processed at ${requestTime}`);
  return response;
});

apiClient.addErrorInterceptor(async (error) => {
  // Handle common errors
  if (error?.error === 'Unauthorized' || error?.error?.includes('401')) {
    // Could trigger logout here
    console.warn('[API] Unauthorized access detected');
  }
  
  if (error?.error === 'Network error' || error?.error?.includes('fetch')) {
    console.warn('[API] Network connectivity issues detected');
  }
  
  throw error; // Re-throw to maintain error flow
});

export default apiClient;
