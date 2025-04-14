
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "@/providers/ThemeProvider";

export function CacheHitRatioChart({ cacheStats }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const data = [
    { name: "Cache Hits", value: cacheStats.hitRatio * 100 },
    { name: "Cache Misses", value: cacheStats.missRatio * 100 },
  ];

  // Colors for light/dark mode
  const COLORS = isDarkMode 
    ? ["hsl(var(--success))", "hsl(var(--destructive))"]
    : ["hsl(var(--success))", "hsl(var(--destructive))"];

  const LABEL_COLORS = isDarkMode
    ? "#FFFFFF"
    : "#333333";

  return (
    <Card className="h-[350px]">
      <CardHeader>
        <CardTitle>Cache Hit/Miss Ratio</CardTitle>
        <CardDescription>
          Performance of the cache system
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value.toFixed(1)}%`, "Percentage"]}
              contentStyle={{ 
                backgroundColor: isDarkMode ? 'hsl(var(--card))' : 'white', 
                borderColor: 'hsl(var(--border))' 
              }}
              labelStyle={{ color: LABEL_COLORS }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              layout="horizontal" 
              formatter={(value) => <span style={{ color: LABEL_COLORS }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
