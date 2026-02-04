"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectInfoCard } from "@/components/admin/projects/detail/project-info-card";
import { ProjectActions } from "@/components/admin/projects/detail/project-actions";
import { AddLogForm } from "@/components/admin/projects/detail/add-log-form";
import { TimelineView } from "@/components/admin/projects/detail/timeline-view";
import { DiscussionArchiveTab } from "@/components/admin/projects/detail/archive/discussion-archive-tab";
import { useProjectDetail } from "@/components/admin/projects/hooks/use-project-detail";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/admin/shared/theme-toggle";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const {
    project,
    logs,
    feedbacks,
    isLoading,
    error,
    copied,
    showLogForm,
    setShowLogForm,
    handleCopyLink,
    handleDeleteProject,
    handleLogSuccess,
    latestProgress,
  } = useProjectDetail(projectId);

  if (error || (!project && !isLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Proyek Tidak Ditemukan</CardTitle>
            <CardDescription>
              {error || "Proyek yang Anda cari tidak ada atau telah dihapus."}
            </CardDescription>
            <Link href="/admin/dashboard" className="mt-4 inline-block">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="bg-background/40 backdrop-blur-2xl border-b border-border/40 sticky top-0 z-50 supports-backdrop-filter:bg-background/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-5 overflow-hidden">
            <Link
              href="/admin/dashboard"
              className="hover:text-foreground transition-colors truncate"
            >
              Dashboard
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
            <Link
              href="/admin/projects"
              className="hover:text-foreground transition-colors truncate"
            >
              Proyek
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30 shrink-0" />
            <span className="text-foreground/80 truncate">
              {isLoading ? (
                <Skeleton className="w-24 h-2 inline-block" />
              ) : (
                project?.projectName
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/admin/projects"
                className="transition-transform hover:-translate-x-1 shrink-0"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background/50 border border-border/40 hover:bg-background hover:shadow-lg transition-all group">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>

              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 bg-background border border-border/50 p-2 shrink-0 group">
                  <Image
                    src="/logo-pure.png"
                    alt="Project Logo"
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="min-w-0">
                  {isLoading ? (
                    <div className="space-y-1.5">
                      <Skeleton className="h-6 w-48 rounded-md" />
                      <Skeleton className="h-4 w-32 rounded-md" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter truncate uppercase">
                        {project?.projectName}
                      </h1>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              project?.status === "Done"
                                ? "bg-emerald-500"
                                : "bg-blue-500 animate-pulse",
                            )}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            {project?.status === "Done"
                              ? "Proyek Selesai"
                              : "Dalam Pengembangan"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ProjectActions
                projectId={projectId}
                onDelete={handleDeleteProject}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <ProjectInfoCard
              project={project}
              latestProgress={latestProgress}
              copied={copied}
              onCopyLink={handleCopyLink}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Timeline & Update</span>
                  <span className="sm:hidden">Timeline</span>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Dokumen</span>
                  <span className="sm:hidden">Dokumen</span>
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2 relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Feedback & Pesan</span>
                  <span className="sm:hidden">Feedback</span>
                  {feedbacks.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                      {feedbacks.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4 mt-2">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-40" />
                      <Skeleton className="h-10 w-32 rounded-full" />
                    </div>
                    <Card className="border-border/50 shadow-sm">
                      <div className="p-6 space-y-6">
                        <div className="flex gap-4">
                          <Skeleton className="w-4 h-full" />
                          <div className="space-y-2 w-full">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-20 w-full rounded-md" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Skeleton className="w-4 h-full" />
                          <div className="space-y-2 w-full">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-20 w-full rounded-md" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                      <div className="space-y-1.5">
                        <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">
                          Timeline Update
                        </h2>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          Memantau siklus operasional dan pengerjaan proyek.
                        </div>
                      </div>

                      <Dialog open={showLogForm} onOpenChange={setShowLogForm}>
                        <DialogTrigger asChild>
                          <Button className="h-12 px-6 rounded-2xl shadow-2xl shadow-foreground/10 bg-foreground hover:bg-foreground/90 text-background gap-3 group transition-all active:scale-95">
                            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="text-xs font-black uppercase tracking-widest">
                              Tambah Update
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-2xl border-border/40 rounded-[2.5rem]">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tighter uppercase">
                              Update Proyek
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
                              Masukkan data operasional terbaru untuk koordinasi
                              dengan klien.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-2">
                            <AddLogForm
                              projectId={projectId}
                              currentPhase={project?.currentPhase}
                              developmentProgress={
                                project?.developmentProgress || 0
                              }
                              maintenanceProgress={
                                project?.maintenanceProgress || 0
                              }
                              onSuccess={handleLogSuccess}
                              onCancel={() => setShowLogForm(false)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <TimelineView logs={logs} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-2">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="aspect-square rounded-xl" />
                      <Skeleton className="aspect-square rounded-xl" />
                    </div>
                  </div>
                ) : (
                  <DiscussionArchiveTab projectId={projectId} />
                )}
              </TabsContent>

              <TabsContent value="feedback" className="space-y-6 mt-2">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div className="px-1">
                      <div className="space-y-1.5">
                        <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">
                          Feedback Client
                        </h2>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                          Daftar masukan dan permintaan dari klien.
                        </div>
                      </div>
                    </div>

                    {feedbacks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-foreground/2 mt-4 animate-in fade-in zoom-in-95 duration-700">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-background shadow-2xl shadow-foreground/5 flex items-center justify-center mb-6">
                          <MessageSquare className="w-10 h-10 text-foreground/10" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase mb-2">
                          Belum Ada Pesan<span className="text-primary">.</span>
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                          Belum ada feedback atau permintaan perubahan dari
                          klien yang terdeteksi.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {feedbacks.map((item, index) => (
                          <div
                            key={item.id}
                            className={cn(
                              "group relative bg-background/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-border/40 transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5 overflow-hidden",
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all duration-700 group-hover:scale-150" />

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-xl shadow-foreground/10 group-hover:rotate-6 transition-transform">
                                <MessageSquare className="w-5 h-5" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground px-3 py-1 bg-foreground/5 rounded-lg border border-foreground/5">
                                    Pesan Klien
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    {new Date(
                                      item.createdAt,
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>

                                <div className="relative">
                                  <p className="text-sm font-bold text-foreground leading-relaxed italic opacity-80 decoration-primary/20 decoration-2">
                                    &ldquo;{item.message}&rdquo;
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
