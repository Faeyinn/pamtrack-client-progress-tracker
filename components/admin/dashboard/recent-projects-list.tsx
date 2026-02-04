"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface RecentProjectsListProps {
  projects: Project[];
  isLoading: boolean;
}

export function RecentProjectsList({
  projects,
  isLoading,
}: RecentProjectsListProps) {
  const recentProjects = projects.slice(0, 5);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-chart-5/15 text-chart-5 border-chart-5/20";
      case "On Progress":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-xl shadow-foreground/[0.03] border border-border bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden">
      <CardHeader className="flex-none p-6 sm:p-8 pb-4 flex flex-row items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <FolderKanban className="w-4 h-4" />
          </div>
          <CardTitle className="text-sm font-black tracking-widest uppercase text-foreground/80">
            Proyek Terbaru
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-9 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all rounded-xl"
        >
          <Link href="/admin/projects">
            Semua <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 space-y-3 pr-2 custom-scrollbar">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-2xl bg-muted/20 animate-pulse border border-transparent"
              >
                <div className="w-12 h-12 rounded-xl bg-muted/40" />
                <div className="space-y-3 flex-1 pt-1">
                  <div className="h-4 w-1/2 bg-muted/40 rounded" />
                  <div className="h-2 w-1/3 bg-muted/40 rounded" />
                </div>
              </div>
            ))
          ) : recentProjects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center">
                <FolderKanban className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-40">
                Belum ada proyek
              </p>
            </div>
          ) : (
            recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-background/40 hover:bg-foreground border border-foreground/[0.03] hover:border-foreground shadow-sm hover:shadow-2xl hover:shadow-foreground/10 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-background/20" />

                <div className="w-12 h-12 rounded-xl bg-foreground text-background group-hover:bg-background group-hover:text-foreground flex items-center justify-center text-xs font-black tracking-tighter shrink-0 ring-1 ring-border/10 transition-colors duration-500">
                  {getInitials(project.clientName)}
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <p className="text-sm font-black tracking-tight text-foreground group-hover:text-background transition-colors duration-500 truncate uppercase">
                    {project.projectName}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground group-hover:text-background/60 transition-colors duration-500 truncate uppercase tracking-wider">
                    {project.clientName}
                  </p>
                </div>

                <div className="relative z-10">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-3 py-1 h-auto uppercase tracking-[0.2em] font-black rounded-lg border-2 transition-all duration-500",
                      project.status === "Done"
                        ? "bg-emerald-500 border-emerald-500 text-white group-hover:bg-white group-hover:text-emerald-500 group-hover:border-white"
                        : "bg-background border-foreground text-foreground group-hover:bg-white group-hover:text-foreground group-hover:border-white",
                    )}
                  >
                    {project.status === "Done"
                      ? "Selesai"
                      : `${project.progress}%`}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
