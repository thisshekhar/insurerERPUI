import { useState } from "react";
import {
  Globe,
  DollarSign,
  Clock,
  Palette,
  Bell,
  Shield,
  User,
  Save,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAIConfig } from "@/lib/ai-config";
import { Brain, Sparkles } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

const timezones = [
  { code: "UTC", name: "UTC (Coordinated Universal Time)" },
  { code: "America/New_York", name: "Eastern Time (US & Canada)" },
  { code: "America/Los_Angeles", name: "Pacific Time (US & Canada)" },
  { code: "Europe/London", name: "London (GMT/BST)" },
  { code: "Asia/Kolkata", name: "India Standard Time" },
  { code: "Asia/Dubai", name: "Gulf Standard Time" },
];

export default function Settings() {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    claims: true,
    policies: true,
    payments: true,
    system: false,
  });
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
  });

  const { config, isEnabled, setEnabled, setFeature } = useAIConfig();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your application preferences and global settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internationalization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Internationalization</span>
            </CardTitle>
            <CardDescription>
              Configure language, currency, and timezone preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span className="flex items-center space-x-2">
                        <span>{curr.symbol}</span>
                        <span>
                          {curr.name} ({curr.code})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.code} value={tz.code}>
                      {tz.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Use dark theme for the interface
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Theme Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {["blue", "green", "purple", "red", "orange", "teal"].map(
                  (color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full bg-${color}-500 ring-2 ring-offset-2 ring-${color}-500`}
                    />
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="claims-notifications">
                  Claims Notifications
                </Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about claim updates and approvals
                </div>
              </div>
              <Switch
                id="claims-notifications"
                checked={notifications.claims}
                onCheckedChange={(value) =>
                  handleNotificationChange("claims", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="policies-notifications">
                  Policy Notifications
                </Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about policy renewals and updates
                </div>
              </div>
              <Switch
                id="policies-notifications"
                checked={notifications.policies}
                onCheckedChange={(value) =>
                  handleNotificationChange("policies", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payments-notifications">
                  Payment Notifications
                </Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about payment reminders and receipts
                </div>
              </div>
              <Switch
                id="payments-notifications"
                checked={notifications.payments}
                onCheckedChange={(value) =>
                  handleNotificationChange("payments", value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-notifications">
                  System Notifications
                </Label>
                <div className="text-sm text-muted-foreground">
                  Get notified about system updates and maintenance
                </div>
              </div>
              <Switch
                id="system-notifications"
                checked={notifications.system}
                onCheckedChange={(value) =>
                  handleNotificationChange("system", value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </CardTitle>
            <CardDescription>
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Features</span>
            </CardTitle>
            <CardDescription>
              Configure artificial intelligence features and integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Master AI Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-enabled" className="text-base font-medium">
                  Enable AI Features
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Master switch to enable or disable all AI functionality
                </p>
              </div>
              <Switch
                id="ai-enabled"
                checked={isEnabled}
                onCheckedChange={setEnabled}
              />
            </div>

            <Separator />

            {/* Individual AI Feature Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Individual Features
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-insights" className="font-medium">
                      AI Insights & Analytics
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Smart predictions, risk assessments, and data insights
                    </p>
                  </div>
                  <Switch
                    id="ai-insights"
                    checked={config.features.insights}
                    onCheckedChange={(checked) =>
                      setFeature("insights", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-assistant" className="font-medium">
                      AI Assistant
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Floating AI chat assistant for help and automation
                    </p>
                  </div>
                  <Switch
                    id="ai-assistant"
                    checked={config.features.assistant}
                    onCheckedChange={(checked) =>
                      setFeature("assistant", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-predictions" className="font-medium">
                      Predictive Analytics
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Churn prediction, revenue optimization, and forecasting
                    </p>
                  </div>
                  <Switch
                    id="ai-predictions"
                    checked={config.features.predictions}
                    onCheckedChange={(checked) =>
                      setFeature("predictions", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-risk" className="font-medium">
                      Risk Assessment
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automated risk scoring and assessment tools
                    </p>
                  </div>
                  <Switch
                    id="ai-risk"
                    checked={config.features.riskAssessment}
                    onCheckedChange={(checked) =>
                      setFeature("riskAssessment", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-fraud" className="font-medium">
                      Fraud Detection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Real-time fraud detection and prevention alerts
                    </p>
                  </div>
                  <Switch
                    id="ai-fraud"
                    checked={config.features.fraudDetection}
                    onCheckedChange={(checked) =>
                      setFeature("fraudDetection", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-navigation" className="font-medium">
                      AI Navigation & Menu
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show AI Features page in navigation menu
                    </p>
                  </div>
                  <Switch
                    id="ai-navigation"
                    checked={config.features.navigation}
                    onCheckedChange={(checked) =>
                      setFeature("navigation", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ai-branding" className="font-medium">
                      AI Branding & Badges
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display "AI-Powered" branding and badges throughout the
                      app
                    </p>
                  </div>
                  <Switch
                    id="ai-branding"
                    checked={config.features.branding}
                    onCheckedChange={(checked) =>
                      setFeature("branding", checked)
                    }
                    disabled={!isEnabled}
                  />
                </div>
              </div>
            </div>

            {/* AI Status */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="font-medium">AI Status</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Master Status:</span>
                  <span
                    className={`ml-2 font-medium ${isEnabled ? "text-green-600" : "text-red-600"}`}
                  >
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Active Features:
                  </span>
                  <span className="ml-2 font-medium">
                    {Object.values(config.features).filter(Boolean).length} /{" "}
                    {Object.keys(config.features).length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
}
