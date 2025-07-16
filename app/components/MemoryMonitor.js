"use client";
import { useEffect, useState } from 'react';

export default function MemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const updateMemoryInfo = () => {
      if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        setMemoryInfo({
          usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
          percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        });
      }
    };

    // Update immediately
    updateMemoryInfo();

    // Update every 5 seconds
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !memoryInfo) {
    return null;
  }

  const getColor = (percentage) => {
    if (percentage > 80) return 'text-red-500';
    if (percentage > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Memory Monitor</h3>
      <div className="space-y-1">
        <div>Used: {memoryInfo.usedJSHeapSize}MB</div>
        <div>Total: {memoryInfo.totalJSHeapSize}MB</div>
        <div>Limit: {memoryInfo.jsHeapSizeLimit}MB</div>
        <div className={`font-bold ${getColor(memoryInfo.percentage)}`}>
          Usage: {memoryInfo.percentage}%
        </div>
      </div>
      {memoryInfo.percentage > 80 && (
        <div className="mt-2 text-red-400 text-xs">
          ⚠️ High memory usage detected
        </div>
      )}
    </div>
  );
} 