"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function HealthDashboard() {
  const t = useTranslations();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMemoryColor = (percentage) => {
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-yellow-600";
    return "text-red-600";
  };

  // Safely access nested properties
  const getMemoryPercentage = () => {
    return healthData?.memory?.percentage || 0;
  };

  const getMemoryInfo = () => {
    return healthData?.memory || {};
  };

  const getPerformanceInfo = () => {
    return healthData?.performance || {};
  };

  if (loading && !healthData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Health Dashboard</h1>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Server&apos;s health status and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchHealthData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {healthData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthData.status)}`}>
                  {healthData.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">{Math.floor((healthData.uptime || 0) / 3600)}h {Math.floor(((healthData.uptime || 0) % 3600) / 60)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">{getPerformanceInfo().responseTime || 0}ms</span>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Usage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Heap Used</span>
                    <span className={`text-sm font-medium ${getMemoryColor(getMemoryPercentage())}`}>
                      {getMemoryPercentage()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getMemoryColor(getMemoryPercentage()).replace("text-", "bg-")}`}
                      style={{ width: `${getMemoryPercentage()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Used:</span>
                    <span className="ml-1 font-medium">{getMemoryInfo().heapUsed || 0}MB</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-1 font-medium">{getMemoryInfo().heapTotal || 0}MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Node Version:</span>
                  <span className="font-medium">{getPerformanceInfo().nodeVersion || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium">{getPerformanceInfo().platform || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">{getPerformanceInfo().responseTime || 0}ms</span>
                </div>
              </div>
            </div>

            {/* Capacity Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Concurrent Users:</span>
                  <span className="font-medium">{healthData?.capacity?.estimatedConcurrentUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Efficiency:</span>
                  <span className="font-medium">{healthData?.capacity?.memoryEfficiency || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Limit:</span>
                  <span className="font-medium">{getMemoryInfo().limit || 0}MB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Memory Info */}
        {healthData && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Memory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">RSS (Resident Set Size)</h4>
                <p className="text-2xl font-bold text-blue-600">{getMemoryInfo().rss || 0}MB</p>
                <p className="text-sm text-gray-600">Total memory allocated</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Heap Used</h4>
                <p className="text-2xl font-bold text-green-600">{getMemoryInfo().heapUsed || 0}MB</p>
                <p className="text-sm text-gray-600">JavaScript heap memory</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">External</h4>
                <p className="text-2xl font-bold text-purple-600">{getMemoryInfo().external || 0}MB</p>
                <p className="text-sm text-gray-600">C++ objects bound to JS</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {healthData?.capacity?.recommendations && healthData.capacity.recommendations.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-2 text-sm">
              {healthData.capacity.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-500">•</span>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 