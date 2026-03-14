"use client";
import Image from "next/image";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ExternalLink, FileText } from "lucide-react";
import type { DiscussionArtifact, ProjectPhase } from "@/lib/types/project";
import { PROJECT_PHASES } from "@/lib/project-phase";

import { Skeleton } from "@/components/ui/skeleton";

export function DiscussionArchiveViewer({
  artifacts,
  isLoading = false,
}: {
  artifacts: DiscussionArtifact[];
  isLoading?: boolean;
}) {
  const [phase, setPhase] = useState<ProjectPhase | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (phase === "ALL") return artifacts;
    return artifacts.filter((a) => a.phase === phase);
  }, [artifacts, phase]);

  return (
    <Card className="border border-border/60 bg-card/82 backdrop-blur-xl rounded-[2rem] shadow-sm overflow-hidden">
      <CardHeader className="pb-6 pt-8 px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Resources
            </p>
            <CardTitle className="text-3xl font-[family:var(--font-display)] tracking-tight text-foreground sm:text-4xl">
              Dokumen & Artefak
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground font-medium max-w-xl">
              Akses cepat ke aset desain, catatan meeting, dan dokumen teknis proyek yang relevan.
            </p>
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={phase}
              onValueChange={(v) =>
                setPhase(v === "ALL" ? "ALL" : (v as ProjectPhase))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full bg-foreground/5 border-foreground/5 rounded-xl h-10 text-xs font-semibold uppercase tracking-widest transition-all focus:ring-2 focus:ring-foreground/5">
                <SelectValue placeholder="Saring Fase" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 backdrop-blur-xl">
                <SelectItem value="ALL" className="text-xs font-semibold uppercase tracking-widest">Tampilkan Semua</SelectItem>
                {PROJECT_PHASES.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs font-semibold uppercase tracking-widest">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6 sm:px-8 pb-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-border/40 bg-card/50 p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-28 rounded-xl" />
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 bg-foreground/[0.02] border-2 border-dashed border-border/40 rounded-[2rem] flex flex-col items-center justify-center text-center px-4 mt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
              <div className="w-20 h-20 rounded-[1.5rem] bg-background shadow-2xl shadow-foreground/5 flex items-center justify-center mb-6 relative z-10 transform -rotate-6">
                <FileText className="w-10 h-10 text-foreground/10" />
              </div>
            </div>
            <h3 className="text-2xl font-[family:var(--font-display)] tracking-tight uppercase mb-3 text-foreground">
              Belum Ada File Terunggah
            </h3>
            <p className="text-sm font-medium text-muted-foreground/60 uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
              Dokumen atau resource untuk fase ini akan muncul setelah diunggah oleh tim.
            </p>
          </div>
        ) : (
          filtered.map((a) => {
            // Check if it's an image
            const isImage =
              a.mimeType?.startsWith("image/") ||
              a.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

            return (
              <div
                key={a.id}
                className="rounded-[1.5rem] border border-border/40 bg-foreground/[0.03] p-6 hover:border-foreground/20 hover:bg-foreground/[0.05] transition-all duration-300 group/item"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Thumbnail */}
                  {isImage && a.fileUrl && (
                    <div className="shrink-0 w-full sm:w-32 h-32 relative rounded-2xl overflow-hidden bg-background border border-border/40 shadow-sm group-hover/item:scale-[1.02] transition-transform duration-500">
                      <Image
                        src={a.fileUrl}
                        alt={a.fileName || "Document thumbnail"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 128px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-lg tracking-tight text-foreground truncate">
                            {a.title}
                          </div>
                          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 mt-1.5 flex gap-2 flex-wrap items-center">
                            <span className="px-3 py-1 rounded-lg bg-foreground/5 border border-foreground/5">
                              {a.phase}
                            </span>
                            {a.type && (
                              <span className="px-3 py-1 rounded-lg bg-foreground/5 border border-foreground/5">
                                {a.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {a.description && (
                        <p className="text-sm font-medium text-muted-foreground/80 mt-4 leading-relaxed line-clamp-2 uppercase tracking-wide">
                          {a.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {a.fileUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-10 px-5 rounded-xl border-border/40 bg-background text-xs font-semibold uppercase tracking-[0.15em] gap-2 hover:bg-foreground hover:text-background transition-all"
                        >
                          <a href={a.fileUrl} target="_blank" rel="noreferrer">
                            <Download className="w-3.5 h-3.5" />
                            {isImage ? "Lihat Gambar Penuh" : "Unduh File"}
                          </a>
                        </Button>
                      )}
                      {a.sourceLinkUrl && !a.fileName && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-10 px-5 rounded-xl border-border/40 bg-background text-xs font-semibold uppercase tracking-[0.15em] gap-2 hover:bg-foreground hover:text-background transition-all"
                        >
                          <a
                            href={a.sourceLinkUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka Link
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
