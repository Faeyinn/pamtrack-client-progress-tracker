import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, History } from "lucide-react";
import { TimelineItem } from "../admin/projects/detail/timeline-item";
import { ProjectLog } from "@/lib/types/project";

import { Skeleton } from "@/components/ui/skeleton";

interface TimelineSectionProps {
  logs: ProjectLog[];
  isLoading?: boolean;
}

export function TimelineSection({
  logs,
  isLoading = false,
}: TimelineSectionProps) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground">
            Development Timeline
          </h2>
          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Log aktivitas dan milestone pengerjaan proyek yang tersinkronisasi.
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-2xl border border-foreground/5">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Update Terkini
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="relative pl-4 sm:pl-8">
          <div className="absolute left-[31px] sm:left-[47px] top-4 bottom-10 w-0.5 bg-border hidden md:block" />
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative z-10">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-16 w-full rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-foreground/[0.02] animate-in fade-in zoom-in-95 duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="w-20 h-20 rounded-[1.5rem] bg-background shadow-2xl shadow-foreground/5 flex items-center justify-center mb-6 relative z-10">
              <FolderKanban className="w-10 h-10 text-foreground/10" />
            </div>
          </div>
          <h3 className="text-xl font-black tracking-tighter text-foreground uppercase mb-2">
            Menyiapkan Pipeline Proyek<span className="text-primary">.</span>
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
            Tim kami sedang menyiapkan infrastruktur dan parameter proyek.
            Update akan muncul secara berkala di sini.
          </p>
        </div>
      ) : (
        <div className="relative pl-0 sm:pl-8">
          {/* Main Connector Line - Sophisticated Gradient */}
          <div className="absolute left-[11px] sm:left-[31px] top-4 bottom-10 w-[1px] bg-linear-to-b from-border/80 via-border/20 to-transparent hidden sm:block" />

          <div className="space-y-12">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className="relative z-10 transition-all duration-500 animate-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TimelineItem log={log} isLatest={index === 0} index={index} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
