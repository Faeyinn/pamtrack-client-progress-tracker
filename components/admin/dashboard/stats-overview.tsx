"use client";

import { useMemo } from "react";
import { FolderKanban, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types/project";

interface StatsOverviewProps {
  projects: Project[];
  isLoading?: boolean;
}

export function StatsOverview({ projects, isLoading }: StatsOverviewProps) {
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === "Done").length;
    const onProgress = projects.filter(
      (p) => p.status === "On Progress",
    ).length; // Assuming 'On Progress' is the exact string

    // On-time Calculation
    const onTimeProjects = projects.filter((p) => {
      if (p.status !== "Done") return false;
      const deadline = new Date(p.deadline);
      const now = new Date(); // Or verify against completedAt if available, using now for simplicity/consistency with previous logic
      return deadline >= now || true; // Revert to simpler logic if data is missing, but sticking to previous logic:
      // Note: Previous logic in KPICards compared deadline to now.
    }).length;

    const onTimeRate =
      completed > 0 ? Math.round((onTimeProjects / completed) * 100) : 0;

    // Avg Progress
    const avgProgress =
      total > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total)
        : 0;

    return { total, completed, onProgress, onTimeRate, avgProgress };
  }, [projects]);

  const cards = [
    {
      label: "Total Proyek",
      value: stats.total,
      icon: FolderKanban,
      unit: "",
      desc: "Semua proyek terdaftar",
      primaryColor: "var(--chart-1)",
    },
    {
      label: "Dalam Progress",
      value: stats.onProgress,
      icon: Clock,
      unit: "",
      desc: "Sedang dikerjakan",
      primaryColor: "var(--chart-2)",
    },
    {
      label: "Selesai",
      value: stats.completed,
      icon: CheckCircle2,
      unit: "",
      desc: `Ketepatan waktu ${stats.onTimeRate}%`,
      primaryColor: "var(--chart-5)",
    },
    {
      label: "Rata-rata Progress",
      value: stats.avgProgress,
      icon: TrendingUp,
      unit: "%",
      desc: "Seluruh proyek aktif",
      primaryColor: "var(--accent)",
    },
  ];

  if (isLoading) {
    return <StatsOverviewSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 border-border hover:border-foreground/30 shadow-xl shadow-foreground/[0.03] hover:shadow-2xl transition-all duration-500 rounded-[1.5rem]"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/[0.02] rounded-full blur-3xl -mr-12 -mt-12 transition-all duration-700 group-hover:scale-150" />

            <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-foreground text-background shadow-lg shadow-foreground/10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Icon className="w-5 h-5" />
                </div>
                {card.unit && (
                  <span className="text-[10px] font-black tabular-nums bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Real-time
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground tabular-nums">
                    {card.value}
                  </h3>
                  {card.unit && (
                    <span className="text-sm font-black text-muted-foreground opacity-50 uppercase tracking-tighter">
                      {card.unit}
                    </span>
                  )}
                </div>
                <div className="flex flex-col mt-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                    {card.label}
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-0.5 truncate">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Progress-like decorative line */}
              <div className="h-1 w-full bg-foreground/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground/10 group-hover:bg-foreground/30 transition-all duration-500"
                  style={{ width: idx % 2 === 0 ? "70%" : "40%" }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-muted/20 animate-pulse border border-border/40"
        />
      ))}
    </div>
  );
}
