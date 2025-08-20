// Reporting data utilities and mock data for comprehensive analytics

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  growth: number;
  policies: number;
}

export interface PolicyTypeData {
  type: string;
  count: number;
  percentage: number;
  revenue: number;
  averagePremium: number;
  growthRate: number;
}

export interface AgentPerformanceData {
  id: string;
  name: string;
  region: string;
  policies: number;
  revenue: number;
  commission: number;
  rating: number;
  trend: number;
  conversionRate: number;
  customerSatisfaction: number;
}

export interface ClaimsData {
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  averageProcessingTime: number;
  satisfactionScore: number;
  totalPayout: number;
  byType: ClaimsByType[];
}

export interface ClaimsByType {
  type: string;
  claims: number;
  approved: number;
  avgAmount: number;
  processingTime: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  retentionRate: number;
  churnRate: number;
  lifetimeValue: number;
  satisfactionScore: number;
  acquisitionCost: number;
  byAgeGroup: CustomerAgeGroup[];
  byRegion: CustomerByRegion[];
}

export interface CustomerAgeGroup {
  group: string;
  count: number;
  percentage: number;
  averagePremium: number;
  retentionRate: number;
}

export interface CustomerByRegion {
  region: string;
  customers: number;
  revenue: number;
  growth: number;
}

export interface FinancialMetrics {
  totalPremium: number;
  totalClaims: number;
  profit: number;
  profitMargin: number;
  lossRatio: number;
  expenseRatio: number;
  combinedRatio: number;
  reserves: number;
  investmentIncome: number;
  operatingExpenses: number;
}

export interface AIInsights {
  riskScore: number;
  fraudDetections: number;
  revenueOptimization: number;
  customerChurnPredictions: number;
  crossSellOpportunities: number;
  pricingOptimization: number;
  marketTrends: AIMarketTrend[];
  predictiveAnalytics: PredictiveMetric[];
}

export interface AIMarketTrend {
  category: string;
  trend: "up" | "down" | "stable";
  confidence: number;
  impact: string;
  recommendation: string;
}

export interface PredictiveMetric {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
}

// Mock data generation functions
export const generateRevenueData = (months: number = 12): RevenueData[] => {
  const baseRevenue = 200000;
  const data: RevenueData[] = [];

  for (let i = 0; i < months; i++) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const seasonalMultiplier = 1 + 0.2 * Math.sin((i / 12) * 2 * Math.PI);
    const randomVariation = 0.8 + Math.random() * 0.4;
    const revenue = Math.round(
      baseRevenue * seasonalMultiplier * randomVariation,
    );
    const target = Math.round(revenue * (0.9 + Math.random() * 0.2));
    const prevRevenue = i > 0 ? data[i - 1].revenue : revenue * 0.9;
    const growth = ((revenue - prevRevenue) / prevRevenue) * 100;

    data.push({
      month: monthNames[i % 12],
      revenue,
      target,
      growth: Math.round(growth * 10) / 10,
      policies: Math.round(revenue / 2500), // Assuming avg policy value of $2500
    });
  }

  return data;
};

export const generatePolicyTypeData = (): PolicyTypeData[] => {
  const types = [
    { type: "Auto Insurance", baseCount: 400 },
    { type: "Health Insurance", baseCount: 300 },
    { type: "Life Insurance", baseCount: 200 },
    { type: "Home Insurance", baseCount: 150 },
    { type: "Business Insurance", baseCount: 90 },
    { type: "Travel Insurance", baseCount: 60 },
  ];

  const totalPolicies = types.reduce((sum, t) => sum + t.baseCount, 0);

  return types.map((type) => {
    const count = Math.round(type.baseCount * (0.8 + Math.random() * 0.4));
    const percentage = (count / totalPolicies) * 100;
    const averagePremium = 1500 + Math.random() * 3000;
    const revenue = count * averagePremium;
    const growthRate = -10 + Math.random() * 25;

    return {
      type: type.type,
      count,
      percentage: Math.round(percentage * 10) / 10,
      revenue: Math.round(revenue),
      averagePremium: Math.round(averagePremium),
      growthRate: Math.round(growthRate * 10) / 10,
    };
  });
};

export const generateAgentPerformanceData = (
  count: number = 10,
): AgentPerformanceData[] => {
  const firstNames = [
    "Mike",
    "Sarah",
    "James",
    "Lisa",
    "David",
    "Emma",
    "Chris",
    "Amy",
    "Robert",
    "Jennifer",
  ];
  const lastNames = [
    "Chen",
    "Williams",
    "Brown",
    "Anderson",
    "Kim",
    "Davis",
    "Johnson",
    "Wilson",
    "Garcia",
    "Miller",
  ];
  const regions = ["North", "South", "East", "West", "Central"];

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const policies = Math.round(40 + Math.random() * 60);
    const averagePolicy = 2000 + Math.random() * 3000;
    const revenue = policies * averagePolicy;
    const commission = revenue * 0.05;
    const rating = 4.0 + Math.random() * 1.0;
    const trend = -5 + Math.random() * 25;
    const conversionRate = 15 + Math.random() * 25;
    const customerSatisfaction = 4.0 + Math.random() * 1.0;

    return {
      id: `AGT-${String(index + 1).padStart(3, "0")}`,
      name: `${firstName} ${lastName}`,
      region: regions[index % regions.length],
      policies,
      revenue: Math.round(revenue),
      commission: Math.round(commission),
      rating: Math.round(rating * 10) / 10,
      trend: Math.round(trend * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
      customerSatisfaction: Math.round(customerSatisfaction * 10) / 10,
    };
  }).sort((a, b) => b.revenue - a.revenue);
};

export const generateClaimsData = (): ClaimsData => {
  const byType: ClaimsByType[] = [
    {
      type: "Auto",
      claims: 140,
      approved: 125,
      avgAmount: 8500,
      processingTime: 7.5,
    },
    {
      type: "Health",
      claims: 89,
      approved: 81,
      avgAmount: 3200,
      processingTime: 5.2,
    },
    {
      type: "Life",
      claims: 45,
      approved: 42,
      avgAmount: 25000,
      processingTime: 12.1,
    },
    {
      type: "Home",
      claims: 38,
      approved: 32,
      avgAmount: 12000,
      processingTime: 9.8,
    },
    {
      type: "Business",
      claims: 28,
      approved: 18,
      avgAmount: 45000,
      processingTime: 15.3,
    },
  ];

  const totalClaims = byType.reduce((sum, t) => sum + t.claims, 0);
  const approvedClaims = byType.reduce((sum, t) => sum + t.approved, 0);
  const pendingClaims = Math.round(totalClaims * 0.1);
  const rejectedClaims = totalClaims - approvedClaims - pendingClaims;
  const averageProcessingTime =
    byType.reduce((sum, t) => sum + t.processingTime * t.claims, 0) /
    totalClaims;
  const totalPayout = byType.reduce(
    (sum, t) => sum + t.approved * t.avgAmount,
    0,
  );

  return {
    totalClaims,
    approvedClaims,
    pendingClaims,
    rejectedClaims,
    averageProcessingTime: Math.round(averageProcessingTime * 10) / 10,
    satisfactionScore: 4.1 + Math.random() * 0.8,
    totalPayout: Math.round(totalPayout),
    byType,
  };
};

export const generateCustomerMetrics = (): CustomerMetrics => {
  const byAgeGroup: CustomerAgeGroup[] = [
    {
      group: "18-25",
      count: 89,
      percentage: 7.1,
      averagePremium: 1800,
      retentionRate: 88.5,
    },
    {
      group: "26-35",
      count: 312,
      percentage: 25.0,
      averagePremium: 2400,
      retentionRate: 92.1,
    },
    {
      group: "36-45",
      count: 398,
      percentage: 31.9,
      averagePremium: 3200,
      retentionRate: 95.8,
    },
    {
      group: "46-55",
      count: 267,
      percentage: 21.4,
      averagePremium: 3800,
      retentionRate: 96.2,
    },
    {
      group: "56-65",
      count: 134,
      percentage: 10.7,
      averagePremium: 4200,
      retentionRate: 97.1,
    },
    {
      group: "65+",
      count: 47,
      percentage: 3.8,
      averagePremium: 3600,
      retentionRate: 94.3,
    },
  ];

  const byRegion: CustomerByRegion[] = [
    { region: "North", customers: 315, revenue: 945000, growth: 12.5 },
    { region: "South", customers: 298, revenue: 894000, growth: 8.7 },
    { region: "East", customers: 267, revenue: 801000, growth: 15.2 },
    { region: "West", customers: 245, revenue: 735000, growth: 6.9 },
    { region: "Central", customers: 122, revenue: 366000, growth: 18.3 },
  ];

  const totalCustomers = byAgeGroup.reduce((sum, g) => sum + g.count, 0);
  const newCustomers = Math.round(totalCustomers * 0.08);
  const weightedRetention =
    byAgeGroup.reduce((sum, g) => sum + g.retentionRate * g.count, 0) /
    totalCustomers;
  const lifetimeValue =
    (byAgeGroup.reduce((sum, g) => sum + g.averagePremium * g.count, 0) /
      totalCustomers) *
    5.2;

  return {
    totalCustomers,
    newCustomers,
    retentionRate: Math.round(weightedRetention * 10) / 10,
    churnRate: Math.round((100 - weightedRetention) * 10) / 10,
    lifetimeValue: Math.round(lifetimeValue),
    satisfactionScore: 4.4 + Math.random() * 0.4,
    acquisitionCost: 150 + Math.random() * 100,
    byAgeGroup,
    byRegion,
  };
};

export const generateFinancialMetrics = (): FinancialMetrics => {
  const totalPremium = 5500000 + Math.random() * 1000000;
  const lossRatio = 45 + Math.random() * 15;
  const expenseRatio = 20 + Math.random() * 10;
  const totalClaims = (totalPremium * lossRatio) / 100;
  const operatingExpenses = (totalPremium * expenseRatio) / 100;
  const investmentIncome = totalPremium * 0.03;
  const profit =
    totalPremium - totalClaims - operatingExpenses + investmentIncome;
  const profitMargin = (profit / totalPremium) * 100;
  const combinedRatio = lossRatio + expenseRatio;
  const reserves = totalPremium * 1.5;

  return {
    totalPremium: Math.round(totalPremium),
    totalClaims: Math.round(totalClaims),
    profit: Math.round(profit),
    profitMargin: Math.round(profitMargin * 10) / 10,
    lossRatio: Math.round(lossRatio * 10) / 10,
    expenseRatio: Math.round(expenseRatio * 10) / 10,
    combinedRatio: Math.round(combinedRatio * 10) / 10,
    reserves: Math.round(reserves),
    investmentIncome: Math.round(investmentIncome),
    operatingExpenses: Math.round(operatingExpenses),
  };
};

export const generateAIInsights = (): AIInsights => {
  const marketTrends: AIMarketTrend[] = [
    {
      category: "Auto Insurance",
      trend: "up",
      confidence: 0.85,
      impact: "Increased demand for electric vehicle coverage",
      recommendation: "Expand EV insurance products",
    },
    {
      category: "Cyber Insurance",
      trend: "up",
      confidence: 0.92,
      impact: "Rising cybersecurity threats in SMB sector",
      recommendation: "Develop specialized cyber products",
    },
    {
      category: "Life Insurance",
      trend: "stable",
      confidence: 0.78,
      impact: "Steady demand with aging population",
      recommendation: "Focus on digital distribution",
    },
  ];

  const predictiveAnalytics: PredictiveMetric[] = [
    {
      metric: "Customer Churn Rate",
      currentValue: 5.8,
      predictedValue: 4.2,
      timeframe: "Next Quarter",
      confidence: 0.87,
    },
    {
      metric: "Premium Growth",
      currentValue: 12.3,
      predictedValue: 15.7,
      timeframe: "Next 6 Months",
      confidence: 0.81,
    },
    {
      metric: "Claims Frequency",
      currentValue: 0.08,
      predictedValue: 0.07,
      timeframe: "Next Quarter",
      confidence: 0.76,
    },
  ];

  return {
    riskScore: 75 + Math.random() * 20,
    fraudDetections: Math.round(5 + Math.random() * 15),
    revenueOptimization: 10 + Math.random() * 15,
    customerChurnPredictions: Math.round(15 + Math.random() * 15),
    crossSellOpportunities: Math.round(100 + Math.random() * 100),
    pricingOptimization: 5 + Math.random() * 15,
    marketTrends,
    predictiveAnalytics,
  };
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const getHealthColor = (
  value: number,
  threshold: number = 80,
): string => {
  if (value >= threshold) return "text-green-600";
  if (value >= threshold * 0.7) return "text-yellow-600";
  return "text-red-600";
};

export const getTrendColor = (value: number): string => {
  if (value > 5) return "text-green-600";
  if (value > 0) return "text-yellow-600";
  return "text-red-600";
};

export const getTrendIcon = (value: number): "↗" | "→" | "↘" => {
  if (value > 2) return "↗";
  if (value > -2) return "→";
  return "↘";
};

// Export comprehensive mock data
export const mockReportingData = {
  revenue: generateRevenueData(),
  policyTypes: generatePolicyTypeData(),
  agents: generateAgentPerformanceData(),
  claims: generateClaimsData(),
  customers: generateCustomerMetrics(),
  financial: generateFinancialMetrics(),
  aiInsights: generateAIInsights(),
};
