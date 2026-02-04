"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
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

interface VelocityTrendProps {
  projects: Project[];
}

export function VelocityTrend({ projects }: VelocityTrendProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 5);

    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(today),
    });

    return months.map((month) => {
      const monthProjects = projects.filter((project) => {
        const projectDate = new Date(project.createdAt);
        return isSameMonth(projectDate, month);
      });

      // Velocity: projects completed in this month
      const velocity = monthProjects.filter((p) => p.status === "Done").length;

      // Average progress of projects created this month
      const avgProgress =
        monthProjects.length > 0
          ? Math.round(
              monthProjects.reduce((sum, p) => sum + p.progress, 0) /
                monthProjects.length,
            )
          : 0;

      return {
        name: format(month, "MMM", { locale: id }),
        fullName: format(month, "MMMM yyyy", { locale: id }),
        velocity,
        avgProgress,
      };
    });
  }, [projects]);

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-card dark:bg-card"
        className="rounded-[1.5rem] shadow-lg shadow-accent/10 dark:shadow-none"
        primaryHue="oklch(0.78 0.05 158)" // Pale Sage
        secondaryHue="oklch(0.82 0.06 155)" // Baby Green
        borderColor="oklch(0.94 0.01 155)" // Barely visible border
        illuminationColor="oklch(0.82 0.06 155 / 0.2)" // Baby Green glow
      >
        <CardHeader className="pt-4 pb-4">
          <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
            Tren Produktivitas
          </CardTitle>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
            Kecepatan Penyelesaian vs Rata-rata Progress
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorVelocity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.82 0.06 155)"
                      stopOpacity={0.7}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.82 0.06 155)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(0.45 0.02 155)"
                  opacity={0.15}
                />
                <XAxis
                  dataKey="name"
                  stroke="oklch(0.45 0.02 155)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  stroke="oklch(0.45 0.02 155)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataItem = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl">
                          <p className="text-xs font-bold text-foreground mb-3 opacity-70">
                            {dataItem.fullName}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-accent/80 font-bold tracking-wide">
                                Velocity
                              </span>
                              <span className="text-xl font-black text-accent">
                                {payload[0].value} proj
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-chart-5/80 font-bold tracking-wide">
                                Avg Progress
                              </span>
                              <span className="text-xl font-black text-chart-5">
                                {payload[1].value}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  stroke="oklch(0.82 0.06 155)"
                  fill="url(#colorVelocity)"
                  dot={{ r: 4, fill: "oklch(0.82 0.06 155)" }}
                  activeDot={{ r: 6, fill: "oklch(0.82 0.06 155)" }}
                  name="Kecepatan Penyelesaian"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="avgProgress"
                  stroke="oklch(0.72 0.15 85)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "oklch(0.72 0.15 85)" }}
                  activeDot={{ r: 6, fill: "oklch(0.72 0.15 85)" }}
                  name="Rata-rata Progress (%)"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
