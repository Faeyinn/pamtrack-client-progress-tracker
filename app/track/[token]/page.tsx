"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { TrackHeader } from "@/components/track/track-header";
import { ProjectHeaderCard } from "@/components/track/project-header-card";
import { TimelineSection } from "@/components/track/timeline-section";
import { FeedbackForm } from "@/components/track/feedback-form";
import { ContactFooter } from "@/components/track/contact-footer";
import { useTracking } from "@/components/track/hooks/use-tracking";
import { DiscussionArchiveViewer } from "@/components/track/hub/discussion-archive-viewer";
import { PageBackground } from "@/components/shared/page-background";

export default function TrackPage() {
  const params = useParams();
  const token = params.token as string;

  const { project, logs, artifacts, isLoading, error, latestProgress } =
    useTracking(token);

  if (error || (!project && !isLoading)) {
    return (
      <div className="premium-bg flex items-center justify-center p-4">
        <PageBackground variant="simple" />
        <Card className="max-w-md w-full border border-border/60 shadow-lg bg-card/80 backdrop-blur-xl text-card-foreground relative z-10 rounded-[2rem]">
          <CardContent className="pt-8 pb-8 px-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2 font-[family:var(--font-display)]">
                  Data Tidak Ditemukan
                </h2>
                <p className="text-muted-foreground">
                  {error ||
                    "Proyek yang Anda cari tidak tersedia atau token akses sudah kedaluwarsa."}
                </p>
              </div>
              <Button
                asChild
                className="w-full bg-foreground hover:bg-foreground/90 text-background shadow-sm transition-all rounded-xl"
              >
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="premium-bg selection:bg-foreground selection:text-background">
      <PageBackground />

      <TrackHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12 lg:space-y-20">
            <div data-aos="fade-up">
              <ProjectHeaderCard
                project={project}
                latestProgress={latestProgress}
                latestLogTitle={logs[0]?.title}
                isLoading={isLoading}
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <DiscussionArchiveViewer
                artifacts={artifacts}
                isLoading={isLoading}
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <TimelineSection logs={logs} isLoading={isLoading} />
            </div>
          </div>

          {/* Sidebar Column - Sticky on Desktop */}
          <div className="lg:col-span-4 space-y-10">
            <div className="lg:sticky lg:top-28 space-y-10">
              <div data-aos="fade-up" data-aos-delay="300">
                <FeedbackForm token={token} />
              </div>

              <div data-aos="fade-up" data-aos-delay="400">
                <ContactFooter />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
