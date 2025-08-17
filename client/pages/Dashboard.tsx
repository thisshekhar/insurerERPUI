import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Brain,
  Sparkles,
  Zap,
  Target,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AIInsights from "@/components/ai/AIInsights";
import { useAIConfig } from "@/lib/ai-config";

// Mock data
const kpiData = {
  totalPolicies: 1247,
  policiesChange: 12.5,
  premiumCollected: 2840000,
  premiumChange: 8.2,
  pendingClaims: 23,
  claimsChange: -15.3,
  activeAgents: 45,
  agentsChange: 5.1,
};

const recentPolicies = [
  {
    id: "POL-001",
    customer: "Alice Johnson",
    type: "Life Insurance",
    premium: 5400,
    status: "Active",
    agent: "Mike Chen",
  },
  {
    id: "POL-002",
    customer: "Bob Smith",
    type: "Auto Insurance",
    premium: 1200,
    status: "Pending",
    agent: "Sarah Williams",
  },
  {
    id: "POL-003",
    customer: "Carol Davis",
    type: "Health Insurance",
    premium: 3600,
    status: "Active",
    agent: "James Brown",
  },
  {
    id: "POL-004",
    customer: "David Wilson",
    type: "Home Insurance",
    premium: 2400,
    status: "Review",
    agent: "Lisa Anderson",
  },
];

const pendingClaims = [
  {
    id: "CLM-001",
    policy: "POL-001",
    customer: "Alice Johnson",
    amount: 15000,
    type: "Life",
    status: "Processing",
    priority: "High",
  },
  {
    id: "CLM-002",
    policy: "POL-003",
    customer: "Carol Davis",
    amount: 2500,
    type: "Health",
    status: "Review",
    priority: "Medium",
  },
  {
    id: "CLM-003",
    policy: "POL-004",
    customer: "David Wilson",
    amount: 8000,
    type: "Home",
    status: "Approved",
    priority: "Low",
  },
];

const topAgents = [
  {
    name: "Mike Chen",
    policies: 28,
    premium: 156000,
    commission: 7800,
    rating: 4.9,
  },
  {
    name: "Sarah Williams",
    policies: 24,
    premium: 132000,
    commission: 6600,
    rating: 4.8,
  },
  {
    name: "James Brown",
    policies: 21,
    premium: 118000,
    commission: 5900,
    rating: 4.7,
  },
  {
    name: "Lisa Anderson",
    policies: 19,
    premium: 95000,
    commission: 4750,
    rating: 4.6,
  },
];

const monthlyData = [
  { month: "Jan", policies: 89, premium: 234000 },
  { month: "Feb", policies: 95, premium: 267000 },
  { month: "Mar", policies: 103, premium: 298000 },
  { month: "Apr", policies: 112, premium: 334000 },
  { month: "May", policies: 108, premium: 312000 },
  { month: "Jun", policies: 118, premium: 356000 },
];

// AI-powered metrics
const aiMetrics = {
  riskScore: 82,
  fraudDetections: 3,
  churnPredictions: 7,
  revenueOptimization: 15.2,
  customerSatisfactionTrend: 94.5,
};

export default function Dashboard() {
  const { isFeatureEnabled } = useAIConfig();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "processing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with AI Badge */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>AI-Enhanced</span>
          </Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered insights and real-time analytics for your insurance
          business.
        </p>
      </div>

      {/* AI Insights Section */}
      {isFeatureEnabled('insights') && (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Intelligence Center
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live insights powered by machine learning
              </p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            LIVE
          </Badge>
        </div>

        {/* AI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Risk Score
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {aiMetrics.riskScore}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={aiMetrics.riskScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fraud Detected
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {aiMetrics.fraudDetections}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Churn Risk
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {aiMetrics.churnPredictions}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Customers at risk
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Revenue Boost
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    +{aiMetrics.revenueOptimization}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                AI optimization
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Satisfaction
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {aiMetrics.customerSatisfactionTrend}%
                  </p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+2.3% this week</p>
            </CardContent>
          </Card>
        </div>

        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          <Brain className="h-4 w-4 mr-2" />
          Open AI Assistant
        </Button>
          </div>

          {/* AI Insights Component */}
          <AIInsights variant="dashboard" maxItems={3} showHeader={false} />
        </>
      )}

      {/* Traditional KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Policies
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.totalPolicies.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />+
              {kpiData.policiesChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Collected
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(kpiData.premiumCollected)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />+
              {kpiData.premiumChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Claims
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingClaims}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              {kpiData.claimsChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeAgents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />+
              {kpiData.agentsChange}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Monthly Performance</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                AI-Optimized
              </Badge>
            </CardTitle>
            <CardDescription>
              Policies sold and premium collected with AI predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <Progress
                        value={(data.policies / 120) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {data.policies} policies
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(data.premium)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Top Performing Agents</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                AI-Ranked
              </Badge>
            </CardTitle>
            <CardDescription>
              AI-powered performance ranking and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {agent.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {agent.policies} policies
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(agent.commission)} comm.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Policies</CardTitle>
            <CardDescription>
              Latest policy registrations and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{policy.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {policy.type} • {policy.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Agent: {policy.agent}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="font-medium">
                      {formatCurrency(policy.premium)}
                    </div>
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Pending Claims</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                AI-Monitored
              </Badge>
            </CardTitle>
            <CardDescription>
              Claims requiring attention with AI risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{claim.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {claim.type} Insurance • {claim.id}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                      <Badge className={getPriorityColor(claim.priority)}>
                        {claim.priority}
                      </Badge>
                      {claim.priority === "High" && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 text-xs">
                          AI-Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(claim.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Policy: {claim.policy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full AI Insights Panel */}
      {isFeatureEnabled('insights') && <AIInsights />}
    </div>
  );
}
