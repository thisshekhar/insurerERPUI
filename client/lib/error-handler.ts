// Suppress ResizeObserver loop errors
// This is a common browser issue that doesn't affect functionality
export const suppressResizeObserverErrors = () => {
  // Store the original error handler
  const originalError = console.error;
  
  // Override console.error to filter out ResizeObserver errors
  console.error = (...args) => {
    const errorMessage = args[0];
    
    // Check if it's a ResizeObserver error
    if (
      typeof errorMessage === 'string' &&
      errorMessage.includes('ResizeObserver loop')
    ) {
      // Silently ignore ResizeObserver loop errors
      return;
    }
    
    // For all other errors, use the original error handler
    originalError.apply(console, args);
  };
};

// Debounced resize observer utility
export class DebouncedResizeObserver {
  private observer: ResizeObserver;
  private timeout: number | null = null;
  private delay: number;

  constructor(callback: ResizeObserverCallback, delay: number = 100) {
    this.delay = delay;
    
    this.observer = new ResizeObserver((entries, observer) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      
      this.timeout = window.setTimeout(() => {
        try {
          callback(entries, observer);
        } catch (error) {
          // Suppress ResizeObserver errors
          if (!(error instanceof Error) || !error.message.includes('ResizeObserver')) {
            console.error('ResizeObserver error:', error);
          }
        }
      }, this.delay);
    });
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    this.observer.observe(target, options);
  }

  unobserve(target: Element) {
    this.observer.unobserve(target);
  }

  disconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.observer.disconnect();
  }
}

// Error boundary component for React
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out ResizeObserver errors
    if (!error.message.includes('ResizeObserver')) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// React hook for handling resize observers
export const useResizeObserver = (
  callback: ResizeObserverCallback,
  delay: number = 100
) => {
  const observerRef = React.useRef<DebouncedResizeObserver | null>(null);

  React.useEffect(() => {
    observerRef.current = new DebouncedResizeObserver(callback, delay);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, delay]);

  const observe = React.useCallback((target: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(target);
    }
  }, []);

  const unobserve = React.useCallback((target: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(target);
    }
  }, []);

  return { observe, unobserve };
};