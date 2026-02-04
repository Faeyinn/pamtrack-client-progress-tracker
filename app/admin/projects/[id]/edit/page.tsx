"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenLine } from "lucide-react";
import { EditProjectForm } from "@/components/admin/projects/edit/edit-project-form";
import { Project } from "@/lib/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setError("Gagal memuat data proyek");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/10">
        <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-6">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border border-border/60 shadow-sm bg-card">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-20 w-full rounded-lg" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Skeleton className="h-11 w-full rounded-md" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error || "Proyek tidak ditemukan"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-foreground/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="bg-background/40 backdrop-blur-2xl border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <Link
                href={`/admin/projects/${projectId}`}
                className="transition-transform hover:-translate-x-1"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-background/50 border border-border/40 hover:bg-background hover:shadow-2xl hover:shadow-foreground/5 transition-all group">
                  <ArrowLeft className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>

              <div className="flex items-center gap-5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 bg-background border border-border/50 p-2 group">
                  <Image
                    src="/logo-pure.png"
                    alt="Project Logo"
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                      Protokol Ubah Data
                    </p>
                  </div>
                  <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none">
                    Ubah Proyek<span className="text-primary">.</span>
                  </h1>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                    {project.projectName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <EditProjectForm project={project} />
        </div>
      </main>
    </div>
  );
}
