
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/providers/ThemeProvider";

interface TestResult {
  endpoint: string;
  responseTime: number;
  cached: boolean;
  timestamp: Date;
}

interface ChartData {
  endpoint: string;
  cached: number;
  uncached: number;
}

interface ResponseComparisonChartProps {
  results: TestResult[];
}

export function ResponseComparisonChart({ results }: ResponseComparisonChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (results.length === 0) return;
    
    // Process data for the chart
    const endpointMap = new Map<string, { cached: number[], uncached: number[] }>();
    
    results.forEach((result) => {
      if (!endpointMap.has(result.endpoint)) {
        endpointMap.set(result.endpoint, { cached: [], uncached: [] });
      }
      
      const entry = endpointMap.get(result.endpoint)!;
      if (result.cached) {
        entry.cached.push(result.responseTime);
      } else {
        entry.uncached.push(result.responseTime);
      }
    });
    
    const newChartData: ChartData[] = [];
    
    endpointMap.forEach((value, key) => {
      const cachedAvg = value.cached.length > 0
        ? Math.round(value.cached.reduce((sum, val) => sum + val, 0) / value.cached.length)
        : 0;
      
      const uncachedAvg = value.uncached.length > 0
        ? Math.round(value.uncached.reduce((sum, val) => sum + val, 0) / value.uncached.length)
        : 0;
      
      newChartData.push({
        endpoint: key.split('/').pop() || key, // Just get the last part of the path for display
        cached: cachedAvg,
        uncached: uncachedAvg,
      });
    });
    
    setChartData(newChartData);
  }, [results]);

  // Colors for the chart
  const cachedColor = "hsl(var(--success))";
  const uncachedColor = "hsl(var(--accent))";
  const axisColor = isDarkMode ? "#FFFFFF80" : "#33333380";
  const gridColor = isDarkMode ? "#FFFFFF10" : "#33333310";

  if (chartData.length === 0) {
    return (
      <Card className="h-[300px]">
        <CardHeader>
          <CardTitle>Response Time Comparison</CardTitle>
          <CardDescription>
            No data available. Run some tests to see comparisons.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[220px] text-muted-foreground">
          Test endpoints to generate comparison data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Response Time Comparison</CardTitle>
        <CardDescription>
          Cached vs. Non-cached response times by endpoint
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="endpoint" 
              stroke={axisColor}
              tick={{ fill: axisColor }}
            />
            <YAxis 
              stroke={axisColor}
              tick={{ fill: axisColor }}
              label={{ 
                value: "Response Time (ms)", 
                angle: -90, 
                position: "insideLeft",
                style: { textAnchor: "middle", fill: axisColor } 
              }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'white', 
                borderColor: 'hsl(var(--border))' 
              }}
              labelStyle={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}
            />
            <Legend 
              formatter={(value) => <span style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}>{value}</span>}
            />
            <Bar 
              dataKey="cached" 
              name="Cached" 
              fill={cachedColor} 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="uncached" 
              name="Non-cached" 
              fill={uncachedColor} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
