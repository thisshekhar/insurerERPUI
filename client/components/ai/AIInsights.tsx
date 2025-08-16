import { useState } from "react";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  Shield, 
  Zap,
  Eye,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Risk Management' | 'Revenue Optimization' | 'Customer Experience' | 'Operational Efficiency' | 'Fraud Detection';
  action: string;
  expectedOutcome?: string;
  timeframe?: string;
  isNew?: boolean;
}

const mockInsights: AIInsight[] = [
  {
    id: 'ai-001',
    type: 'prediction',
    title: 'Customer Churn Risk Detected',
    description: 'Carol Davis shows 73% probability of policy cancellation within 30 days based on payment delays and reduced engagement.',
    confidence: 87,
    impact: 'High',
    category: 'Risk Management',
    action: 'Schedule retention call',
    expectedOutcome: '$4,800 revenue retention',
    timeframe: '24-48 hours',
    isNew: true
  },
  {
    id: 'ai-002',
    type: 'opportunity',
    title: 'Cross-sell Opportunity Identified',
    description: 'Alice Johnson recently purchased a home (detected via social signals). High probability for home insurance conversion.',
    confidence: 92,
    impact: 'High',
    category: 'Revenue Optimization',
    action: 'Send personalized quote',
    expectedOutcome: '+$1,800 annual premium',
    timeframe: '1 week'
  },
  {
    id: 'ai-003',
    type: 'alert',
    title: 'Potential Fraud Pattern',
    description: 'Claim CLM-003 exhibits patterns similar to 47 known fraudulent cases. Document analysis shows inconsistencies.',
    confidence: 83,
    impact: 'Critical',
    category: 'Fraud Detection',
    action: 'Escalate for investigation',
    expectedOutcome: 'Prevent $25,000 loss',
    timeframe: 'Immediate'
  },
  {
    id: 'ai-004',
    type: 'optimization',
    title: 'Premium Pricing Optimization',
    description: 'Market analysis suggests adjusting rates for Auto Insurance by +8% while maintaining 94% retention probability.',
    confidence: 89,
    impact: 'Medium',
    category: 'Revenue Optimization',
    action: 'Review pricing model',
    expectedOutcome: '+12% profit margin',
    timeframe: '2-4 weeks'
  },
  {
    id: 'ai-005',
    type: 'recommendation',
    title: 'Agent Performance Enhancement',
    description: 'Sarah Williams could increase conversion by 23% with targeted training on health insurance products.',
    confidence: 78,
    impact: 'Medium',
    category: 'Operational Efficiency',
    action: 'Schedule training session',
    expectedOutcome: '+15 policies/month',
    timeframe: '1 month'
  }
];

interface AIInsightsProps {
  maxItems?: number;
  categories?: string[];
  showHeader?: boolean;
  variant?: 'default' | 'compact' | 'dashboard';
}

export default function AIInsights({ 
  maxItems = 5, 
  categories, 
  showHeader = true,
  variant = 'default'
}: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInsights = insights
    .filter(insight => !categories || categories.includes(insight.category))
    .slice(0, maxItems);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate AI analysis
    setTimeout(() => {
      // Mark all insights as not new and simulate new ones
      setInsights(prev => prev.map(insight => ({ ...insight, isNew: false })));
      setIsRefreshing(false);
    }, 2000);
  };

  const handleTakeAction = (insight: AIInsight) => {
    // Simulate taking action
    setInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <Target className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'recommendation': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'alert': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'opportunity': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'optimization': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (variant === 'compact') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Insights</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                LIVE
              </Badge>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="p-3 border rounded-lg dark:border-gray-700 relative">
              {insight.isNew && (
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={cn("p-1 rounded", getTypeColor(insight.type))}>
                      {getTypeIcon(insight.type)}
                    </div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge className={getImpactColor(insight.impact)} size="sm">
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Progress value={insight.confidence} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-6" onClick={() => handleTakeAction(insight)}>
                      {insight.action}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInsights.slice(0, 3).map((insight) => (
          <Card key={insight.id} className="relative overflow-hidden">
            {insight.isNew && (
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-yellow-500" />
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                  NEW
                </Badge>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className={cn("p-2 rounded-lg", getTypeColor(insight.type))}>
                  {getTypeIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm">{insight.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getImpactColor(insight.impact)} size="sm">
                      {insight.impact}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{insight.category}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-xs font-medium">{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
                {insight.expectedOutcome && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Expected Impact</span>
                    <span className="text-xs font-medium text-green-600">{insight.expectedOutcome}</span>
                  </div>
                )}
                <Button size="sm" className="w-full mt-3" onClick={() => handleTakeAction(insight)}>
                  {insight.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI-Powered Insights</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  BETA
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time analysis and recommendations powered by machine learning
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="relative">
            {insight.isNew && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className={cn("p-2 rounded-lg flex-shrink-0", getTypeColor(insight.type))}>
                  {getTypeIcon(insight.type)}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{insight.confidence}%</span>
                      <Progress value={insight.confidence} className="mt-1 h-2" />
                    </div>
                    {insight.timeframe && (
                      <div>
                        <span className="text-muted-foreground">Timeframe: </span>
                        <span className="font-medium">{insight.timeframe}</span>
                      </div>
                    )}
                  </div>

                  {insight.expectedOutcome && (
                    <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800">
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                        Expected Outcome: {insight.expectedOutcome}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button 
                      size="sm" 
                      onClick={() => handleTakeAction(insight)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {insight.action}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
