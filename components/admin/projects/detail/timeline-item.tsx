"use client";

import { Calendar, Check, ImageIcon, Link2, Wrench } from "lucide-react";
import Image from "next/image";
import { ProjectLog } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimelineItemProps {
  log: ProjectLog;
  isLatest: boolean;
  index: number;
}

// Helper function to get phase display label and color
function getPhaseDisplay(phase?: string) {
  if (!phase) return null;

  if (phase === "DEVELOPMENT") {
    return {
      label: "Development",
      color: "bg-blue-500/10 text-blue-700 border-blue-200",
    };
  }
  if (phase === "MAINTENANCE") {
    return {
      label: "Maintenance",
      color: "bg-amber-500/10 text-amber-700 border-amber-200",
    };
  }
  return null;
}

export function TimelineItem({ log, isLatest, index }: TimelineItemProps) {
  const isMaintenance = log.phase === "MAINTENANCE";

  return (
    <div
      className="relative flex gap-4 sm:gap-6 group animate-in fade-in-50 slide-in-from-left-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {/* Percentage/Status Indicator */}
      <div className="relative flex-shrink-0 z-10">
        <div
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
            "shadow-2xl transition-all duration-500",
            "group-hover:scale-110 group-hover:rotate-3",
            isMaintenance
              ? "bg-amber-100 border-2 border-amber-200 text-amber-600"
              : isLatest
                ? "bg-foreground border-2 border-foreground text-background shadow-foreground/20"
                : "bg-background border-2 border-border text-muted-foreground",
          )}
        >
          {isMaintenance ? (
            <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <span className="font-black text-base sm:text-xl tabular-nums tracking-tighter">
              {log.percentage}%
            </span>
          )}
        </div>

        {isLatest && !isMaintenance && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="w-6 h-6 rounded-full bg-background border-2 border-foreground shadow-lg flex items-center justify-center">
              <Check className="w-3 h-3 text-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-4 min-w-0">
        <div
          className={cn(
            "rounded-[1.5rem] p-5 sm:p-7 transition-all duration-500",
            "border border-border/40 hover:border-foreground/20",
            "shadow-xl shadow-foreground/[0.02] hover:shadow-2xl hover:shadow-foreground/[0.05] hover:-translate-y-1",
            isLatest
              ? "bg-foreground/[0.03] backdrop-blur-sm"
              : "bg-background/50",
          )}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-sm sm:text-lg font-black tracking-tighter text-foreground line-clamp-2 uppercase">
                {log.title}
              </h3>
              {log.phase && (
                <div
                  className={cn(
                    "text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border",
                    getPhaseDisplay(log.phase)?.color || "",
                  )}
                >
                  {getPhaseDisplay(log.phase)?.label}
                </div>
              )}
            </div>
            <div
              className={cn(
                "w-fit text-[10px] sm:text-[11px] shrink-0 font-black tracking-widest uppercase px-3 py-1 rounded-lg",
                isLatest
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground/70",
              )}
            >
              {new Date(log.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground/80 mb-6 leading-relaxed whitespace-pre-wrap font-medium">
            {log.description}
          </p>

          {/* Visual Update (Images & Links) */}
          {log.progressUpdate && (
            <div className="space-y-5 mb-6 p-4 sm:p-6 rounded-[1.25rem] bg-background/40 border border-border/40 shadow-inner">
              {/* Images Grid */}
              {log.progressUpdate.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {log.progressUpdate.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/img block"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-border/20 bg-muted shadow-sm">
                        <Image
                          src={img.url}
                          alt={img.fileName || "Progress screenshot"}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center shadow-2xl scale-75 group-hover/img:scale-100 transition-transform duration-300">
                            <ImageIcon className="w-5 h-5 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Links Buttons */}
              {log.progressUpdate.links.length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                  {log.progressUpdate.links.map((l) => (
                    <Button
                      key={l.id}
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 text-[10px] sm:text-xs font-black uppercase tracking-wider gap-2 rounded-xl border-border/50 hover:bg-foreground hover:text-background transition-all hover:shadow-lg active:scale-95"
                    >
                      <a href={l.url} target="_blank" rel="noreferrer">
                        <Link2 className="w-3.5 h-3.5" />
                        {l.label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              {log.progressUpdate.phase && (
                <div className="flex items-center gap-2 opacity-40">
                  <div className="h-px flex-1 bg-foreground/20" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                    {log.progressUpdate.phase}
                  </span>
                  <div className="h-px flex-1 bg-foreground/20" />
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground/40 pt-4 border-t border-border/10">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span className="font-bold tracking-tight">
                {new Date(log.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="font-black tabular-nums tracking-widest opacity-60">
              {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
