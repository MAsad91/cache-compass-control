
import { toast } from "sonner";

// Types
export interface CacheEntry {
  id: string;
  key: string;
  ttl: number;
  size: number;
  createdAt: string;
  expiresAt: string;
  hits: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRatio: number;
  missRatio: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  memoryLimit: number;
  uptime: number;
}

export interface ResponseTimeData {
  timestamp: string;
  cached: number;
  uncached: number;
}

export interface DashboardStats {
  cacheStats: CacheStats;
  responseTimes: ResponseTimeData[];
  hitsByEndpoint: {
    endpoint: string;
    hits: number;
    misses: number;
  }[];
  recentActivity: {
    action: string;
    endpoint: string;
    timestamp: string;
    duration: number;
    status: "hit" | "miss" | "error";
  }[];
}

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateRandomResponseTime = (isCached: boolean) => {
  // Cached responses are typically faster
  if (isCached) {
    return Math.floor(Math.random() * 50) + 5; // 5-55ms
  } else {
    return Math.floor(Math.random() * 300) + 100; // 100-400ms
  }
};

// Mock data generators
const generateMockCacheEntries = (count: number): CacheEntry[] => {
  const entries = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const ttl = Math.floor(Math.random() * 86400) + 60; // 1 minute to 24 hours
    const createdAt = new Date(now.getTime() - Math.floor(Math.random() * 86400000));
    const expiresAt = new Date(createdAt.getTime() + ttl * 1000);
    
    entries.push({
      id: `entry-${i}`,
      key: `/api/data/${Math.floor(Math.random() * 100)}`,
      ttl,
      size: Math.floor(Math.random() * 10000) + 100,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      hits: Math.floor(Math.random() * 1000),
    });
  }
  
  return entries;
};

const generateMockCacheStats = (): CacheStats => {
  const totalHits = Math.floor(Math.random() * 10000) + 5000;
  const totalMisses = Math.floor(Math.random() * 2000) + 1000;
  const total = totalHits + totalMisses;
  
  return {
    totalEntries: Math.floor(Math.random() * 500) + 100,
    hitRatio: parseFloat((totalHits / total).toFixed(2)),
    missRatio: parseFloat((totalMisses / total).toFixed(2)),
    totalHits,
    totalMisses,
    memoryUsage: Math.floor(Math.random() * 200) + 50,
    memoryLimit: 512,
    uptime: Math.floor(Math.random() * 604800) + 3600, // 1 hour to 1 week in seconds
  };
};

const generateMockResponseTimeData = (days: number): ResponseTimeData[] => {
  const data: ResponseTimeData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.unshift({
      timestamp: date.toISOString().split('T')[0],
      cached: Math.floor(Math.random() * 50) + 10,
      uncached: Math.floor(Math.random() * 300) + 100,
    });
  }
  
  return data;
};

const generateMockDashboardStats = (): DashboardStats => {
  const endpoints = [
    "/api/data",
    "/api/short-lived",
    "/api/users",
    "/api/products",
    "/api/orders",
  ];
  
  const hitsByEndpoint = endpoints.map(endpoint => ({
    endpoint,
    hits: Math.floor(Math.random() * 5000) + 1000,
    misses: Math.floor(Math.random() * 1000) + 100,
  }));
  
  const actions = ["GET", "POST", "PUT", "DELETE"];
  const statuses: ("hit" | "miss" | "error")[] = ["hit", "miss", "error"];
  
  const recentActivity = Array.from({ length: 20 }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      action,
      endpoint,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      duration: status === "hit" ? 
        Math.floor(Math.random() * 50) + 5 : 
        Math.floor(Math.random() * 300) + 100,
      status,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return {
    cacheStats: generateMockCacheStats(),
    responseTimes: generateMockResponseTimeData(7),
    hitsByEndpoint,
    recentActivity,
  };
};

// API Service Methods
export const ApiService = {
  // Dashboard API
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      await delay(500);
      return generateMockDashboardStats();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard statistics");
      throw error;
    }
  },
  
  getCacheEntries: async (page = 1, limit = 10): Promise<{ entries: CacheEntry[], total: number }> => {
    try {
      await delay(500);
      const entries = generateMockCacheEntries(100);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        entries: entries.slice(startIndex, endIndex),
        total: entries.length,
      };
    } catch (error) {
      console.error("Error fetching cache entries:", error);
      toast.error("Failed to fetch cache entries");
      throw error;
    }
  },
  
  // Cache Management API
  clearAllCache: async (): Promise<void> => {
    try {
      await delay(800);
      toast.success("Cache cleared successfully");
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Failed to clear cache");
      throw error;
    }
  },
  
  clearCacheEntry: async (key: string): Promise<void> => {
    try {
      await delay(400);
      toast.success(`Cache entry "${key}" cleared successfully`);
    } catch (error) {
      console.error(`Error clearing cache entry "${key}":`, error);
      toast.error(`Failed to clear cache entry "${key}"`);
      throw error;
    }
  },
  
  clearCacheByPattern: async (pattern: string): Promise<void> => {
    try {
      await delay(600);
      toast.success(`Cache entries matching "${pattern}" cleared successfully`);
    } catch (error) {
      console.error(`Error clearing cache entries by pattern "${pattern}":`, error);
      toast.error(`Failed to clear cache entries matching "${pattern}"`);
      throw error;
    }
  },
  
  // API Testing Endpoints
  testEndpoint: async (endpoint: string, invalidateCache?: boolean): Promise<{ 
    data: any, 
    responseTime: number, 
    cached: boolean 
  }> => {
    try {
      const startTime = performance.now();
      
      // Simulate random cache behavior
      const isCached = invalidateCache ? false : Math.random() > 0.3;
      
      // Different response time based on cache status
      await delay(generateRandomResponseTime(isCached));
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      return {
        data: { message: "Success", endpoint, timestamp: new Date().toISOString() },
        responseTime,
        cached: isCached,
      };
    } catch (error) {
      console.error(`Error testing endpoint "${endpoint}":`, error);
      toast.error(`Failed to test endpoint "${endpoint}"`);
      throw error;
    }
  },
};
