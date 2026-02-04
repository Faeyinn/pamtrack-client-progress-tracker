import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  User,
  Clock,
  CheckCircle2,
  CircleDashed,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectHeaderCardProps {
  project?: Project | null;
  latestProgress?: number;
  isLoading?: boolean;
  latestLogTitle?: string;
}

export function ProjectHeaderCard({
  project,
  latestProgress = 0,
  isLoading = false,
  latestLogTitle = "Belum Ada Aktivitas",
}: ProjectHeaderCardProps) {
  if (isLoading || !project) {
    return (
      <Card className="border border-border/50 shadow-sm bg-card overflow-hidden">
        <div className="h-2 bg-muted w-full animate-pulse" />
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="space-y-2 w-full max-w-lg">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="flex flex-col items-end justify-center bg-muted px-5 py-3 rounded-xl border border-border/50 min-w-[140px]">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const isDone = project.status === "Done";
  const isMaintenance = project.currentPhase === "MAINTENANCE";

  const displayProgress = isMaintenance ? 100 : latestProgress;
  const healthScore = project.maintenanceProgress || 100;

  return (
    <Card className="relative overflow-hidden bg-background/40 backdrop-blur-2xl border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-primary/10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none" />

      <div
        className={cn(
          "h-1.5 w-full opacity-90 transition-all duration-700",
          isMaintenance
            ? "bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]"
            : "bg-foreground shadow-[0_0_20px_rgba(0,0,0,0.1)]",
        )}
      />

      <CardHeader className="pb-10 pt-8 px-8 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 mb-12">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                  isDone || isMaintenance
                    ? "bg-foreground text-background border-foreground shadow-2xl shadow-foreground/20"
                    : "bg-background/50 backdrop-blur-md text-foreground border-border/40 shadow-sm",
                )}
              >
                {isMaintenance ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
                {isMaintenance
                  ? "Fase: Maintenance"
                  : `Status: ${project.status}`}
              </Badge>
              <div className="px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                ID PROYEK: {project.id.slice(0, 8)}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground tracking-tighter uppercase leading-[0.9] transition-all">
                {project.projectName}
                <span className="text-primary">.</span>
              </h2>
              <div className="flex items-center gap-4 text-muted-foreground group/client">
                <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/5 transition-colors group-hover/client:bg-foreground group-hover/client:text-background duration-500">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                    Partner Klien
                  </span>
                  <span className="text-lg font-black tracking-tight uppercase text-foreground/80">
                    {project.clientName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Progress Meter */}
          <div
            className={cn(
              "relative flex flex-col items-center lg:items-end justify-center p-8 rounded-[2.5rem] min-w-[220px] group/meter transition-all duration-700 hover:scale-[1.05] overflow-hidden",
              isMaintenance ? "bg-foreground" : "bg-foreground",
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-20" />

            <div className="relative z-10 flex flex-col items-center lg:items-end w-full">
              <span className="text-[10px] font-black text-background/60 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                {isMaintenance ? (
                  <Activity className="w-3.5 h-3.5 text-background/80" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-background/80 animate-pulse" />
                )}
                {isMaintenance ? "Stabilitas Layanan" : "Total Progres"}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-7xl font-black tracking-tighter text-background leading-none">
                  {isMaintenance ? healthScore : displayProgress}
                </span>
                <span className="text-2xl font-black text-background/90">
                  %
                </span>
              </div>
            </div>

            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/meter:translate-x-full transition-transform duration-1000" />
          </div>
        </div>

        <div className="bg-foreground/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-border/40 relative overflow-hidden group/target">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border/40 shadow-2xl shadow-foreground/5 flex items-center justify-center transition-transform duration-500 group-hover/target:rotate-6">
                <Calendar className="w-8 h-8 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
                  {isMaintenance ? "Layanan Aktif" : "Target Strategis"}
                </p>
                <p className="text-xl font-black text-foreground uppercase tracking-tight">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {isMaintenance ? (
                <div className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                  <ShieldCheck className="w-4 h-4" />
                  {isMaintenance
                    ? "Sistem Dalam Pemeliharaan"
                    : "Status: " + project.status}
                </div>
              ) : (
                daysUntilDeadline > 0 &&
                !isDone && (
                  <div className="flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-foreground/20">
                    <Clock className="w-4 h-4" />
                    {daysUntilDeadline} Hari
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-end px-1">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] block">
                  Aktivitas Terakhir
                </span>
                <span className="text-xs font-black text-foreground uppercase tracking-widest line-clamp-1">
                  {latestLogTitle}
                </span>
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                {isMaintenance ? "Statistik Sistem" : "Target Rilis"}
              </span>
            </div>
            <div className="relative w-full bg-foreground/5 rounded-full h-5 overflow-hidden border border-border/20 p-1">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out shadow-lg",
                  isMaintenance ? "bg-primary" : "bg-foreground",
                )}
                style={{
                  width: `${isMaintenance ? healthScore : displayProgress}%`,
                }}
              >
                <div
                  className="w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                  style={{ backgroundSize: "200% 100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
