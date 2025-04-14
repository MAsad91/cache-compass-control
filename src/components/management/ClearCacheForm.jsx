
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiService } from "@/services/api";
import { toast } from "sonner";

const clearCacheSchema = z.object({
  pattern: z.string().min(2, {
    message: "Pattern must be at least 2 characters long",
  }),
});

export function ClearCacheForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(clearCacheSchema),
    defaultValues: {
      pattern: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await ApiService.clearCacheByPattern(values.pattern);
      form.reset();
      toast.success(`Cache entries matching '${values.pattern}' cleared successfully`);
    } catch (error) {
      console.error("Failed to clear cache by pattern:", error);
      toast.error("Failed to clear cache entries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    setIsLoading(true);
    try {
      await ApiService.clearAllCache();
      toast.success("All cache entries cleared successfully");
    } catch (error) {
      console.error("Failed to clear all cache:", error);
      toast.error("Failed to clear all cache entries");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pattern-based Clearing</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter pattern (e.g., /api/users/*)" 
                      {...field} 
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                      Clear Matching
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex flex-col space-y-2">
        <Button onClick={handleClearAll} variant="destructive" disabled={isLoading}>
          Clear All Cache
        </Button>
        <p className="text-xs text-muted-foreground">
          Warning: This will clear all cache entries across the system.
        </p>
      </div>
    </div>
  );
}
