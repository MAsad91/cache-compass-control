
// Mock API service implementation
// In a real application, this would integrate with an actual backend API

// Simulate network delay for API requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock cache data
const generateMockCacheEntries = (count = 20) => {
  const entries = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // Random date within last week
    const ttl = Math.floor(Math.random() * 3600) + 300; // TTL between 5 minutes and 1 hour
    const expiresAt = new Date(createdAt.getTime() + ttl * 1000);
    
    entries.push({
      key: `cache:${Math.random().toString(36).substring(2, 10)}:${i}`,
      value: { data: `Sample data for entry ${i}` },
      ttl: ttl,
      hits: Math.floor(Math.random() * 100),
      size: Math.floor(Math.random() * 10000) + 100, // Size in bytes
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  }
  
  return entries;
};

// Mock cache data
const mockCacheData = {
  entries: generateMockCacheEntries(20),
  total: 72, // Total number of entries
  stats: {
    hitRatio: 0.78,
    missRatio: 0.22,
    memoryUsage: 45,
    totalMemory: 100,
  },
};

export const ApiService = {
  // Get cache entries with pagination
  getCacheEntries: async (page = 1, pageSize = 10) => {
    await delay(300); // Simulate network delay
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      entries: mockCacheData.entries.slice(startIndex, endIndex),
      total: mockCacheData.total,
      page,
      pageSize,
      totalPages: Math.ceil(mockCacheData.total / pageSize),
    };
  },
  
  // Get cache statistics
  getCacheStats: async () => {
    await delay(200);
    return mockCacheData.stats;
  },
  
  // Clear all cache entries
  clearAllCache: async () => {
    await delay(500);
    console.log('All cache entries cleared');
    return { success: true, message: 'All cache entries cleared' };
  },
  
  // Clear a specific cache entry
  clearCacheEntry: async (key) => {
    await delay(200);
    console.log(`Cache entry cleared: ${key}`);
    return { success: true, message: `Cache entry '${key}' cleared` };
  },
  
  // Clear cache entries by pattern
  clearCacheByPattern: async (pattern) => {
    await delay(400);
    console.log(`Cache entries matching pattern '${pattern}' cleared`);
    return { success: true, message: `Cache entries matching '${pattern}' cleared` };
  },
  
  // Test API endpoint
  testEndpoint: async (url, method = 'GET', headers = {}, body = null, useCache = true) => {
    await delay(useCache ? 100 : 800); // Faster response if cached
    
    return {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-response-time': useCache ? '15ms' : '120ms',
        'cache-control': 'max-age=3600',
        'x-cache-status': useCache ? 'HIT' : 'MISS'
      },
      data: {
        success: true,
        message: 'This is a sample response',
        timestamp: new Date().toISOString(),
        cached: useCache
      }
    };
  }
};

export default ApiService;
