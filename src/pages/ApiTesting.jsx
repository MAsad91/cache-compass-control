
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ApiTesting() {
  const isMobile = useIsMobile();
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [headers, setHeaders] = useState("");
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [cachedResponse, setCachedResponse] = useState(null);

  const handleTest = async () => {
    if (!endpoint) {
      toast.error("Please enter an endpoint URL");
      return;
    }

    setIsLoading(true);
    try {
      // Mock API request logic
      // In a real application, this would actually send the request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-response-time": "125ms",
          "cache-control": "max-age=3600"
        },
        data: {
          success: true,
          message: "This is a sample response",
          timestamp: new Date().toISOString()
        }
      };
      
      setResponse(mockResponse);
      
      if (cacheEnabled) {
        // Mock cached response with faster response time
        setCachedResponse({
          ...mockResponse,
          headers: {
            ...mockResponse.headers,
            "x-response-time": "15ms",
            "x-cache-status": "HIT"
          }
        });
      }
      
      toast.success("Request completed successfully");
    } catch (error) {
      toast.error(`Error: ${error.message || "Failed to complete request"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResponse(null);
    setCachedResponse(null);
    toast.info("Response cleared");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Testing</h1>
        <p className="text-muted-foreground">
          Test API endpoints with and without caching to compare performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Configuration</CardTitle>
            <CardDescription>Enter API endpoint and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input 
                id="endpoint"
                placeholder="https://api.example.com/data"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">HTTP Method</Label>
                <select 
                  id="method" 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cache">Caching</Label>
                <select 
                  id="cache" 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={cacheEnabled ? "enabled" : "disabled"}
                  onChange={(e) => setCacheEnabled(e.target.value === "enabled")}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="headers">Headers (JSON)</Label>
              <Textarea 
                id="headers"
                placeholder='{"Content-Type": "application/json"}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea 
                id="body"
                placeholder='{"key": "value"}'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                disabled={method === "GET"}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleClear}>Clear</Button>
              <Button onClick={handleTest} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Endpoint"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className={`${isMobile ? "mt-6" : ""}`}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>API response details</CardDescription>
            </CardHeader>
            <CardContent>
              {!response && !cachedResponse ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No results yet. Send a request to see the response.</p>
                </div>
              ) : (
                <Tabs defaultValue="uncached" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="uncached">Uncached</TabsTrigger>
                    <TabsTrigger value="cached" disabled={!cachedResponse}>Cached</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="uncached" className="mt-4">
                    {response && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">Status:</span> 
                            <span className="ml-2 text-green-500">{response.status} {response.statusText}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Time:</span>
                            <span className="ml-2 text-orange-500">{response.headers["x-response-time"]}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Headers</h4>
                          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                            {JSON.stringify(response.headers, null, 2)}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Response Body</h4>
                          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                            {JSON.stringify(response.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="cached" className="mt-4">
                    {cachedResponse && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold">Status:</span>
                            <span className="ml-2 text-green-500">{cachedResponse.status} {cachedResponse.statusText}</span>
                          </div>
                          <div>
                            <span className="font-semibold">Time:</span>
                            <span className="ml-2 text-green-500">{cachedResponse.headers["x-response-time"]}</span>
                          </div>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 text-sm">
                          <span className="font-medium text-green-500">Cache Status:</span>
                          <span className="ml-2">{cachedResponse.headers["x-cache-status"]}</span>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Headers</h4>
                          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                            {JSON.stringify(cachedResponse.headers, null, 2)}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Response Body</h4>
                          <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                            {JSON.stringify(cachedResponse.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
