"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart as BarChartIcon } from "lucide-react";
import { Project } from "@/lib/types/project";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  isSameMonth,
} from "date-fns";
import { id } from "date-fns/locale";

interface AnalyticsSectionProps {
  projects: Project[];
}

export function AnalyticsSection({ projects }: AnalyticsSectionProps) {
  const [monthRange, setMonthRange] = useState(6);

  const chartData = useMemo(() => {
    const today = new Date();
    const rangeStartDate = subMonths(today, monthRange - 1);

    const months = eachMonthOfInterval({
      start: startOfMonth(rangeStartDate),
      end: endOfMonth(today),
    });

    return months.map((month) => {
      const monthProjects = projects.filter((project) => {
        const projectDate = new Date(project.createdAt);
        return isSameMonth(projectDate, month);
      });

      const total = monthProjects.length;
      const completed = monthProjects.filter((p) => p.status === "Done").length;

      return {
        name: format(month, "MMM", { locale: id }),
        fullName: format(month, "MMMM yyyy", { locale: id }),
        total,
        completed,
      };
    });
  }, [projects, monthRange]);

  const rangeOptions = [
    { label: "3 Bulan", value: 3 },
    { label: "6 Bulan", value: 6 },
    { label: "1 Tahun", value: 12 },
  ];

  return (
    <Card className="h-[400px] flex flex-col shadow-xl shadow-foreground/[0.03] border border-border bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden">
      <CardHeader className="flex-none p-4 sm:p-6 pb-2 sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
            <BarChartIcon className="w-4 h-4 text-primary" />
            Statistik Proyek
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Aktivitas pembuatan dan penyelesaian proyek
          </p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg">
          {rangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={monthRange === option.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMonthRange(option.value)}
              className="h-7 text-xs px-3 rounded-md transition-all font-semibold"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 sm:p-6 min-h-0">
        {projects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <div className="p-4 rounded-full bg-muted/30">
              <BarChartIcon className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">Belum ada data visual</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-5)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-5)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-popover/90 backdrop-blur-md border border-border rounded-lg shadow-xl outline-none">
                        <p className="text-xs font-bold mb-2 text-foreground">
                          {data.fullName}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-muted-foreground">
                              Total:
                            </span>
                            <span className="font-bold tabular-nums text-foreground">
                              {data.total}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-[var(--chart-5)]" />
                            <span className="text-muted-foreground">
                              Selesai:
                            </span>
                            <span className="font-bold tabular-nums text-foreground">
                              {data.completed}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--chart-1)"
                fill="url(#fillTotal)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="var(--chart-5)"
                fill="url(#fillCompleted)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
