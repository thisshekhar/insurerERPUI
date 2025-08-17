import { useState, useEffect } from "react";

// AI Configuration Interface
export interface AIConfig {
  enabled: boolean;
  features: {
    insights: boolean;
    assistant: boolean;
    predictions: boolean;
    riskAssessment: boolean;
    fraudDetection: boolean;
    navigation: boolean;
    branding: boolean;
  };
}

// Default AI Configuration
export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: true,
  features: {
    insights: true,
    assistant: true,
    predictions: true,
    riskAssessment: true,
    fraudDetection: true,
    navigation: true,
    branding: true,
  },
};

// Local Storage Key
const AI_CONFIG_KEY = "insure-pro-ai-config";

// Configuration Management
class AIConfigManager {
  private static instance: AIConfigManager;
  private config: AIConfig;
  private listeners: Set<(config: AIConfig) => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager();
    }
    return AIConfigManager.instance;
  }

  private loadConfig(): AIConfig {
    try {
      const stored = localStorage.getItem(AI_CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return {
          ...DEFAULT_AI_CONFIG,
          ...parsed,
          features: {
            ...DEFAULT_AI_CONFIG.features,
            ...(parsed.features || {}),
          },
        };
      }
    } catch (error) {
      console.warn("Failed to load AI config from localStorage:", error);
    }
    return { ...DEFAULT_AI_CONFIG };
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.warn("Failed to save AI config to localStorage:", error);
    }
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AIConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      features: {
        ...this.config.features,
        ...(updates.features || {}),
      },
    };
    this.saveConfig();
    this.notifyListeners();
  }

  public setEnabled(enabled: boolean): void {
    this.updateConfig({ enabled });
  }

  public setFeature(
    feature: keyof AIConfig["features"],
    enabled: boolean,
  ): void {
    this.updateConfig({
      features: {
        ...this.config.features,
        [feature]: enabled,
      },
    });
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public isFeatureEnabled(feature: keyof AIConfig["features"]): boolean {
    return this.config.enabled && this.config.features[feature];
  }

  public subscribe(listener: (config: AIConfig) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }

  public resetToDefaults(): void {
    this.config = { ...DEFAULT_AI_CONFIG };
    this.saveConfig();
    this.notifyListeners();
  }
}

// Singleton instance
export const aiConfigManager = AIConfigManager.getInstance();

// React Hook for AI Configuration
export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig>(aiConfigManager.getConfig());

  useEffect(() => {
    const unsubscribe = aiConfigManager.subscribe(setConfig);
    return unsubscribe;
  }, []);

  return {
    config,
    isEnabled: aiConfigManager.isEnabled(),
    isFeatureEnabled: (feature: keyof AIConfig["features"]) =>
      aiConfigManager.isFeatureEnabled(feature),
    setEnabled: (enabled: boolean) => aiConfigManager.setEnabled(enabled),
    setFeature: (feature: keyof AIConfig["features"], enabled: boolean) =>
      aiConfigManager.setFeature(feature, enabled),
    updateConfig: (updates: Partial<AIConfig>) =>
      aiConfigManager.updateConfig(updates),
    resetToDefaults: () => aiConfigManager.resetToDefaults(),
  };
}

// Utility function for conditional rendering
export function withAIFeature<T>(
  feature: keyof AIConfig["features"] | "enabled",
  component: T,
  fallback: T | null = null,
): T | null {
  const isEnabled =
    feature === "enabled"
      ? aiConfigManager.isEnabled()
      : aiConfigManager.isFeatureEnabled(feature as keyof AIConfig["features"]);

  return isEnabled ? component : fallback;
}

// Environment-based configuration override
export function initializeAIConfig(overrides?: Partial<AIConfig>): void {
  if (overrides) {
    aiConfigManager.updateConfig(overrides);
  }
}
