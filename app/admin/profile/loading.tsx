import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="mb-10">
            <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center mr-3">
                    <ArrowLeft className="w-3.5 h-3.5" />
                </div>
                Kembali ke Dashboard
            </div>
            <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-muted rounded-full animate-pulse" />
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-[400px] w-full rounded-[2rem]" />
                <Skeleton className="h-20 w-full rounded-[1.5rem]" />
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-[450px] w-full rounded-[2rem]" />
                <Skeleton className="h-32 w-full rounded-[2rem]" />
            </div>
        </div>
      </main>
    </div>
  );
}
