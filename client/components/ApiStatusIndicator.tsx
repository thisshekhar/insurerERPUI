import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { api } from "@/lib/api-services";

interface ApiStatusIndicatorProps {
  className?: string;
}

export default function ApiStatusIndicator({
  className,
}: ApiStatusIndicatorProps) {
  const [status, setStatus] = useState<"online" | "offline" | "checking">(
    "checking",
  );
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    setStatus("checking");
    try {
      const response = await api.health.check();
      setStatus(response.success ? "online" : "offline");
      setLastCheck(new Date());
      console.log("[API Health] Status check successful:", response);
    } catch (error) {
      console.warn("[API Health] Status check failed:", error);
      setStatus("offline");
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // Initial check
    checkApiHealth();

    // Set up periodic health checks
    const interval = setInterval(checkApiHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          icon: Wifi,
          label: "API Online",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        };
      case "offline":
        return {
          icon: WifiOff,
          label: "API Offline",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
      case "checking":
        return {
          icon: RefreshCw,
          label: "Checking API",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        };
    }
  };

  const { icon: Icon, label, className: statusClassName } = getStatusConfig();

  return (
    <Badge
      className={`${statusClassName} ${className} cursor-pointer`}
      onClick={checkApiHealth}
      title={
        lastCheck
          ? `Last checked: ${lastCheck.toLocaleTimeString()}`
          : "Click to check API status"
      }
    >
      <Icon
        className={`h-3 w-3 mr-1 ${status === "checking" ? "animate-spin" : ""}`}
      />
      {label}
    </Badge>
  );
}
