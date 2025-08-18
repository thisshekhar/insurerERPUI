import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  DollarSign,
  FolderOpen,
  Bell,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AIAssistant from "@/components/ai/AIAssistant";
import { useAIConfig } from "@/lib/ai-config";
import ApiStatusIndicator from "@/components/ApiStatusIndicator";

const getNavigation = (isAIEnabled: boolean) => [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Policies", href: "/policies", icon: FileText },
  { name: "Claims", href: "/claims", icon: CreditCard },
  { name: "Agents", href: "/agents", icon: UserCheck },
  { name: "Payments", href: "/payments", icon: DollarSign },
  { name: "Documents", href: "/documents", icon: FolderOpen },
  { name: "API Demo", href: "/api-demo", icon: Zap },
  ...(isAIEnabled
    ? [{ name: "AI Features", href: "/ai-features", icon: Sparkles }]
    : []),
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount] = useState(5);
  const location = useLocation();
  const { isFeatureEnabled } = useAIConfig();

  const navigation = getNavigation(isFeatureEnabled("navigation"));

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 dark:bg-gray-900",
        darkMode && "dark",
      )}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={closeSidebar}
          onTouchStart={closeSidebar}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 relative">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  InsurePro
                </span>
                {isFeatureEnabled("branding") && (
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      AI-Powered
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="relative z-10 hover:bg-gray-100 dark:hover:bg-gray-700 min-w-[2rem] min-h-[2rem] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={(e) => {
                console.log("X button clicked"); // Debug log
                e.preventDefault();
                e.stopPropagation();
                closeSidebar();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              type="button"
              aria-label="Close sidebar"
              tabIndex={0}
            >
              <X className="h-5 w-5 pointer-events-none" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation */}
            <nav className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-700 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                    )}
                    onClick={closeSidebar}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.name === "Dashboard" &&
                      isFeatureEnabled("branding") && (
                        <Badge className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                          AI
                        </Badge>
                      )}
                  </Link>
                );
              })}
            </nav>

            {/* AI Features Highlight */}
            {isFeatureEnabled("branding") && (
              <div className="px-4 pb-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                      AI Features
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mb-3">
                    Experience next-gen insurance management with AI-powered
                    insights, predictions, and automation.
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 dark:text-purple-400">
                        Smart Risk Assessment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 dark:text-purple-400">
                        Fraud Detection
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 dark:text-purple-400">
                        Predictive Analytics
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 dark:text-purple-400">
                        Customer Insights
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings - Fixed at bottom */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              onClick={closeSidebar}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:pl-64" : "lg:pl-0",
        )}
      >
        {/* Top navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Insurance Broker ERP
              </h1>
              {isFeatureEnabled("branding") && (
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  AI-Enhanced
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* API Status */}
              <ApiStatusIndicator />

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>

              {/* Theme toggle */}
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* User profile */}
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">JD</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* AI Assistant */}
      {isFeatureEnabled("assistant") && <AIAssistant />}
    </div>
  );
}
