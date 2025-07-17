import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Get system information
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Calculate memory usage in MB
    const memoryInfo = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    };
    
    // Calculate memory percentage (assuming 2GB limit)
    const memoryPercentage = Math.round((memoryInfo.heapUsed / 248) * 100); // Performance metrics
    const responseTime = Date.now() - startTime;
    
    // Health status
    const isHealthy = memoryInfo.heapUsed < 180; // 90% of 2GB
    const status = isHealthy ? 'healthy' : 'warning';  
    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      memory: {
        ...memoryInfo,
        percentage: memoryPercentage,
        limit: 248 // 2GB in MB
      },
      performance: {
        responseTime,
        nodeVersion: process.version,
        platform: process.platform,
      },
      capacity: {
        estimatedConcurrentUsers: Math.max(10, Math.floor((2048 - memoryInfo.heapUsed) / 25)),
        memoryEfficiency: Math.round((2048 - memoryInfo.heapUsed) / 2048 * 100),
        recommendations: getRecommendations(memoryInfo, memoryPercentage),
      },
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

function getRecommendations(memoryInfo, memoryPercentage) {
  const recommendations = [];
  
  if (memoryPercentage > 80) {
    recommendations.push('High memory usage detected. Consider optimizing images or reducing concurrent users.');
  }
  
  if (memoryInfo.heapUsed > 1500) {
    recommendations.push('Memory usage approaching limit. Monitor closely.');
  }
  
  if (memoryPercentage < 50) {
    recommendations.push('System has good capacity. Can handle more concurrent users.');
  }
  
  return recommendations;
} 