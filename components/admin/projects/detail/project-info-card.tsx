"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  CheckCircle,
  User,
  Phone,
  Briefcase,
  Calendar,
  Hash,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { Project } from "@/lib/types/project";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

interface ProjectInfoCardProps {
  project?: Project | null;
  latestProgress?: number;
  copied: boolean;
  onCopyLink: () => void;
  isLoading?: boolean;
}

// Circular progress component
function CircularProgress({
  progress,
  size = 140,
  strokeWidth = 10,
  isMaintenance = false,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isMaintenance?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative group/circle transition-transform duration-500 hover:scale-105"
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90 relative z-10"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]",
            isMaintenance ? "text-emerald-500" : "text-foreground",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-black tracking-tighter tabular-nums text-foreground">
            {progress}
          </span>
          <span className="text-sm font-black text-muted-foreground opacity-50">
            %
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isMaintenance ? "bg-emerald-500" : "bg-foreground/50",
            )}
          />
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            {isMaintenance ? "Status" : "Progress"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ... imports
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ... circular progress component

export function ProjectInfoCard({
  project,
  latestProgress = 0,
  copied,
  onCopyLink,
  isLoading = false,
}: ProjectInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const magicLink = project
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/track/${
        project.uniqueToken
      }`
    : "";

  if (isLoading || !project) {
    return (
      <Card className="border-border/50 shadow-sm bg-card h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skeleton Circular Progress */}
          <div className="flex justify-center py-2">
            <Skeleton className="w-[120px] h-[120px] rounded-full" />
          </div>

          <Separator className="bg-border/50" />

          {/* Skeleton Client Info */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-border/50">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Skeleton Details */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMaintenance = project.currentPhase === "MAINTENANCE";

  return (
    <Card className="glass-card border-none shadow-2xl overflow-hidden hover-lift group">
      <div
        className={cn(
          "h-1.5 w-full opacity-90 transition-colors duration-500",
          isMaintenance ? "bg-emerald-500" : "bg-foreground",
        )}
      />
      <CardHeader className="pb-6 pt-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black tracking-tighter flex items-center gap-3 uppercase">
            <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            Kelola Proyek
          </CardTitle>

          {/* Mobile Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-[10px] font-black uppercase tracking-widest h-8 bg-muted/50 rounded-full px-4 border border-border/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Tutup" : "Detail"}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pb-8">
        {/* Critical Info - Always Visible */}
        <div className="flex flex-col items-center justify-center py-4 bg-muted/5 rounded-3xl border border-border/5 shadow-inner">
          <CircularProgress
            progress={latestProgress}
            isMaintenance={isMaintenance}
          />
        </div>

        {/* Collapsible Section on Mobile / Always Visible on Desktop */}
        <div
          className={cn(
            "space-y-8 lg:block transition-all duration-500 ease-in-out overflow-hidden",
            isExpanded
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100",
          )}
        >
          <Separator className="bg-border/10" />

          {/* Client Info Section */}
          <div className="space-y-5 p-6 bg-muted/20 backdrop-blur-sm rounded-3xl border border-border/10">
            <div>
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Informasi Klien
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center border border-border/50 shadow-sm">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <p className="font-black text-lg tracking-tight text-foreground uppercase">
                  {project.clientName}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Kontak Klien
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center border border-border/50 shadow-sm transition-transform hover:scale-110">
                  <Phone className="w-5 h-5 text-foreground" />
                </div>
                <a
                  href={`https://wa.me/${project.clientPhone.replace(/^0/, "62")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-foreground hover:underline transition-colors flex items-center gap-1.5"
                >
                  {project.clientPhone}
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
              </div>
            </div>
          </div>

          <Separator className="bg-border/10" />

          {/* Project Details */}
          <div className="space-y-5 px-1">
            <div>
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Batas Waktu
              </Label>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shadow-inner">
                  <Calendar className="w-4 h-4 text-foreground/70" />
                </div>
                <p className="font-bold text-sm text-foreground">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Status Proyek
              </Label>
              <div className="mt-3">
                <Badge
                  variant={
                    project.status === "Done" || isMaintenance
                      ? "default"
                      : "outline"
                  }
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest py-1.5 px-4 transition-all",
                    isMaintenance
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : project.status === "Done"
                        ? "bg-foreground text-background shadow-lg shadow-foreground/20"
                        : "border-foreground/30 text-foreground bg-muted/30",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-2",
                      project.status === "Done" || isMaintenance
                        ? "bg-white"
                        : "bg-foreground/50 animate-pulse",
                    )}
                  />
                  {isMaintenance
                    ? "Maintenance"
                    : project.status === "Done"
                      ? "Proyek Selesai"
                      : "Development"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Token & Links Section - High Contrast */}
          <div className="space-y-6 pt-2">
            <div className="group/token relative">
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-2.5 flex items-center gap-2">
                <Hash className="w-3 h-3" /> Token Unik Proyek
              </Label>
              <div className="relative group/field">
                <div className="absolute inset-0 bg-foreground/5 blur-xl opacity-0 group-hover/field:opacity-100 transition-opacity rounded-xl" />
                <p className="relative font-mono text-[11px] font-black bg-muted/50 px-4 py-3 rounded-xl border border-border/50 text-foreground tracking-widest uppercase shadow-inner">
                  {project.uniqueToken}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Link Pelacakan Klien
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-1 group/field">
                  <Input
                    value={magicLink}
                    readOnly
                    className="text-[11px] font-bold bg-background/50 h-12 border-border/40 rounded-xl pr-10 focus-visible:ring-foreground/20 transition-all overflow-hidden text-ellipsis shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={onCopyLink}
                  className={cn(
                    "flex-shrink-0 h-12 w-12 rounded-xl transition-all active:scale-95 border-border/40 shadow-sm",
                    copied
                      ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/20"
                      : "hover:bg-foreground/5 hover:border-foreground/20",
                  )}
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  copied
                    ? "max-h-12 opacity-100 transform translate-y-0"
                    : "max-h-0 opacity-0 transform translate-y-2",
                )}
              >
                <div className="bg-foreground/[0.03] border border-foreground/10 px-3 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                  <p className="text-[10px] text-foreground/80 font-black uppercase tracking-widest">
                    Link Disalin ke Clipboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
