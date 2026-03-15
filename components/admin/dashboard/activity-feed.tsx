"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Clock,
  FolderPlus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProjectLog {
  id: string;
  projectId: string;
  title: string;
  description: string;
  percentage: number;
  createdAt: string;
  project: {
    projectName: string;
    clientName: string;
    status: string;
  };
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ProjectLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activities");
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const getActivityConfig = (log: ProjectLog) => {
    if (log.percentage === 100) {
      return {
        icon: CheckCircle2,
        actionText: "menyelesaikan proyek",
        colorClass: "text-chart-5 group-hover:text-chart-5",
        bgClass: "group-hover:border-chart-5/30",
        message: "Menyelesaikan proyek",
      };
    } else if (log.percentage > 0) {
      return {
        icon: Edit,
        actionText: "memperbarui progress",
        colorClass: "group-hover:text-primary",
        bgClass: "group-hover:border-primary/30",
        message: `Update progress ${log.percentage}%`,
      };
    } else {
      return {
        icon: FileText,
        actionText: "menambahkan catatan",
        colorClass: "group-hover:text-blue-500",
        bgClass: "group-hover:border-blue-500/30",
        message: "Menambahkan catatan baru",
      };
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg shadow-foreground/[0.03] border border-border/60 bg-card/75 backdrop-blur-md rounded-[2rem] overflow-hidden">
      <CardHeader className="flex-none p-6 sm:p-8 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm font-semibold tracking-[0.14em] text-foreground/80 font-[family:var(--font-display)]">
              Aktivitas
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.14em] text-emerald-600">
              Aktif
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0 overflow-hidden flex flex-col pt-6">
        <div className="overflow-y-auto flex-1 px-6 sm:px-8 pb-6 space-y-8 custom-scrollbar">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-0.5 h-full mt-3 opacity-20" />
                </div>
                <div className="space-y-3 flex-1 pt-1">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-16 w-full rounded-2xl opacity-50" />
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center space-y-4 py-20">
              <div className="w-20 h-20 rounded-[2rem] bg-muted/20 flex items-center justify-center shadow-inner">
                <Clock className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-[11px] font-semibold tracking-[0.16em] opacity-40">
                Belum ada aktivitas
              </p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const isLast = index === activities.length - 1;
              const config = getActivityConfig(activity);
              const Icon = config.icon;

              return (
                <div 
                  key={activity.id} 
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="flex gap-5 group relative"
                >
                  {/* Timeline Line - Premium Gradient */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-2xl transition-colors transition-shadow duration-500 z-10",
                        "bg-background border-2 border-border group-hover:border-foreground group-hover:bg-foreground group-hover:text-background",
                        activity.percentage === 100 &&
                          "bg-emerald-500 border-emerald-500 text-white group-hover:bg-emerald-600",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "w-[2px] h-full bg-gradient-to-b from-border/50 via-border/20 to-transparent mt-3 mb-1",
                          "group-hover:from-foreground/20",
                        )}
                      />
                    )}
                  </div>

                  <div className="pb-4 min-w-0 flex-1">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-foreground/90 leading-tight">
                        <span className="font-semibold text-foreground tracking-[0.16em] block mb-1 opacity-40 text-[11px]">
                          {config.message}
                        </span>
                        <span className="font-semibold tracking-tight group-hover:text-primary transition-colors cursor-pointer">
                          {activity.project.projectName}
                        </span>
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-muted-foreground/70 font-semibold tracking-[0.14em] flex items-center gap-1.5">
                          <Clock className="w-3 h-3 opacity-40" />
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                      </div>
                    </div>

                    {(activity.title || activity.description) && (
                      <div className="mt-4 text-[12px] text-muted-foreground bg-foreground/[0.03] p-4 rounded-2xl border border-foreground/[0.05] group-hover:border-foreground/10 transition-colors transition-shadow duration-500 hover:bg-background hover:shadow-xl shadow-foreground/[0.02]">
                        <p className="font-semibold text-foreground tracking-tight mb-1">
                          {activity.title}
                        </p>
                        <p className="line-clamp-2 leading-relaxed font-normal opacity-70 italic">
                          &quot;{activity.description}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
