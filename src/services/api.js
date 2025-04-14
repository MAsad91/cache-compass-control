
// API Service definition
export const ApiService = {
  // Dashboard stats
  getDashboardStats: async () => {
    // Mock data for development
    return {
      cacheStats: {
        totalEntries: 1250,
        totalHits: 9543,
        totalMisses: 1231,
        hitRatio: 0.886,
        missRatio: 0.114,
        uptime: 86400 * 3,
        memoryUsage: 42,
        memoryLimit: 100
      },
      responseTimes: [
        { timestamp: "2023-01-01", cached: 12, uncached: 145 },
        { timestamp: "2023-01-02", cached: 11, uncached: 135 },
        { timestamp: "2023-01-03", cached: 15, uncached: 150 },
        { timestamp: "2023-01-04", cached: 10, uncached: 130 },
        { timestamp: "2023-01-05", cached: 8, uncached: 120 }
      ]
    };
  },

  // Cache entries
  getCacheEntries: async (page = 1, pageSize = 10) => {
    // Mock data for development
    const entries = Array(pageSize).fill(null).map((_, i) => ({
      key: `/api/data/${(page - 1) * pageSize + i + 1}`,
      ttl: 3600,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      size: Math.floor(Math.random() * 1000) + 100
    }));
    
    return {
      entries,
      total: 100,
      page,
      pageSize
    };
  },

  // Clear all cache
  clearAllCache: async () => {
    console.log("Clear all cache called");
    return { success: true };
  },

  // Clear specific cache entry
  clearCacheEntry: async (key) => {
    console.log(`Clear cache entry ${key} called`);
    return { success: true };
  },

  // Clear cache by pattern
  clearCacheByPattern: async (pattern) => {
    console.log(`Clear cache by pattern ${pattern} called`);
    return { success: true };
  },

  // Test endpoint
  testEndpoint: async (endpoint) => {
    console.log(`Test endpoint ${endpoint} called`);
    return {
      data: { message: "Success" },
      responseTime: Math.floor(Math.random() * 100) + 10,
      status: 200,
      cached: Math.random() > 0.5
    };
  }
};
