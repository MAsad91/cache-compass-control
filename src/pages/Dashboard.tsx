
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Clock, Database, Award, Activity } from "lucide-react";
import { ApiService, CacheEntry, DashboardStats } from "@/services/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CacheHitRatioChart } from "@/components/dashboard/CacheHitRatioChart";
import { ResponseTimeChart } from "@/components/dashboard/ResponseTimeChart";
import { MemoryUsageCard } from "@/components/dashboard/MemoryUsageCard";
import { CacheEntriesTable } from "@/components/dashboard/CacheEntriesTable";

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export default function Dashboard() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => ApiService.getDashboardStats(),
  });
  
  const { data: cacheEntries, isLoading: isLoadingEntries } = useQuery({
    queryKey: ["cacheEntries", pagination.pageIndex, pagination.pageSize],
    queryFn: () => ApiService.getCacheEntries(pagination.pageIndex + 1, pagination.pageSize),
  });

  if (isLoadingStats || isLoadingEntries || !dashboardStats || !cacheEntries) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-lg font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your cache system's performance in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Cache Hit Ratio"
          value={`${(dashboardStats.cacheStats.hitRatio * 100).toFixed(1)}%`}
          icon={<Award className="h-4 w-4" />}
          description={`${dashboardStats.cacheStats.totalHits.toLocaleString()} hits / ${dashboardStats.cacheStats.totalMisses.toLocaleString()} misses`}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Total Cached Items"
          value={dashboardStats.cacheStats.totalEntries.toLocaleString()}
          icon={<Database className="h-4 w-4" />}
          description="Active cache entries"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Avg. Response Time"
          value={`${dashboardStats.responseTimes[dashboardStats.responseTimes.length - 1].cached}ms`}
          icon={<Activity className="h-4 w-4" />}
          description="For cached responses"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="System Uptime"
          value={formatUptime(dashboardStats.cacheStats.uptime)}
          icon={<Clock className="h-4 w-4" />}
          description="Since last restart"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CacheHitRatioChart cacheStats={dashboardStats.cacheStats} />
        <ResponseTimeChart data={dashboardStats.responseTimes} />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <MemoryUsageCard cacheStats={dashboardStats.cacheStats} />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Cache Entries</h2>
        <CacheEntriesTable 
          data={(cacheEntries.entries as CacheEntry[])} 
          pageCount={Math.ceil(cacheEntries.total / pagination.pageSize)}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
}
