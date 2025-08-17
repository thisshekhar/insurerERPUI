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

// Global window error handler for unhandled ResizeObserver errors
export const initializeGlobalErrorHandling = () => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('ResizeObserver')) {
      event.preventDefault();
    }
  });

  // Handle general window errors
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('ResizeObserver') ||
        event.message?.includes('ResizeObserver')) {
      event.preventDefault();
      return false;
    }
  });

  // Additional ResizeObserver specific handling
  const originalResizeObserver = window.ResizeObserver;
  if (originalResizeObserver) {
    window.ResizeObserver = class extends originalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
          try {
            callback(entries, observer);
          } catch (error) {
            // Silently ignore ResizeObserver callback errors
            if (!(error instanceof Error) || !error.message.includes('ResizeObserver')) {
              throw error;
            }
          }
        };
        super(wrappedCallback);
      }
    };
  }
};

// Initialize error suppression when the module is imported
if (typeof window !== 'undefined') {
  suppressResizeObserverErrors();
  initializeGlobalErrorHandling();
}
