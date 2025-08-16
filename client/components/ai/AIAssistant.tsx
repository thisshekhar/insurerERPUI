import { useState } from "react";
import {
  Bot,
  MessageCircle,
  X,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AIMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  suggestions?: string[];
  insights?: AIInsight[];
}

interface AIInsight {
  type: "risk" | "opportunity" | "recommendation" | "alert";
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

const mockInsights: AIInsight[] = [
  {
    type: "opportunity",
    title: "Cross-sell Opportunity",
    description:
      "Alice Johnson shows high potential for home insurance based on recent life changes.",
    confidence: 92,
    action: "Contact for quote",
  },
  {
    type: "risk",
    title: "Claim Risk Alert",
    description:
      "Bob Smith's claim pattern suggests 15% higher risk than average.",
    confidence: 87,
    action: "Review policy terms",
  },
  {
    type: "recommendation",
    title: "Premium Optimization",
    description:
      "Adjusting Carol Davis's premium by 8% could improve retention by 23%.",
    confidence: 94,
    action: "Schedule review call",
  },
];

const predefinedMessages: AIMessage[] = [
  {
    id: "1",
    type: "ai",
    content:
      "👋 Hello! I'm your AI Insurance Assistant. I can help you with customer insights, risk assessments, claims analysis, and premium optimization. What would you like to explore?",
    timestamp: new Date().toISOString(),
    suggestions: [
      "Analyze customer risk profiles",
      "Find cross-sell opportunities",
      "Review pending claims",
      "Optimize premium pricing",
    ],
  },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(predefinedMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response based on input
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): AIMessage => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("risk") || lowerInput.includes("assess")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "🎯 I've analyzed your customer risk profiles. Here are the key insights:",
        timestamp: new Date().toISOString(),
        insights: [
          {
            type: "risk",
            title: "High-Risk Customers",
            description:
              "3 customers show elevated risk scores above 75. Review recommended.",
            confidence: 89,
            action: "Review profiles",
          },
          {
            type: "recommendation",
            title: "Risk Mitigation",
            description:
              "Implementing enhanced verification could reduce risk by 24%.",
            confidence: 91,
            action: "Implement changes",
          },
        ],
        suggestions: [
          "Show high-risk customers",
          "Generate risk report",
          "Set up alerts",
        ],
      };
    }

    if (
      lowerInput.includes("cross-sell") ||
      lowerInput.includes("opportunity")
    ) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "💡 I've identified several cross-selling opportunities based on customer behavior and life events:",
        timestamp: new Date().toISOString(),
        insights: [
          {
            type: "opportunity",
            title: "Home Insurance Prospects",
            description: "2 life insurance customers recently purchased homes.",
            confidence: 94,
            action: "Contact immediately",
          },
          {
            type: "opportunity",
            title: "Auto Insurance Upsell",
            description: "1 customer eligible for multi-vehicle discount.",
            confidence: 88,
            action: "Send quote",
          },
        ],
        suggestions: [
          "Contact these customers",
          "Generate quote proposals",
          "Set follow-up reminders",
        ],
      };
    }

    if (lowerInput.includes("claims") || lowerInput.includes("pending")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content: "📋 Claims analysis complete. Here's what needs attention:",
        timestamp: new Date().toISOString(),
        insights: [
          {
            type: "alert",
            title: "Overdue Claims Review",
            description: "2 claims have been pending for over 14 days.",
            confidence: 100,
            action: "Prioritize review",
          },
          {
            type: "recommendation",
            title: "Fraud Detection",
            description:
              "1 claim shows patterns consistent with fraud (83% confidence).",
            confidence: 83,
            action: "Investigate further",
          },
        ],
        suggestions: [
          "Show overdue claims",
          "Run fraud analysis",
          "Generate claims report",
        ],
      };
    }

    if (lowerInput.includes("premium") || lowerInput.includes("pricing")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "💰 Premium optimization analysis reveals significant opportunities:",
        timestamp: new Date().toISOString(),
        insights: [
          {
            type: "opportunity",
            title: "Retention Improvement",
            description: "Adjusting 4 customer premiums could prevent churn.",
            confidence: 92,
            action: "Apply recommendations",
          },
          {
            type: "recommendation",
            title: "Competitive Pricing",
            description:
              "Market analysis suggests 12% pricing adjustment opportunity.",
            confidence: 86,
            action: "Review market data",
          },
        ],
        suggestions: [
          "Apply price adjustments",
          "Contact at-risk customers",
          "Generate pricing report",
        ],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "ai",
      content:
        "🤖 I'm here to help! I can assist with customer insights, risk assessment, claims analysis, premium optimization, and fraud detection. What specific area would you like me to analyze?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Analyze customer behavior",
        "Detect potential fraud",
        "Optimize pricing strategy",
        "Predict customer churn",
      ],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bot className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "risk":
        return "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
      case "opportunity":
        return "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800";
      case "recommendation":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800";
      case "alert":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/10 dark:border-gray-800";
    }
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </div>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/80">Powered by Advanced ML</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              BETA
            </Badge>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.type === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3 rounded-lg",
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>

                    {/* AI Insights */}
                    {message.insights && (
                      <div className="mt-3 space-y-2">
                        {message.insights.map((insight, index) => (
                          <Card
                            key={index}
                            className={cn(
                              "border",
                              getInsightColor(insight.type),
                            )}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start space-x-2">
                                {getInsightIcon(insight.type)}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-xs">
                                    {insight.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {insight.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {insight.confidence}% confidence
                                    </Badge>
                                    {insight.action && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-6"
                                      >
                                        {insight.action}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs opacity-80">Quick actions:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 w-full justify-start bg-white/10 hover:bg-white/20"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about your insurance data..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
