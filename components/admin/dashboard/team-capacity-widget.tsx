"use client";

import { useMemo } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle } from "lucide-react";
import {
  CursorCard,
  CursorCardsContainer,
} from "@/components/anim/cursor-cards";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface TeamCapacityWidgetProps {
  projects: Project[];
}

export function TeamCapacityWidget({ projects }: TeamCapacityWidgetProps) {
  const capacityMetrics = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "On Progress");
    const totalCapacity = 100; // Assume team has 100% capacity
    const usedCapacity =
      activeProjects.length * (totalCapacity / Math.max(projects.length, 1));
    const utilizationRate =
      projects.length > 0 ? (activeProjects.length / projects.length) * 100 : 0;

    // Estimate based on average progress
    const avgProgressOfActive =
      activeProjects.length > 0
        ? activeProjects.reduce((sum, p) => sum + p.progress, 0) /
          activeProjects.length
        : 0;

    const workloadLevel =
      utilizationRate > 80
        ? "critical"
        : utilizationRate > 60
          ? "high"
          : "normal";

    return {
      activeProjects: activeProjects.length,
      totalProjects: projects.length,
      utilizationRate: Math.round(utilizationRate),
      avgProgressOfActive: Math.round(avgProgressOfActive),
      workloadLevel,
    };
  }, [projects]);

  const getWorkloadColor = (level: string) => {
    return "bg-card";
  };

  const getWorkloadIcon = (level: string) => {
    return "text-muted-foreground";
  };

  const getWorkloadLabel = (level: string) => {
    switch (level) {
      case "critical":
        return "Sangat Tinggi";
      case "high":
        return "Tinggi";
      default:
        return "Normal";
    }
  };

  return (
    <CursorCardsContainer>
      <CursorCard
        surfaceClassName="bg-card dark:bg-card"
        className="rounded-[1.5rem] shadow-lg shadow-accent/10 dark:shadow-none h-full"
        primaryHue="oklch(0.78 0.05 158)" // Pale Sage
        secondaryHue="oklch(0.82 0.06 155)" // Baby Green
        borderColor="oklch(0.94 0.01 155)" // Barely visible border
        illuminationColor="oklch(0.82 0.06 155 / 0.2)" // Baby Green glow
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-black tracking-tight uppercase text-foreground">
                  Kapasitas Tim
                </CardTitle>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  {getWorkloadLabel(capacityMetrics.workloadLevel)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Utilization Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Utilisasi Kapasitas
              </label>
              <span className="text-2xl font-black text-foreground">
                {capacityMetrics.utilizationRate}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-700 ease-out rounded-full"
                style={{
                  background:
                    capacityMetrics.workloadLevel === "critical"
                      ? "oklch(0.50 0.20 25)" // Destructive red
                      : capacityMetrics.workloadLevel === "high"
                        ? "oklch(0.72 0.15 85)" // Gold warning
                        : "oklch(0.82 0.06 155)", // Baby Green
                  width: `${capacityMetrics.utilizationRate}%`,
                }}
              />
            </div>
          </div>

          {/* Project Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Proyek Aktif
              </p>
              <p className="text-2xl font-black text-foreground">
                {capacityMetrics.activeProjects}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                dari {capacityMetrics.totalProjects}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Progress Rata-rata
              </p>
              <p className="text-2xl font-black text-foreground">
                {capacityMetrics.avgProgressOfActive}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">proyek aktif</p>
            </div>
          </div>

          {/* Workload Recommendation */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground mb-1">
                  {capacityMetrics.workloadLevel === "critical"
                    ? "Status: Kapasitas Penuh"
                    : capacityMetrics.workloadLevel === "high"
                      ? "Status: Kapasitas Tinggi"
                      : "Status: Kapasitas Optimal"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {capacityMetrics.workloadLevel === "critical"
                    ? "Tim sedang menangani proyek mendekati kapasitas maksimal. Sebaiknya tunda proyek baru atau tambahkan tim."
                    : capacityMetrics.workloadLevel === "high"
                      ? "Tim sedang sibuk dengan proyek aktif. Pantau progress dengan lebih ketat."
                      : "Tim memiliki kapasitas yang cukup. Dapat menerima proyek baru."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </CursorCard>
    </CursorCardsContainer>
  );
}
