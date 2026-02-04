"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/types/project";
import { format, isPast } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface OverdueProjectsAlertProps {
  projects: Project[];
}

export function OverdueProjectsAlert({ projects }: OverdueProjectsAlertProps) {
  const overdueProjects = useMemo(() => {
    return projects.filter((project) => {
      if (project.status === "Done") return false;
      const deadlineDate = new Date(project.deadline);
      return isPast(deadlineDate);
    });
  }, [projects]);

  if (overdueProjects.length === 0) {
    return null; // Don't show if no overdue projects
  }

  const getDaysOverdue = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = now.getTime() - deadlineDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline: string) => {
    return format(new Date(deadline), "dd MMM yyyy", { locale: id });
  };

  return (
    <Card className="rounded-[1.25rem] shadow-lg hover:shadow-xl transition-shadow duration-300 border-destructive/20 bg-gradient-to-br from-destructive/10 to-destructive/5 animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-destructive/10 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-black tracking-tight text-destructive uppercase">
                Proyek Terlewat
              </CardTitle>
              <p className="text-xs font-medium text-destructive/70 uppercase tracking-widest mt-0.5">
                {overdueProjects.length} proyek melewati deadline
              </p>
            </div>
          </div>
          <Badge
            variant="destructive"
            className="whitespace-nowrap ml-auto flex-shrink-0"
          >
            {overdueProjects.length} Mendesak
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-5 pb-5">
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
          {overdueProjects.slice(0, 3).map((project) => {
            const daysOverdue = getDaysOverdue(project.deadline);
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block p-3 rounded-lg bg-card/40 hover:bg-card/60 transition-colors group border border-destructive/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:underline">
                      {project.projectName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.clientName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-destructive font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {daysOverdue} hari ({formatDeadline(project.deadline)})
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="whitespace-nowrap flex-shrink-0 border-destructive/50 text-destructive"
                  >
                    {project.progress}%
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>

        {overdueProjects.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full border-destructive/30 hover:bg-destructive/10"
          >
            <Link href="/admin/projects?status=On Progress">
              Lihat semua ({overdueProjects.length - 3} lebih)
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
