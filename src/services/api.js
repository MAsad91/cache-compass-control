
// API Service definition
export const ApiService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch('/dashboard/stats');
      return response.json();
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },

  // Cache entries
  getCacheEntries: async (page = 1, pageSize = 10) => {
    try {
      const response = await fetch(`/dashboard/entries?page=${page}&pageSize=${pageSize}`);
      return response.json();
    } catch (error) {
      console.error("Failed to fetch cache entries:", error);
      throw error;
    }
  },

  // Clear all cache
  clearAllCache: async () => {
    try {
      const response = await fetch('/cache/clear', {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error("Failed to clear all cache:", error);
      throw error;
    }
  },

  // Clear specific cache entry
  clearCacheEntry: async (key) => {
    try {
      const response = await fetch(`/cache/clear/${key}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error(`Failed to clear cache entry ${key}:`, error);
      throw error;
    }
  },

  // Clear cache by pattern
  clearCacheByPattern: async (pattern) => {
    try {
      const encodedPattern = encodeURIComponent(pattern);
      const response = await fetch(`/cache/clear-pattern/${encodedPattern}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error(`Failed to clear cache by pattern ${pattern}:`, error);
      throw error;
    }
  },

  // Test endpoint with long TTL
  testEndpoint: async (endpoint) => {
    try {
      const start = performance.now();
      const response = await fetch(`/${endpoint}`);
      const end = performance.now();
      const data = await response.json();
      return {
        data,
        responseTime: Math.round(end - start),
        status: response.status,
        cached: response.headers.get('x-cache') === 'HIT'
      };
    } catch (error) {
      console.error(`Failed to test endpoint ${endpoint}:`, error);
      throw error;
    }
  }
};

// Types for reference (removed in JS)
// export interface CacheStats {
//   totalEntries: number;
//   totalHits: number;
//   totalMisses: number;
//   hitRatio: number;
//   missRatio: number;
//   uptime: number;
//   memoryUsage: number;
//   memoryLimit: number;
// }

// export interface CacheEntry {
//   key: string;
//   ttl: number;
//   expiresAt: string;
//   size: number;
// }

// export interface ResponseTimeData {
//   timestamp: string;
//   cached: number;
//   uncached: number;
// }

// export interface DashboardStats {
//   cacheStats: CacheStats;
//   responseTimes: ResponseTimeData[];
// }

// export interface EndpointResponse {
//   data: any;
//   responseTime: number;
//   status: number;
//   cached: boolean;
// }
