import "./global.css";
import "@/lib/error-handler"; // Initialize error suppression
import { initializeDummyAPI } from "@/lib/dummy-api"; // Initialize dummy API

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Claims from "./pages/Claims";
import Agents from "./pages/Agents";
import Payments from "./pages/Payments";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import AIFeatures from "./pages/AIFeatures";
import ApiDemo from "./pages/ApiDemo";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/ai-features" element={<AIFeatures />} />
              <Route path="/api-demo" element={<ApiDemo />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

// Initialize app only once
function initializeApp() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  // Check if root already exists
  if (!(container as any)._reactRoot) {
    // Initialize dummy API backend
    initializeDummyAPI();

    // Create root and store reference
    const root = createRoot(container);
    (container as any)._reactRoot = root;
    root.render(<App />);
  } else {
    // Re-render on existing root
    (container as any)._reactRoot.render(<App />);
  }
}

// Initialize the application
initializeApp();
