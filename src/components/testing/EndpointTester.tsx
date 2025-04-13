
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { Loader, CheckCircle } from "lucide-react";
import { ApiService } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const endpointSchema = z.object({
  endpoint: z.string().min(1, "Endpoint is required"),
  ttl: z.string().min(1, "TTL is required"),
});

type EndpointFormValues = z.infer<typeof endpointSchema>;

export function EndpointTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [invalidateCache, setInvalidateCache] = useState(false);
  const [result, setResult] = useState<{
    responseTime: number;
    cached: boolean;
    data: any;
  } | null>(null);
  const [previousResults, setPreviousResults] = useState<
    {
      endpoint: string;
      responseTime: number;
      cached: boolean;
      timestamp: Date;
    }[]
  >([]);

  const form = useForm<EndpointFormValues>({
    resolver: zodResolver(endpointSchema),
    defaultValues: {
      endpoint: "/api/data",
      ttl: "3600",
    },
  });

  const onSubmit = async (values: EndpointFormValues) => {
    setIsLoading(true);
    try {
      const response = await ApiService.testEndpoint(values.endpoint, invalidateCache);
      setResult(response);
      
      setPreviousResults((prev) => [
        {
          endpoint: values.endpoint,
          responseTime: response.responseTime,
          cached: response.cached,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep only the last 10 results
      ]);
    } catch (error) {
      console.error("Failed to test endpoint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedEndpoints = [
    { value: "/api/data", label: "Standard Data (1 hour TTL)" },
    { value: "/api/short-lived", label: "Short-lived Data (60s TTL)" },
    { value: "/api/users", label: "Users API" },
    { value: "/api/products", label: "Products API" },
  ];

  const predefinedTtls = [
    { value: "60", label: "60 seconds" },
    { value: "300", label: "5 minutes" },
    { value: "3600", label: "1 hour" },
    { value: "86400", label: "1 day" },
  ];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an endpoint" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {predefinedEndpoints.map((endpoint) => (
                      <SelectItem
                        key={endpoint.value}
                        value={endpoint.value}
                      >
                        {endpoint.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ttl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time To Live (TTL)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select TTL" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {predefinedTtls.map((ttl) => (
                      <SelectItem key={ttl.value} value={ttl.value}>
                        {ttl.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="invalidate-cache"
              checked={invalidateCache}
              onCheckedChange={setInvalidateCache}
            />
            <label htmlFor="invalidate-cache" className="text-sm font-medium">
              Invalidate Cache (Force Refresh)
            </label>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Endpoint"
            )}
          </Button>
        </form>
      </Form>
      
      {result && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Test Result</CardTitle>
              <Badge variant={result.cached ? "success" : "secondary"}>
                {result.cached ? "Cache Hit" : "Cache Miss"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Response Time:</span>
                <span className="font-medium">{result.responseTime} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-1" /> Success
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Response:</span>
                <pre className="mt-1 p-2 bg-secondary rounded-md overflow-auto text-xs max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {previousResults.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Previous Tests</CardTitle>
            <CardDescription>Recent endpoint test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {previousResults.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-secondary rounded-md text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[200px]">{item.endpoint}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{item.responseTime} ms</span>
                    <Badge variant={item.cached ? "success" : "secondary"} className="h-6">
                      {item.cached ? "Hit" : "Miss"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
