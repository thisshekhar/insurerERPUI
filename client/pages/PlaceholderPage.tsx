import { Construction, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  features?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction,
  features = []
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              This module is currently under development and will be available soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Planned Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Continue prompting to help build out this page's content and functionality.
              </p>
              <Button variant="outline" className="w-full">
                Request Development
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
