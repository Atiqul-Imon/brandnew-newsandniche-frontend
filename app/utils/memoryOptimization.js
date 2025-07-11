import { useState, useEffect } from 'react';

// Memory optimization utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function to limit function calls
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Safe event listener wrapper
export const addSafeEventListener = (element, event, handler, options = {}) => {
  if (!element) return null;
  
  const safeHandler = (e) => {
    try {
      handler(e);
    } catch (error) {
      console.error('Event handler error:', error);
    }
  };
  
  element.addEventListener(event, safeHandler, options);
  
  // Return cleanup function
  return () => {
    if (element) {
      element.removeEventListener(event, safeHandler, options);
    }
  };
};

// Memory leak detection helper
export const createMemoryLeakDetector = (componentName) => {
  const startTime = Date.now();
  const startMemory = performance.memory?.usedJSHeapSize || 0;
  
  return {
    log: (message) => {
      const currentMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryDiff = currentMemory - startMemory;
      console.log(`[${componentName}] ${message} - Memory: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
    },
    check: () => {
      const currentMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryDiff = currentMemory - startMemory;
      if (memoryDiff > 50 * 1024 * 1024) { // 50MB threshold
        console.warn(`[${componentName}] Potential memory leak detected: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  };
};

// Component cleanup helper
export const useCleanup = () => {
  const cleanupFunctions = [];
  
  const addCleanup = (cleanupFn) => {
    cleanupFunctions.push(cleanupFn);
  };
  
  const cleanup = () => {
    cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    cleanupFunctions.length = 0;
  };
  
  return { addCleanup, cleanup };
};

// Image optimization helper
export const optimizeImage = (src, width = 800, quality = 80) => {
  if (!src) return src;
  
  // If it's already a Cloudinary URL, optimize it
  if (src.includes('res.cloudinary.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', 'auto');
    return url.toString();
  }
  
  return src;
};

// Lazy loading helper
export const lazyLoad = (importFn, fallback = null) => {
  const [Component, setComponent] = useState(fallback);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    importFn()
      .then(module => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lazy load error:', error);
        setLoading(false);
      });
  }, [importFn]);
  
  return { Component, loading };
};

// Memory monitoring hook
export const useMemoryMonitor = (componentName) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        if (performance.memory) {
          const used = performance.memory.usedJSHeapSize / 1024 / 1024;
          const total = performance.memory.totalJSHeapSize / 1024 / 1024;
          console.log(`[${componentName}] Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [componentName]);
}; 