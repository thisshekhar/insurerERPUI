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

export default function Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your insurance business
          today.
        </p>
      </div>

      {/* KPI Cards */}
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
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Policies sold and premium collected over the last 6 months
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
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>
              Leading agents by policies sold this month
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
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full text-sm font-medium">
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
            <CardTitle>Pending Claims</CardTitle>
            <CardDescription>
              Claims requiring attention and approval
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
    </div>
  );
}
