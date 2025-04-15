
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ApiService } from "@/services/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ClearCacheForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [cachePattern, setCachePattern] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClearPattern = async () => {
    if (!cachePattern) {
      toast.error("Please enter a cache key pattern");
      return;
    }

    setIsLoading(true);
    try {
      // Here we'd actually call the API to clear the cache by pattern
      await ApiService.clearCacheByPattern(cachePattern);
      toast.success(`Cache entries matching "${cachePattern}" cleared`);
      setCachePattern("");
    } catch (error) {
      toast.error("Failed to clear cache: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    setIsLoading(true);
    try {
      // Here we'd actually call the API to clear all cache
      await ApiService.clearAllCache();
      toast.success("All cache entries cleared");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to clear all cache: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pattern">Clear by Pattern</Label>
        <div className="flex gap-2">
          <Input
            id="pattern"
            placeholder="user:*"
            value={cachePattern}
            onChange={(e) => setCachePattern(e.target.value)}
            disabled={isLoading}
          />
          <Button
            onClick={handleClearPattern}
            disabled={isLoading}
            size="sm"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Clear
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use wildcards like * to match multiple keys
        </p>
      </div>

      <div className="border-t pt-6">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Cache
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Clear All Cache
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                cached data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
