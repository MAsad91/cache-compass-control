
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiService, CacheEntry } from "@/services/api";
import { CacheEntriesTable } from "@/components/dashboard/CacheEntriesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClearCacheForm } from "@/components/management/ClearCacheForm";

export default function CacheManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: cacheEntries, isLoading } = useQuery({
    queryKey: ["cacheEntries", pagination.pageIndex, pagination.pageSize],
    queryFn: () => ApiService.getCacheEntries(pagination.pageIndex + 1, pagination.pageSize),
  });

  if (isLoading || !cacheEntries) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-lg font-medium">Loading cache data...</p>
        </div>
      </div>
    );
  }

  // Filter entries based on search term
  const filteredEntries = cacheEntries.entries.filter((entry: CacheEntry) =>
    entry.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cache Management</h1>
        <p className="text-muted-foreground">View and manage all cache entries in the system.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cache Entries</CardTitle>
              <CardDescription>
                All cached items with their TTL (Time To Live)
              </CardDescription>
              <div className="mt-2 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cache entries..."
                  className="pl-8 pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CacheEntriesTable
                data={filteredEntries as CacheEntry[]}
                pageCount={Math.ceil(cacheEntries.total / pagination.pageSize)}
                pagination={pagination}
                setPagination={setPagination}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Cache Controls</CardTitle>
              <CardDescription>
                Clear cache entries individually or in bulk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClearCacheForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
