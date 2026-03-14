import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 md:pb-12 space-y-10 relative z-10">
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                <LayoutDashboard className="w-7 h-7 text-muted-foreground/50" />
              </div>
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        <Skeleton className="h-20 w-full rounded-2xl" />

        <div className="rounded-[2.5rem] bg-card border border-border p-6 sm:p-10 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-1.5 h-6 bg-muted rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-[1.5rem]" />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pt-4">
            <div className="lg:col-span-2 space-y-10">
              <Skeleton className="h-[300px] w-full rounded-2xl" />
              <Skeleton className="h-[450px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[600px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
