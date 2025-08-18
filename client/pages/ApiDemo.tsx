import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Zap,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-services";

interface ApiCall {
  id: string;
  method: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  response?: any;
  error?: string;
  timestamp: Date;
}

export default function ApiDemo() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('/dashboard/metrics');
  const [customBody, setCustomBody] = useState('');

  const addApiCall = (method: string, endpoint: string): string => {
    const id = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCall: ApiCall = {
      id,
      method,
      endpoint,
      status: 'pending',
      timestamp: new Date(),
    };
    
    setApiCalls(prev => [newCall, ...prev.slice(0, 9)]); // Keep last 10 calls
    return id;
  };

  const updateApiCall = (id: string, updates: Partial<ApiCall>) => {
    setApiCalls(prev => prev.map(call => 
      call.id === id ? { ...call, ...updates } : call
    ));
  };

  const executeApiCall = async (method: string, endpoint: string, body?: any) => {
    const startTime = Date.now();
    const callId = addApiCall(method, endpoint);

    try {
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.dashboard.getMetrics(); // Example - you'd need to map endpoints
          break;
        case 'POST':
          response = await api.customers.create(body || {});
          break;
        default:
          throw new Error(`Method ${method} not implemented in demo`);
      }

      const duration = Date.now() - startTime;
      
      updateApiCall(callId, {
        status: 'success',
        duration,
        response: response.data,
      });

      toast.success(`API call successful (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateApiCall(callId, {
        status: 'error',
        duration,
        error: errorMessage,
      });

      toast.error(`API call failed: ${errorMessage}`);
    }
  };

  const testApiEndpoints = [
    {
      name: 'Dashboard Metrics',
      method: 'GET',
      endpoint: '/dashboard/metrics',
      description: 'Get dashboard overview metrics',
    },
    {
      name: 'Performance Data',
      method: 'GET', 
      endpoint: '/dashboard/performance',
      description: 'Get performance trends data',
    },
    {
      name: 'Recent Activity',
      method: 'GET',
      endpoint: '/dashboard/recent-activity',
      description: 'Get recent system activity',
    },
    {
      name: 'Customers List',
      method: 'GET',
      endpoint: '/customers',
      description: 'Get paginated customers list',
    },
    {
      name: 'Policies List',
      method: 'GET',
      endpoint: '/policies',
      description: 'Get paginated policies list',
    },
    {
      name: 'Claims List',
      method: 'GET',
      endpoint: '/claims',
      description: 'Get paginated claims list',
    },
    {
      name: 'AI Insights',
      method: 'GET',
      endpoint: '/ai/insights',
      description: 'Get AI-powered business insights',
    },
  ];

  const runQuickTests = async () => {
    setLoading(true);
    
    for (const test of testApiEndpoints.slice(0, 4)) { // Run first 4 tests
      await executeApiCall(test.method, test.endpoint);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between calls
    }
    
    setLoading(false);
    toast.success('Quick API tests completed');
  };

  const clearResults = () => {
    setApiCalls([]);
    toast.info('API call history cleared');
  };

  const getStatusIcon = (status: ApiCall['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: ApiCall['status']) => {
    const configs = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      success: { className: 'bg-green-100 text-green-800', label: 'Success' },
      error: { className: 'bg-red-100 text-red-800', label: 'Error' },
    };
    
    const config = configs[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Demo & Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test and explore the dummy API backend functionality
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={runQuickTests} 
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Quick Tests</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={clearResults}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Test Controls */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Test Endpoints</span>
                  </CardTitle>
                  <CardDescription>
                    Pre-configured API endpoints for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {testApiEndpoints.map((endpoint, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{endpoint.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {endpoint.method} {endpoint.endpoint}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {endpoint.description}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeApiCall(endpoint.method, endpoint.endpoint)}
                        disabled={loading}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom API Call</CardTitle>
                  <CardDescription>
                    Create custom API requests for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="endpoint">Endpoint</Label>
                    <Input
                      id="endpoint"
                      value={customEndpoint}
                      onChange={(e) => setCustomEndpoint(e.target.value)}
                      placeholder="/api/endpoint"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="body">Request Body (JSON)</Label>
                    <Textarea
                      id="body"
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => executeApiCall('GET', customEndpoint)}
                      disabled={loading}
                    >
                      GET
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        try {
                          const body = customBody ? JSON.parse(customBody) : undefined;
                          executeApiCall('POST', customEndpoint, body);
                        } catch {
                          toast.error('Invalid JSON in request body');
                        }
                      }}
                      disabled={loading}
                    >
                      POST
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* API Call Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>API Call Results</span>
              </CardTitle>
              <CardDescription>
                Real-time API call results and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiCalls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API calls made yet. Try running some tests!
                </div>
              ) : (
                <div className="space-y-4">
                  {apiCalls.map((call) => (
                    <div key={call.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(call.status)}
                          <span className="font-medium">
                            {call.method} {call.endpoint}
                          </span>
                          {getStatusBadge(call.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {call.timestamp.toLocaleTimeString()}
                          {call.duration && ` • ${call.duration}ms`}
                        </div>
                      </div>
                      
                      {call.status === 'success' && call.response && (
                        <div>
                          <div className="text-sm font-medium text-green-600 mb-2">Response:</div>
                          <pre className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm overflow-x-auto">
                            {JSON.stringify(call.response, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {call.status === 'error' && call.error && (
                        <div>
                          <div className="text-sm font-medium text-red-600 mb-2">Error:</div>
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm text-red-800 dark:text-red-200">
                            {call.error}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
