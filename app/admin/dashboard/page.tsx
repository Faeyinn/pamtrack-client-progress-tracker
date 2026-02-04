"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { useDashboardLogic } from "@/components/admin/dashboard/hooks/use-dashboard";
import { BottomNav } from "@/components/admin/shared/bottom-nav";
import { Button } from "@/components/ui/button";
import { RefreshCcw, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsOverview } from "@/components/admin/dashboard/stats-overview";
import { AnalyticsSection } from "@/components/admin/dashboard/analytics-section";
import { RecentProjectsList } from "@/components/admin/dashboard/recent-projects-list";
import { ActivityFeed } from "@/components/admin/dashboard/activity-feed";
import { OverdueProjectsAlert } from "@/components/admin/dashboard/overdue-projects-alert";

export default function AdminDashboardPage() {
  const { projects, isLoading, fetchProjects, stats } = useDashboardLogic();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Premium Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12 space-y-10 relative z-10">
        {/* Page Header - Modern Hero Style */}
        <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl shadow-foreground/20 transition-transform duration-500">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase leading-none">
                  DASHBOARD<span className="text-primary">.</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-1.5 max-w-xl opacity-70">
                  Pantau perkembangan operasional dan performa proyek secara
                  langsung.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-11 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 hover:bg-foreground hover:text-background transition-all hover:shadow-xl active:scale-95 bg-background/50 backdrop-blur-sm"
              onClick={fetchProjects}
              disabled={isLoading}
            >
              <RefreshCcw
                className={cn("w-3.5 h-3.5 mr-2", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overdue Alert */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <OverdueProjectsAlert projects={projects} />
        </div>

        {/* Dashboard Content Container */}
        <div className="rounded-[2.5rem] shadow-2xl shadow-foreground/5 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 bg-card border border-border relative overflow-hidden">
          {/* Decorative Internal Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10 space-y-10">
            {/* Stats Grid */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-6 bg-foreground rounded-full" />
                <h2 className="text-sm font-black tracking-[0.2em] text-foreground uppercase">
                  Statistik Utama
                </h2>
              </div>
              <StatsOverview projects={projects} isLoading={isLoading} />
            </section>

            {/* Charts & Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pt-4">
              {/* Left Column (Charts & Projects) */}
              <div className="lg:col-span-2 space-y-10">
                {/* Analytics Chart */}
                <section className="space-y-6">
                  <AnalyticsSection projects={projects} />
                </section>

                {/* Recent Projects Table */}
                <section className="space-y-6">
                  <div className="h-[450px]">
                    <RecentProjectsList
                      projects={projects}
                      isLoading={isLoading}
                    />
                  </div>
                </section>
              </div>

              {/* Right Column (Activity Feed) */}
              <section className="lg:col-span-1 space-y-6">
                <div className="h-[500px] lg:h-[950px]">
                  <ActivityFeed />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Refresh Button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-24 right-6 z-40 md:hidden",
          "h-16 w-16 rounded-2xl shadow-2xl shadow-primary/20 bg-foreground text-background",
          "hover:scale-110 active:scale-90 transition-all duration-300",
        )}
        onClick={fetchProjects}
        disabled={isLoading}
        aria-label="Refresh data"
      >
        <RefreshCcw className={cn("w-7 h-7", isLoading && "animate-spin")} />
      </Button>

      <BottomNav onProjectCreated={fetchProjects} />
    </div>
  );
}
