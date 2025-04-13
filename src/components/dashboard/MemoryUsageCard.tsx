
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CacheStats } from "@/services/api";

interface MemoryUsageCardProps {
  cacheStats: CacheStats;
}

export function MemoryUsageCard({ cacheStats }: MemoryUsageCardProps) {
  const usagePercentage = (cacheStats.memoryUsage / cacheStats.memoryLimit) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Usage</CardTitle>
        <CardDescription>
          Current cache memory consumption
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{cacheStats.memoryUsage} MB of {cacheStats.memoryLimit} MB</span>
            <span className="text-sm font-medium">{Math.round(usagePercentage)}%</span>
          </div>
          
          <Progress
            value={usagePercentage}
            className="h-2"
            aria-label="Memory usage"
          />
          
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Total Entries</p>
              <p className="font-medium">{cacheStats.totalEntries.toLocaleString()}</p>
            </div>
            <div className="rounded-md bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Cache Hits</p>
              <p className="font-medium">{cacheStats.totalHits.toLocaleString()}</p>
            </div>
            <div className="rounded-md bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Cache Misses</p>
              <p className="font-medium">{cacheStats.totalMisses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
