"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { ProgressUpdate } from "@/lib/types/project";

import { Skeleton } from "@/components/ui/skeleton";

export function ProgressUpdatesFeed({
  updates,
  isLoading = false,
}: {
  updates: ProgressUpdate[];
  isLoading?: boolean;
}) {
  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Visual Progress Tracker</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Update terbaru dari tim, lengkap dengan screenshot dan link.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/60 p-4 space-y-4"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-28 rounded-md w-full" />
                  <Skeleton className="h-28 rounded-md w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada update.
          </div>
        ) : (
          updates.map((u) => (
            <div key={u.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    {u.phase ? `${u.phase} • ` : ""}
                    {formatDistanceToNow(new Date(u.createdAt), {
                      addSuffix: true,
                      locale: localeId,
                    })}
                  </div>
                  <div className="mt-1 text-sm text-foreground">
                    {u.description}
                  </div>
                </div>
              </div>

              {u.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {u.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={img.url}
                          alt={img.fileName || "Progress image"}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.02] transition-transform"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {u.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {u.links.map((l) => (
                    <Button
                      key={l.id}
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <a href={l.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4" /> {l.label}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
