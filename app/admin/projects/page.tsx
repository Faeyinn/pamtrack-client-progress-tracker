"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";
import { ProjectTable } from "@/components/admin/dashboard/project-table";
import { ProjectFilters } from "@/components/admin/dashboard/project-filters";
import { NewProjectModalHandler } from "@/components/admin/dashboard/new-project-modal-handler";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { BottomNav } from "@/components/admin/shared/bottom-nav";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectsPage() {
  const {
    projects,
    filteredProjects,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fetchProjects,
    handleDelete,
  } = useDashboardLogic();

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Premium Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12 space-y-10 relative z-10">
        {/* Page Header - Modern Hero Style */}
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl shadow-foreground/20 transition-transform duration-500">
                <FolderKanban className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                    Daftar Proyek
                  </p>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                  PROYEK<span className="text-primary">.</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-1.5 max-w-xl opacity-70">
                  Kelola seluruh proyek client, siklus pengerjaan, dan performa
                  tim dalam satu dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-11 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 hover:bg-foreground hover:text-background transition-all hover:shadow-xl active:scale-95 bg-background/50 backdrop-blur-sm"
                onClick={fetchProjects}
                disabled={isLoading}
              >
                <RefreshCcw
                  className={cn(
                    "w-3.5 h-3.5 mr-2",
                    isLoading && "animate-spin",
                  )}
                />
                Refresh
              </Button>
              <div className="hidden md:block">
                <Suspense fallback={null}>
                  <NewProjectModalHandler onSuccess={fetchProjects} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section - Modern Container */}
        <div className="rounded-[2.5rem] shadow-2xl shadow-foreground/5 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 bg-card border border-border relative overflow-hidden">
          {/* Decorative Internal Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

          <section className="relative z-10">
            {/* Header with integrated filters */}
            <div className="px-6 py-8 sm:px-10 border-b border-border/40">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Status Tabs - Modern Segmented Control */}
                  <Tabs
                    defaultValue="all"
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                    className="w-full md:w-auto"
                  >
                    <TabsList className="bg-muted p-1 rounded-2xl h-auto border border-border">
                      <TabsTrigger
                        value="all"
                        className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-xl px-6 py-3 transition-all"
                      >
                        Semua
                      </TabsTrigger>
                      <TabsTrigger
                        value="On Progress"
                        className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-xl px-6 py-3 transition-all"
                      >
                        Development
                      </TabsTrigger>
                      <TabsTrigger
                        value="Done"
                        className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-xl px-6 py-3 transition-all"
                      >
                        Done
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Search Filter - High Contrast */}
                  <div className="w-full md:w-80 group">
                    <ProjectFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      resultCount={filteredProjects.length}
                      totalCount={projects.length}
                      onReset={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                      hideStatusDropdown={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table Content - Polished Inset */}
            <div className="px-2 sm:px-6 pb-10 mt-6">
              <ProjectTable
                projects={filteredProjects}
                isLoading={isLoading}
                error={error}
                onDelete={handleDelete}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Actions */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-24 right-6 z-40 md:hidden",
          "h-14 w-14 rounded-2xl shadow-2xl shadow-primary/30",
          "hover:scale-110 active:scale-90 transition-all duration-300",
        )}
        onClick={fetchProjects}
        disabled={isLoading}
        aria-label="Refresh data"
      >
        <RefreshCcw className={cn("w-6 h-6", isLoading && "animate-spin")} />
      </Button>

      <BottomNav onProjectCreated={fetchProjects} />
    </div>
  );
}
