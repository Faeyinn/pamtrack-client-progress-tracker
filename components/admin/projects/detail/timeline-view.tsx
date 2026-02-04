"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Rocket, Wrench } from "lucide-react";
import { TimelineItem } from "./timeline-item";
import { ProjectLog } from "@/lib/types/project";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  logs: ProjectLog[];
}

function PhaseSeparator({ phase }: { phase: "DEVELOPMENT" | "MAINTENANCE" }) {
  const isMaintenance = phase === "MAINTENANCE";
  return (
    <div className="relative flex items-center gap-4 py-4 animate-in fade-in zoom-in duration-500">
      <div className="relative z-10 flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg bg-background",
            isMaintenance ? "border-amber-500/20" : "border-blue-500/20",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isMaintenance
                ? "bg-amber-500 text-white"
                : "bg-blue-500 text-white",
            )}
          >
            {isMaintenance ? (
              <Wrench className="w-4 h-4" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 border-t-2 border-dashed border-border/50 relative">
        <span
          className={cn(
            "absolute left-4 -top-3 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border bg-background",
            isMaintenance
              ? "text-amber-600 border-amber-200"
              : "text-blue-600 border-blue-200",
          )}
        >
          {isMaintenance ? "Maintenance Phase" : "Development Phase"}
        </span>
      </div>
    </div>
  );
}

export function TimelineView({ logs }: TimelineViewProps) {
  if (logs.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">Belum ada update progres</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Klik &quot;Tambah Update&quot; untuk menambahkan progres pertama
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 shadow-2xl shadow-foreground/5 bg-background/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
      <CardContent className="pt-10 pb-6 px-4 sm:px-8">
        <div className="relative">
          {/* Timeline Line - Modern Floating Style */}
          <div className="absolute left-[23px] sm:left-[27px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-foreground/10 via-foreground/5 to-transparent rounded-full" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {logs.map((log, index) => {
              const prevLog = logs[index - 1];
              const showSeparator = !prevLog || prevLog.phase !== log.phase;

              return (
                <div key={log.id} className="relative">
                  {showSeparator && log.phase && (
                    <div className="mb-8 first:mt-0 mt-12">
                      <PhaseSeparator phase={log.phase} />
                    </div>
                  )}
                  <TimelineItem
                    log={log}
                    isLatest={index === 0}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
