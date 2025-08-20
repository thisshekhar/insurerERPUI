import { useState, useEffect } from "react";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  Target,
  Eye,
  Settings,
  ChevronDown,
  Activity,
  Brain,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIConfig } from "@/lib/ai-config";
import { api } from "@/lib/api-services";

// Mock data for comprehensive reporting
const reportingData = {
  // Revenue Analytics
  monthlyRevenue: [
    { month: "Jan", revenue: 234000, target: 250000, growth: 12.5 },
    { month: "Feb", revenue: 267000, target: 260000, growth: 14.1 },
    { month: "Mar", revenue: 298000, target: 280000, growth: 11.6 },
    { month: "Apr", revenue: 334000, target: 320000, growth: 12.1 },
    { month: "May", revenue: 312000, target: 340000, growth: -6.6 },
    { month: "Jun", revenue: 356000, target: 350000, growth: 14.1 },
    { month: "Jul", revenue: 378000, target: 360000, growth: 6.2 },
    { month: "Aug", revenue: 402000, target: 380000, growth: 6.3 },
    { month: "Sep", revenue: 425000, target: 400000, growth: 5.7 },
    { month: "Oct", revenue: 448000, target: 420000, growth: 5.4 },
    { month: "Nov", revenue: 467000, target: 450000, growth: 4.2 },
    { month: "Dec", revenue: 495000, target: 480000, growth: 6.0 },
  ],

  // Policy Analytics
  policyByType: [
    { type: "Auto Insurance", count: 425, percentage: 34.1, revenue: 1275000 },
    { type: "Health Insurance", count: 312, percentage: 25.0, revenue: 1872000 },
    { type: "Life Insurance", count: 198, percentage: 15.9, revenue: 1584000 },
    { type: "Home Insurance", count: 156, percentage: 12.5, revenue: 936000 },
    { type: "Business Insurance", count: 89, percentage: 7.1, revenue: 801000 },
    { type: "Travel Insurance", count: 67, percentage: 5.4, revenue: 201000 },
  ],

  // Agent Performance
  agentPerformance: [
    {
      name: "Mike Chen",
      policies: 89,
      revenue: 267000,
      commission: 13350,
      rating: 4.9,
      trend: 15.2,
      region: "North",
    },
    {
      name: "Sarah Williams",
      policies: 76,
      revenue: 228000,
      commission: 11400,
      rating: 4.8,
      trend: 12.1,
      region: "South",
    },
    {
      name: "James Brown",
      policies: 72,
      revenue: 216000,
      commission: 10800,
      rating: 4.7,
      trend: 8.9,
      region: "East",
    },
    {
      name: "Lisa Anderson",
      policies: 68,
      revenue: 204000,
      commission: 10200,
      rating: 4.6,
      trend: 6.3,
      region: "West",
    },
    {
      name: "David Kim",
      policies: 64,
      revenue: 192000,
      commission: 9600,
      rating: 4.5,
      trend: 4.1,
      region: "Central",
    },
  ],

  // Claims Analytics
  claimsData: {
    totalClaims: 342,
    approvedClaims: 298,
    pendingClaims: 23,
    rejectedClaims: 21,
    averageProcessingTime: 8.5,
    satisfactionScore: 4.3,
    byType: [
      { type: "Auto", claims: 142, approved: 125, avgAmount: 8500 },
      { type: "Health", claims: 89, approved: 81, avgAmount: 3200 },
      { type: "Life", claims: 45, approved: 42, avgAmount: 25000 },
      { type: "Home", claims: 38, approved: 32, avgAmount: 12000 },
      { type: "Business", claims: 28, approved: 18, avgAmount: 45000 },
    ],
  },

  // Financial Metrics
  financialMetrics: {
    totalPremium: 5669000,
    totalClaims: 2856000,
    profit: 2813000,
    profitMargin: 49.6,
    lossRatio: 50.4,
    expenseRatio: 24.8,
    combinedRatio: 75.2,
    reserves: 8450000,
  },

  // Customer Analytics
  customerMetrics: {
    totalCustomers: 1247,
    newCustomers: 156,
    retentionRate: 94.2,
    churnRate: 5.8,
    lifetimeValue: 12450,
    satisfactionScore: 4.6,
    byAgeGroup: [
      { group: "18-25", count: 89, percentage: 7.1 },
      { group: "26-35", count: 312, percentage: 25.0 },
      { group: "36-45", count: 398, percentage: 31.9 },
      { group: "46-55", count: 267, percentage: 21.4 },
      { group: "56-65", count: 134, percentage: 10.7 },
      { group: "65+", count: 47, percentage: 3.8 },
    ],
  },

  // AI-Enhanced Insights
  aiInsights: {
    riskScore: 82,
    fraudDetections: 15,
    revenueOptimization: 18.5,
    customerChurnPredictions: 23,
    crossSellOpportunities: 156,
    pricingOptimization: 12.3,
  },
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [loading, setLoading] = useState(false);
  const { isFeatureEnabled } = useAIConfig();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getHealthColor = (value: number, threshold: number = 80) => {
    if (value >= threshold) return "text-green-600";
    if (value >= threshold * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const refreshReports = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: "pdf" | "excel" | "csv") => {
    // Simulate export functionality
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            {isFeatureEnabled("insights") && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>AI-Powered</span>
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive business intelligence and performance analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Region Filter */}
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[120px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="central">Central</SelectItem>
            </SelectContent>
          </Select>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshReports}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportReport("pdf")}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReport("excel")}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      {isFeatureEnabled("insights") && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Analytics Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Machine learning insights for strategic decision making
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                LIVE
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reportingData.aiInsights.riskScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  Portfolio Risk Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reportingData.aiInsights.fraudDetections}
                </div>
                <div className="text-xs text-muted-foreground">
                  Fraud Detected
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  +{formatPercentage(reportingData.aiInsights.revenueOptimization)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Revenue Optimization
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {reportingData.aiInsights.customerChurnPredictions}
                </div>
                <div className="text-xs text-muted-foreground">Churn Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reportingData.aiInsights.crossSellOpportunities}
                </div>
                <div className="text-xs text-muted-foreground">
                  Cross-sell Opportunities
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  +{formatPercentage(reportingData.aiInsights.pricingOptimization)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Pricing Optimization
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportingData.financialMetrics.totalPremium)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12.3% from last period
            </div>
            <Progress value={78} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(reportingData.financialMetrics.profitMargin)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +2.1% improvement
            </div>
            <Progress value={reportingData.financialMetrics.profitMargin} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Retention
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(reportingData.customerMetrics.retentionRate)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Industry leading
            </div>
            <Progress value={reportingData.customerMetrics.retentionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Ratio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(reportingData.financialMetrics.lossRatio)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              -1.8% reduction
            </div>
            <Progress value={100 - reportingData.financialMetrics.lossRatio} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5" />
                  <span>Monthly Revenue Trend</span>
                </CardTitle>
                <CardDescription>
                  Revenue performance vs targets with growth indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.monthlyRevenue.slice(-6).map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {formatCurrency(data.revenue)}
                          </span>
                          <Badge
                            className={
                              data.growth > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }
                          >
                            {data.growth > 0 ? "+" : ""}
                            {formatPercentage(data.growth)}
                          </Badge>
                        </div>
                      </div>
                      <div className="relative">
                        <Progress
                          value={(data.revenue / data.target) * 100}
                          className="h-3"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          Target: {formatCurrency(data.target)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Financial Health Metrics</span>
                </CardTitle>
                <CardDescription>
                  Key financial ratios and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportingData.financialMetrics.profit)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Net Profit
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(
                          reportingData.financialMetrics.combinedRatio,
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Combined Ratio
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Loss Ratio</span>
                        <span
                          className={`text-sm font-medium ${getHealthColor(
                            100 - reportingData.financialMetrics.lossRatio,
                          )}`}
                        >
                          {formatPercentage(
                            reportingData.financialMetrics.lossRatio,
                          )}
                        </span>
                      </div>
                      <Progress
                        value={reportingData.financialMetrics.lossRatio}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Expense Ratio</span>
                        <span
                          className={`text-sm font-medium ${getHealthColor(
                            100 - reportingData.financialMetrics.expenseRatio,
                          )}`}
                        >
                          {formatPercentage(
                            reportingData.financialMetrics.expenseRatio,
                          )}
                        </span>
                      </div>
                      <Progress
                        value={reportingData.financialMetrics.expenseRatio}
                        className="h-2"
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Reserves Available
                        </span>
                        <span className="text-lg font-bold">
                          {formatCurrency(
                            reportingData.financialMetrics.reserves,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policy Analytics */}
        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Policy Distribution</span>
                </CardTitle>
                <CardDescription>
                  Breakdown by insurance type and revenue contribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.policyByType.map((policy, index) => (
                    <div key={policy.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {policy.type}
                        </span>
                        <div className="text-right">
                          <div className="text-sm">
                            {policy.count} policies
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(policy.revenue)}
                          </div>
                        </div>
                      </div>
                      <Progress value={policy.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(policy.percentage)} of portfolio
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for policy management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportingData.policyByType.reduce(
                        (sum, p) => sum + p.count,
                        0,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Policies
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        reportingData.policyByType.reduce(
                          (sum, p) => sum + p.revenue,
                          0,
                        ),
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Revenue
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Average Policy Value</span>
                    <span className="font-medium">
                      {formatCurrency(
                        reportingData.policyByType.reduce(
                          (sum, p) => sum + p.revenue,
                          0,
                        ) /
                          reportingData.policyByType.reduce(
                            (sum, p) => sum + p.count,
                            0,
                          ),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Policy Retention Rate</span>
                    <span className="font-medium text-green-600">96.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">New Policies (This Month)</span>
                    <span className="font-medium">+156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agent Performance */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Agent Performance Leaderboard</span>
                {isFeatureEnabled("insights") && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                    AI-Ranked
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Top performing agents with detailed metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportingData.agentPerformance.map((agent, index) => (
                  <div
                    key={agent.name}
                    className="p-4 border rounded-lg dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full text-lg font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-lg">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {agent.region} Region • Rating: {agent.rating}⭐
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          agent.trend > 10
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : agent.trend > 5
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }
                      >
                        {agent.trend > 0 ? "+" : ""}
                        {formatPercentage(agent.trend)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {agent.policies}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Policies Sold
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(agent.revenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Revenue Generated
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {formatCurrency(agent.commission)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Commission Earned
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Analytics */}
        <TabsContent value="claims" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Claims Overview</span>
                </CardTitle>
                <CardDescription>
                  Claims processing metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportingData.claimsData.totalClaims}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Claims
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(
                        (reportingData.claimsData.approvedClaims /
                          reportingData.claimsData.totalClaims) *
                          100,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Approval Rate
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Time (Avg)</span>
                    <span className="font-medium">
                      {reportingData.claimsData.averageProcessingTime} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">
                      {reportingData.claimsData.satisfactionScore}/5.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Claims</span>
                    <span className="font-medium text-orange-600">
                      {reportingData.claimsData.pendingClaims}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims by Insurance Type</CardTitle>
                <CardDescription>
                  Breakdown of claims by policy type and approval rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.claimsData.byType.map((claim) => (
                    <div key={claim.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {claim.type} Insurance
                        </span>
                        <div className="text-right">
                          <div className="text-sm">{claim.claims} claims</div>
                          <div className="text-xs text-muted-foreground">
                            Avg: {formatCurrency(claim.avgAmount)}
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={(claim.approved / claim.claims) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {formatPercentage(
                            (claim.approved / claim.claims) * 100,
                          )}{" "}
                          approved
                        </span>
                        <span>{claim.approved}/{claim.claims}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Customer Demographics</span>
                </CardTitle>
                <CardDescription>
                  Age distribution and customer lifecycle metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.customerMetrics.byAgeGroup.map((group) => (
                    <div key={group.group} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {group.group} years
                        </span>
                        <div className="text-right">
                          <div className="text-sm">{group.count} customers</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercentage(group.percentage)}
                          </div>
                        </div>
                      </div>
                      <Progress value={group.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>
                  Key customer relationship and value indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportingData.customerMetrics.totalCustomers.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Customers
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      +{reportingData.customerMetrics.newCustomers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      New This Month
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Retention Rate</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(
                        reportingData.customerMetrics.retentionRate,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Churn Rate</span>
                    <span className="font-medium text-red-600">
                      {formatPercentage(reportingData.customerMetrics.churnRate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Lifetime Value (Avg)</span>
                    <span className="font-medium">
                      {formatCurrency(
                        reportingData.customerMetrics.lifetimeValue,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Satisfaction Score</span>
                    <span className="font-medium">
                      {reportingData.customerMetrics.satisfactionScore}/5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
