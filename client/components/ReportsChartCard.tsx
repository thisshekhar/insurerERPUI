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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Share,
} from "lucide-react";

interface ChartDataPoint {
  label: string;
  value: number;
  target?: number;
  trend?: number;
  color?: string;
  subtitle?: string;
}

interface ReportsChartCardProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  chartType: "bar" | "line" | "progress" | "metric";
  className?: string;
  showActions?: boolean;
  formatValue?: (value: number) => string;
  showTrends?: boolean;
  aiEnhanced?: boolean;
}

export default function ReportsChartCard({
  title,
  description,
  data,
  chartType,
  className = "",
  showActions = true,
  formatValue = (value) => value.toLocaleString(),
  showTrends = false,
  aiEnhanced = false,
}: ReportsChartCardProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxTarget = Math.max(...data.map((d) => d.target || d.value));
  const chartMax = Math.max(maxValue, maxTarget);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    return trend > 0 ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return "text-gray-500";
    return trend > 0 ? "text-green-600" : "text-red-600";
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{formatValue(item.value)}</span>
                    {showTrends && item.trend && (
                      <div
                        className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}
                      >
                        {getTrendIcon(item.trend)}
                        <span className="text-xs">
                          {Math.abs(item.trend).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress
                    value={(item.value / chartMax) * 100}
                    className="h-3"
                  />
                  {item.target && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: {formatValue(item.target)} (
                      {((item.value / item.target) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
                {item.subtitle && (
                  <div className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "progress":
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold">
                    {formatValue(item.value)}
                  </span>
                </div>
                <Progress value={item.value} className="h-2" />
                {item.subtitle && (
                  <div className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "metric":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  {showTrends && item.trend && getTrendIcon(item.trend)}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">
                    {formatValue(item.value)}
                  </span>
                  {showTrends && item.trend && (
                    <span className={`text-sm ${getTrendColor(item.trend)}`}>
                      {item.trend > 0 ? "+" : ""}
                      {item.trend.toFixed(1)}%
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "line":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2 h-32">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col justify-end">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${(item.value / chartMax) * 100}%`,
                      backgroundColor: item.color || "#3b82f6",
                    }}
                  />
                  <div className="text-xs text-center mt-1 text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Values: {data.map((d) => formatValue(d.value)).join(", ")}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center space-x-2">
              <span>{title}</span>
              {aiEnhanced && (
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                  AI
                </Badge>
              )}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
