import { 
  Brain, 
  Sparkles, 
  Zap, 
  Shield, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  FileSearch, 
  BarChart3, 
  Lock, 
  Clock, 
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Star,
  Rocket,
  Eye,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const aiFeatures = [
  {
    id: 'fraud-detection',
    title: 'AI Fraud Detection',
    description: 'Advanced machine learning algorithms detect fraudulent claims with 94% accuracy',
    icon: Shield,
    status: 'active',
    progress: 100,
    category: 'Security',
    benefits: ['Reduce fraud losses by 60%', 'Automated risk scoring', 'Pattern recognition'],
    color: 'red'
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Customer Analytics',
    description: 'Predict customer churn, identify cross-sell opportunities, and optimize retention',
    icon: TrendingUp,
    status: 'active',
    progress: 100,
    category: 'Analytics',
    benefits: ['23% increase in retention', 'Proactive customer care', 'Revenue optimization'],
    color: 'blue'
  },
  {
    id: 'smart-underwriting',
    title: 'Intelligent Underwriting',
    description: 'AI-powered risk assessment and automated policy pricing optimization',
    icon: Target,
    status: 'beta',
    progress: 85,
    category: 'Underwriting',
    benefits: ['40% faster processing', 'Consistent risk scoring', 'Dynamic pricing'],
    color: 'green'
  },
  {
    id: 'document-ai',
    title: 'Document Intelligence',
    description: 'Automatic document processing, data extraction, and compliance verification',
    icon: FileSearch,
    status: 'coming-soon',
    progress: 60,
    category: 'Processing',
    benefits: ['95% data accuracy', 'Instant processing', 'Compliance automation'],
    color: 'purple'
  },
  {
    id: 'chatbot-assistant',
    title: 'AI Customer Assistant',
    description: '24/7 intelligent customer support with natural language understanding',
    icon: MessageCircle,
    status: 'beta',
    progress: 78,
    category: 'Customer Service',
    benefits: ['85% query resolution', '24/7 availability', 'Multi-language support'],
    color: 'indigo'
  },
  {
    id: 'claims-automation',
    title: 'Automated Claims Processing',
    description: 'End-to-end claims automation with intelligent routing and approval workflows',
    icon: Zap,
    status: 'coming-soon',
    progress: 45,
    category: 'Claims',
    benefits: ['50% faster processing', 'Reduced manual work', 'Smart routing'],
    color: 'yellow'
  },
  {
    id: 'market-intelligence',
    title: 'Market Intelligence',
    description: 'Real-time market analysis, competitive insights, and pricing recommendations',
    icon: BarChart3,
    status: 'coming-soon',
    progress: 30,
    category: 'Strategy',
    benefits: ['Market positioning', 'Competitive analysis', 'Pricing optimization'],
    color: 'teal'
  },
  {
    id: 'risk-modeling',
    title: 'Advanced Risk Modeling',
    description: 'Dynamic risk models using external data sources and machine learning',
    icon: AlertTriangle,
    status: 'research',
    progress: 15,
    category: 'Risk Management',
    benefits: ['Better risk assessment', 'Dynamic pricing', 'External data integration'],
    color: 'orange'
  }
];

const statusConfig = {
  'active': { 
    label: 'LIVE', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle
  },
  'beta': { 
    label: 'BETA', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: Clock
  },
  'coming-soon': { 
    label: 'COMING SOON', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    icon: Rocket
  },
  'research': { 
    label: 'RESEARCH', 
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    icon: Lightbulb
  }
};

const upcomingFeatures = [
  {
    title: 'Blockchain Policy Verification',
    description: 'Immutable policy records with smart contract automation',
    quarter: 'Q3 2024',
    impact: 'High'
  },
  {
    title: 'IoT Integration',
    description: 'Real-time data from connected devices for dynamic pricing',
    quarter: 'Q4 2024',
    impact: 'Medium'
  },
  {
    title: 'Augmented Reality Claims',
    description: 'AR-powered damage assessment and virtual inspections',
    quarter: 'Q1 2025',
    impact: 'High'
  },
  {
    title: 'Quantum Risk Modeling',
    description: 'Advanced quantum computing for complex risk calculations',
    quarter: 'Q2 2025',
    impact: 'Revolutionary'
  }
];

export default function AIFeatures() {
  const getColorClasses = (color: string) => {
    const colors = {
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
      yellow: 'from-yellow-500 to-yellow-600',
      teal: 'from-teal-500 to-teal-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AI Features</h1>
            <p className="text-lg text-purple-600 dark:text-purple-400 font-medium">Powered by Advanced Machine Learning</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Experience the future of insurance technology with our comprehensive AI-powered features 
          designed to revolutionize your business operations and customer experience.
        </p>
      </div>

      {/* AI Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon;
          const statusInfo = statusConfig[feature.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={feature.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {/* Gradient Background */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                getColorClasses(feature.color)
              )} />
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-r text-white",
                      getColorClasses(feature.color)
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Implementation</span>
                    <span className="font-medium">{feature.progress}%</span>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-xs text-muted-foreground">
                        <div className="h-1 w-1 bg-current rounded-full mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button 
                  size="sm" 
                  className="w-full"
                  variant={feature.status === 'active' ? 'default' : 'outline'}
                  disabled={feature.status === 'research'}
                >
                  {feature.status === 'active' ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Live Demo
                    </>
                  ) : feature.status === 'beta' ? (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Join Beta
                    </>
                  ) : feature.status === 'coming-soon' ? (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Get Notified
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Learn More
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Assistant Showcase */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Assistant - Live Now!</CardTitle>
              <CardDescription>Your intelligent insurance companion, available 24/7</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">What can I help you with?</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  "Analyze customer churn risk for Q1"
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  "Find cross-sell opportunities in my portfolio"
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  "Check for potential fraud in recent claims"
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  "Optimize pricing for auto insurance segment"
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Capabilities:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Natural Language Queries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Predictive Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Action Recommendations</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start AI Chat (Bottom Right)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Features Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            <span>Innovation Roadmap</span>
          </CardTitle>
          <CardDescription>Cutting-edge features coming to InsurePro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div className="space-y-1">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline">{feature.quarter}</Badge>
                  <div className="text-xs text-muted-foreground">
                    Impact: <span className={cn(
                      "font-medium",
                      feature.impact === 'Revolutionary' && "text-purple-600",
                      feature.impact === 'High' && "text-green-600",
                      feature.impact === 'Medium' && "text-yellow-600"
                    )}>{feature.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience the Future?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the revolution in insurance technology. Our AI-powered platform is transforming 
            how businesses operate, making them more efficient, profitable, and customer-focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <ArrowRight className="h-4 w-4 mr-2" />
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Brain className="h-4 w-4 mr-2" />
              Contact AI Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
