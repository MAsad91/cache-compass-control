
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ResponseTimeData } from "@/services/api";
import { useTheme } from "@/providers/ThemeProvider";

interface ResponseTimeChartProps {
  data: ResponseTimeData[];
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Colors for the chart
  const cachedColor = "hsl(var(--success))";
  const uncachedColor = "hsl(var(--accent))";
  const axisColor = isDarkMode ? "#FFFFFF80" : "#33333380";
  const gridColor = isDarkMode ? "#FFFFFF10" : "#33333310";

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>Response Times</CardTitle>
        <CardDescription>
          Cached vs. Non-cached response times in milliseconds
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="timestamp" 
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
            <Line 
              type="monotone" 
              dataKey="cached" 
              name="Cached" 
              stroke={cachedColor} 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="uncached" 
              name="Non-cached" 
              stroke={uncachedColor} 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
