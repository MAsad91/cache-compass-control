
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CacheHitRatioChart } from "@/components/dashboard/CacheHitRatioChart";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();
  
  // Mock stats data
  const [cacheStats] = useState({
    hitCount: 1284,
    missCount: 351,
    hitRatio: 0.785, // 78.5%
    missRatio: 0.215, // 21.5%
    averageResponseTime: 15, // ms
    uncachedResponseTime: 120, // ms
    cacheSizeUsed: 45, // MB
    totalCacheSize: 100, // MB
    entries: 324,
    oldestEntry: new Date(Date.now() - 86400000 * 5), // 5 days ago
    newestEntry: new Date(),
  });

  // Calculate metrics
  const performanceBoost = Math.round((cacheStats.uncachedResponseTime / cacheStats.averageResponseTime) * 10) / 10;
  const cacheUtilization = (cacheStats.cacheSizeUsed / cacheStats.totalCacheSize) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor cache performance and system health</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Key metrics - top row */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cache Hit Rate</CardTitle>
            <CardDescription>Overall cache efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(cacheStats.hitRatio * 100)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {cacheStats.hitCount + cacheStats.missCount} total requests
            </p>
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${cacheStats.hitRatio * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Boost</CardTitle>
            <CardDescription>Compared to uncached</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{performanceBoost}x</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average: {cacheStats.averageResponseTime}ms vs Uncached: {cacheStats.uncachedResponseTime}ms
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-2 bg-success rounded-full flex-1"></div>
              <div className="h-2 bg-success/80 rounded-full flex-1"></div>
              <div className="h-2 bg-success/60 rounded-full flex-1"></div>
              <div className="h-2 bg-success/40 rounded-full flex-1"></div>
              <div className="h-2 bg-success/20 rounded-full flex-1"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cache Utilization</CardTitle>
            <CardDescription>Storage used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(cacheUtilization)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {cacheStats.cacheSizeUsed} MB of {cacheStats.totalCacheSize} MB used
            </p>
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  cacheUtilization > 85 ? 'bg-destructive' : 
                  cacheUtilization > 70 ? 'bg-warning' : 
                  'bg-success'
                }`} 
                style={{ width: `${cacheUtilization}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Charts row */}
        <div className="w-full">
          <CacheHitRatioChart cacheStats={cacheStats} />
        </div>

        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Cache Entries</CardTitle>
            <CardDescription>Active entries in the cache</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[260px]">
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Total Entries</span>
                <span className="font-medium">{cacheStats.entries}</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full ${
                        i < Math.ceil((cacheStats.entries / 400) * 8)
                          ? 'bg-primary'
                          : 'bg-secondary'
                      }`}
                    ></div>
                  ))}
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              <div className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>Oldest Entry</span>
                  <span className="font-medium">
                    {cacheStats.oldestEntry.toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(cacheStats.oldestEntry)}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between text-sm">
                  <span>Newest Entry</span>
                  <span className="font-medium">
                    {cacheStats.newestEntry.toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(cacheStats.newestEntry)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Average Entry Size</span>
                <span className="font-medium">
                  {Math.round((cacheStats.cacheSizeUsed / cacheStats.entries) * 1000)} KB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={`${isMobile ? "mt-6" : ""}`}>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Memory Usage</h3>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">Application</span>
                  <span>256MB / 512MB</span>
                </div>
                <div className="h-2 bg-secondary rounded-full mb-4">
                  <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
                </div>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">Cache Storage</span>
                  <span>{cacheStats.cacheSizeUsed}MB / {cacheStats.totalCacheSize}MB</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${cacheUtilization}%` }}></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Request Volume</h3>
                <div className="text-3xl font-bold mb-1">
                  {cacheStats.hitCount + cacheStats.missCount}
                </div>
                <div className="flex text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
                    <span className="text-muted-foreground mr-2">Hits: {cacheStats.hitCount}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-destructive mr-1.5"></div>
                    <span className="text-muted-foreground">Misses: {cacheStats.missCount}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Response Times</h3>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">Cached</span>
                  <span className="text-success">{cacheStats.averageResponseTime}ms</span>
                </div>
                <div className="h-2 bg-secondary rounded-full mb-4">
                  <div className="h-full bg-success rounded-full" style={{ width: "30%" }}></div>
                </div>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">Uncached</span>
                  <span className="text-destructive">{cacheStats.uncachedResponseTime}ms</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className="h-full bg-destructive rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}
