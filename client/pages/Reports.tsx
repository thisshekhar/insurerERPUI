import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api-service";

// Color schemes for charts
const CHART_COLORS = {
  primary: ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", "#d084d0"],
  business: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
  financial: ["#059669", "#dc2626", "#d97706", "#7c3aed", "#0891b2", "#be185d"],
};

interface ReportData {
  business?: any;
  financial?: any;
  claims?: any;
  agents?: any;
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData>({});
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState("last-30-days");
  const [refreshing, setRefreshing] = useState(false);

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

  const loadReportData = async () => {
    try {
      const [
        businessResponse,
        financialResponse,
        claimsResponse,
        agentsResponse,
      ] = await Promise.all([
        api.getBusinessReport({ dateRange: selectedDateRange }),
        api.getFinancialReport({ dateRange: selectedDateRange }),
        api.getClaimsReport(),
        api.getAgentsReport(),
      ]);

      setReportData({
        business: businessResponse.success ? businessResponse.data : null,
        financial: financialResponse.success ? financialResponse.data : null,
        claims: claimsResponse.success ? claimsResponse.data : null,
        agents: agentsResponse.success ? agentsResponse.data : null,
      });
    } catch (error) {
      toast.error("Failed to load report data");
      console.error("Report loading error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    toast.success("Reports refreshed successfully");
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting reports as ${format.toUpperCase()}...`);
    // In a real app, this would trigger the actual export
  };

  useEffect(() => {
    loadReportData();
  }, [selectedDateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedDateRange}
            onValueChange={setSelectedDateRange}
          >
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-32">
              <Download className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      {reportData.business && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Policies
                  </p>
                  <p className="text-2xl font-bold">
                    {reportData.business.summary.totalPolicies.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12%</span>
                    <span className="text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Premiums
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(reportData.business.summary.totalPremiums)}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+8.5%</span>
                    <span className="text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Claims Ratio
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(
                      (reportData.business.summary.totalClaimsAmount /
                        reportData.business.summary.totalPremiums) *
                        100,
                    )}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-red-600">-2.1%</span>
                    <span className="text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Retention
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(
                      reportData.business.summary.customerRetention,
                    )}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+1.2%</span>
                    <span className="text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Tabs */}
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="flex items-center space-x-2"
          >
            <DollarSign className="h-4 w-4" />
            <span>Financial</span>
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Claims</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Agents</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Report Tab */}
        <TabsContent value="business" className="space-y-6">
          {reportData.business && (
            <>
              {/* Policy Type Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Policy Type Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of policies by insurance type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.business.policyBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percentage }) =>
                            `${type}: ${percentage.toFixed(1)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {reportData.business.policyBreakdown.map(
                            (entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  CHART_COLORS.primary[
                                    index % CHART_COLORS.primary.length
                                  ]
                                }
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance Trends</CardTitle>
                    <CardDescription>
                      Policy and premium trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.business.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="policies"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="customers"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Agents */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Agents</CardTitle>
                  <CardDescription>
                    Agent performance rankings by policies sold and commission
                    earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.business.topPerformingAgents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="policiesCount"
                        fill="#8884d8"
                        name="Policies Sold"
                      />
                      <Bar
                        dataKey="totalCommission"
                        fill="#82ca9d"
                        name="Commission ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>
                    Portfolio risk distribution and assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {reportData.business.riskAnalysis.lowRisk}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Low Risk Policies
                      </div>
                      <Progress value={65} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {reportData.business.riskAnalysis.mediumRisk}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Medium Risk Policies
                      </div>
                      <Progress value={25} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {reportData.business.riskAnalysis.highRisk}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        High Risk Policies
                      </div>
                      <Progress value={10} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Financial Report Tab */}
        <TabsContent value="financial" className="space-y-6">
          {reportData.financial && (
            <>
              {/* Revenue vs Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>
                    Financial performance overview and cash flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportData.financial.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="inflow"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="outflow"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Gross Profit
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          reportData.financial.profitability.grossProfit,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Net Profit
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          reportData.financial.profitability.netProfit,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Profit Margin
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPercentage(
                          reportData.financial.profitability.profitMargin,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        ROI
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPercentage(
                          reportData.financial.profitability.roi,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Paid Premiums</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(
                          reportData.financial.revenue.paidPremiums,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Premiums</span>
                      <span className="font-semibold text-yellow-600">
                        {formatCurrency(
                          reportData.financial.revenue.pendingPremiums,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Overdue Premiums</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(
                          reportData.financial.revenue.overduePremiums,
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Claims Paid</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(
                          reportData.financial.expenses.paidClaims,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Claims</span>
                      <span className="font-semibold text-yellow-600">
                        {formatCurrency(
                          reportData.financial.expenses.pendingClaims,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Commissions</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(
                          reportData.financial.expenses.commissions,
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Claims Report Tab */}
        <TabsContent value="claims" className="space-y-6">
          {reportData.claims && (
            <>
              {/* Claims Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Claims
                      </p>
                      <p className="text-2xl font-bold">
                        {reportData.claims.summary.totalClaims}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Approval Rate
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPercentage(
                          reportData.claims.summary.approvalRate,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Processing Time
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.claims.summary.avgProcessingTime} days
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending Claims
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {reportData.claims.summary.pendingClaims}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Claims Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Claims by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reportData.claims.claimsByType}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Claims Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.claims.monthlyClaimsTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="claims"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Claim Reasons */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Claim Reasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.claims.topClaimReasons.map(
                      (reason: any, index: number) => (
                        <div
                          key={reason.reason}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{reason.reason}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-muted-foreground">
                              {reason.count} claims
                            </span>
                            <Badge variant="outline">
                              {formatPercentage(reason.percentage)}
                            </Badge>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Agents Report Tab */}
        <TabsContent value="agents" className="space-y-6">
          {reportData.agents && (
            <>
              {/* Agent Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Agents
                      </p>
                      <p className="text-2xl font-bold">
                        {reportData.agents.summary.totalAgents}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Policies Sold
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.agents.summary.totalPoliciesSold}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Commissions
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          reportData.agents.summary.totalCommissions,
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Rating
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {reportData.agents.summary.avgRating.toFixed(1)}★
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Commission Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Commission Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportData.agents.commissionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalCommissions"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.agents.topPerformers
                      .slice(0, 5)
                      .map((agent: any, index: number) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{agent.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {agent.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(agent.totalCommission)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {agent.policiesCount} policies
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
