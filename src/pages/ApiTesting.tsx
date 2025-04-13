
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EndpointTester } from "@/components/testing/EndpointTester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponseComparisonChart } from "@/components/testing/ResponseComparisonChart";

interface TestResult {
  endpoint: string;
  responseTime: number;
  cached: boolean;
  timestamp: Date;
}

export default function ApiTesting() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // This would be implemented to receive test results from the EndpointTester component
  const handleTestResult = (result: TestResult) => {
    setTestResults((prev) => [result, ...prev]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Testing</h1>
        <p className="text-muted-foreground">
          Test API endpoints with different TTLs and compare cached vs. non-cached responses.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Endpoint</CardTitle>
            <CardDescription>
              Configure and test API endpoints with different settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EndpointTester />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ResponseComparisonChart results={testResults} />
          
          <Card>
            <CardHeader>
              <CardTitle>Testing Documentation</CardTitle>
              <CardDescription>
                How to effectively test your API caching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="instructions">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">How to test caching:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Select an API endpoint to test</li>
                      <li>Choose an appropriate TTL (Time To Live)</li>
                      <li>Run the test multiple times to see caching effects</li>
                      <li>Toggle "Invalidate Cache" to force a cache miss</li>
                      <li>Compare response times between cached and non-cached requests</li>
                    </ol>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Example test cases:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Standard endpoint with 1-hour TTL</li>
                      <li>Time-sensitive data with 60-second TTL</li>
                      <li>High-traffic endpoints with 5-minute TTL</li>
                      <li>User-specific data with pattern-based invalidation</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Performance tips:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Choose TTL based on data volatility</li>
                      <li>Use shorter TTLs for frequently changing data</li>
                      <li>Use pattern-based invalidation for related data</li>
                      <li>Monitor hit/miss ratios to optimize TTLs</li>
                      <li>Consider staggered cache expiration for high-traffic APIs</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
