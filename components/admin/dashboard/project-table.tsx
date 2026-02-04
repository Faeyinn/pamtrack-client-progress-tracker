"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FolderKanban,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  deadline: string;
  status: "On Progress" | "Done";
  progress: number;
  uniqueToken: string;
  createdAt: string;
  currentPhase?: "DEVELOPMENT" | "MAINTENANCE";
}

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
  error: string;
  onDelete: (id: string) => void;
}

// Progress ring component for mobile cards
function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
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
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
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
            "transition-all duration-700 ease-out",
            isMaintenance ? "text-emerald-500" : "text-foreground",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}

// Check if deadline is approaching (within 7 days)
function isDeadlineUrgent(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
}

// Skeleton loading component
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border border-border/40"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-10 w-10 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/2 rounded skeleton" />
          </div>
          <div className="h-6 w-20 rounded-full skeleton" />
        </div>
      ))}
    </div>
  );
}

export function ProjectTable({
  projects,
  isLoading,
  error,
  onDelete,
}: ProjectTableProps) {
  const router = useRouter();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  /* Sort State */
  const [sortField, setSortField] = useState<
    "clientName" | "projectName" | "deadline" | "progress" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (
    field: "clientName" | "projectName" | "deadline" | "progress",
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5" />
    );
  };

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: string | number | Date = a[sortField] as string | number | Date;
    let bVal: string | number | Date = b[sortField] as string | number | Date;

    if (sortField === "deadline") {
      aVal = new Date(a.deadline).getTime();
      bVal = new Date(b.deadline).getTime();
    } else if (sortField === "progress") {
      aVal = a.progress;
      bVal = b.progress;
    } else {
      aVal = (aVal || "").toString().toLowerCase();
      bVal = (bVal || "").toString().toLowerCase();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = sortedProjects.slice(startIndex, endIndex);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400",
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
      "bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
      "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400",
      "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
      "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-32 px-6 rounded-[3rem] border-2 border-dashed border-border/40 bg-foreground/[0.02] mt-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 rounded-[2rem] bg-background shadow-2xl shadow-foreground/5 flex items-center justify-center mb-8 relative group">
          <div className="absolute inset-0 bg-foreground/5 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
          <FolderKanban className="w-10 h-10 text-foreground/20 relative z-10" />
        </div>
        <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase mb-3">
          Daftar Proyek Kosong<span className="text-primary">.</span>
        </h3>
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed mb-10">
          Belum ada proyek yang terdaftar. Tambahkan proyek pertama Anda untuk
          mulai memantau.
        </p>
        <Button
          onClick={() => {
            const newProjectBtn = document.querySelector(
              "[data-new-project-trigger]",
            ) as HTMLElement;
            newProjectBtn?.click();
          }}
          className="h-14 px-10 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-foreground/20"
        >
          Tambah Proyek Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Mobile: Enhanced Card list */}
      <div className="grid gap-6 md:hidden px-2">
        {currentProjects.map((project, index) => (
          <div
            key={project.id}
            className={cn(
              "group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-border shadow-md transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5 active:scale-[0.98] overflow-hidden",
            )}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => router.push(`/admin/projects/${project.id}`)}
          >
            {/* Status Background Accent */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150",
                project.currentPhase === "MAINTENANCE"
                  ? "bg-emerald-500"
                  : "bg-foreground",
              )}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm",
                        project.currentPhase === "MAINTENANCE"
                          ? "bg-emerald-500 text-white"
                          : project.status === "Done"
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {project.currentPhase === "MAINTENANCE"
                        ? "Maintenance"
                        : project.status === "Done"
                          ? "Done"
                          : "Development"}
                    </Badge>
                    {isDeadlineUrgent(project.deadline) &&
                      project.status !== "Done" && (
                        <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
                      )}
                  </div>
                  <h3 className="text-xl font-black tracking-tighter text-foreground uppercase leading-none mt-1">
                    {project.projectName}
                  </h3>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-2xl bg-muted/30 border border-border/40 hover:bg-foreground hover:text-background transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 rounded-2xl bg-background/95 backdrop-blur-xl border-border/40 p-2"
                    >
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-50">
                        Aksi
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/40" />
                      <DropdownMenuItem
                        className="rounded-xl h-11 px-4 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                        onClick={() =>
                          router.push(`/admin/projects/${project.id}`)
                        }
                      >
                        <Eye className="w-4 h-4 mr-3 opacity-50" /> Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-xl h-11 px-4 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                        onClick={() =>
                          router.push(`/admin/projects/${project.id}/edit`)
                        }
                      >
                        <Edit className="w-4 h-4 mr-3 opacity-50" /> Ubah Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/40" />
                      <DropdownMenuItem
                        onClick={() => setProjectToDelete(project.id)}
                        className="rounded-xl h-11 px-4 text-destructive focus:bg-destructive focus:text-white cursor-pointer font-black text-[10px] uppercase tracking-widest"
                      >
                        <Trash2 className="w-4 h-4 mr-3" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/20">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Nama Client
                  </p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {project.clientName}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/20">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Batas Waktu
                  </p>
                  <p
                    className={cn(
                      "text-xs font-bold truncate",
                      isDeadlineUrgent(project.deadline)
                        ? "text-destructive"
                        : "text-foreground",
                    )}
                  >
                    {new Date(project.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                    Progress Pengerjaan
                  </span>
                  <span className="text-xl font-black text-foreground tabular-nums">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden shadow-inner flex">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000 ease-out",
                      project.currentPhase === "MAINTENANCE"
                        ? "bg-emerald-500"
                        : "bg-foreground",
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Enhanced Table */}
      <Card className="hidden md:block overflow-hidden rounded-[2.5rem] shadow-xl shadow-foreground/[0.03] bg-white dark:bg-zinc-900 border border-border group/container">
        <Table>
          <TableHeader>
            <TableRow className="bg-foreground/[0.02] hover:bg-foreground/[0.02] border-b border-border/40">
              <TableHead
                className="py-8 pl-10 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort("clientName")}
              >
                <div className="flex items-center gap-2">
                  Nama Client
                  {getSortIcon("clientName")}
                </div>
              </TableHead>
              <TableHead
                className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort("projectName")}
              >
                <div className="flex items-center gap-2">
                  Nama Proyek
                  {getSortIcon("projectName")}
                </div>
              </TableHead>
              <TableHead
                className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort("deadline")}
              >
                <div className="flex items-center gap-2">
                  Batas Waktu
                  {getSortIcon("deadline")}
                </div>
              </TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Fase
              </TableHead>
              <TableHead
                className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 w-56 cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort("progress")}
              >
                <div className="flex items-center gap-2">
                  Progress
                  {getSortIcon("progress")}
                </div>
              </TableHead>
              <TableHead className="font-black text-right pr-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.map((project, index) => (
              <TableRow
                key={project.id}
                className="hover:bg-foreground/[0.03] transition-all duration-300 group/row border-b border-border/20 last:border-0 cursor-pointer h-24"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              >
                <TableCell className="pl-10">
                  <div className="flex items-center space-x-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-2xl transition-transform duration-500 group-hover/row:scale-110 group-hover/row:rotate-3",
                        getAvatarColor(project.clientName),
                      )}
                    >
                      {getInitials(project.clientName)}
                    </div>
                    <span className="font-black text-xs text-foreground uppercase tracking-widest">
                      {project.clientName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-[13px] text-foreground uppercase tracking-tight group-hover/row:text-primary transition-colors">
                      {project.projectName}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                      ID: {project.id.slice(0, 8)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest",
                      isDeadlineUrgent(project.deadline) &&
                        project.status !== "Done"
                        ? "text-destructive"
                        : "text-muted-foreground/80",
                    )}
                  >
                    <Calendar className="w-3.5 h-3.5 opacity-50" />
                    <span>
                      {new Date(project.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-xl border-none shadow-sm transition-all duration-500",
                      project.currentPhase === "MAINTENANCE"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : project.status === "Done"
                          ? "bg-foreground text-background shadow-lg shadow-foreground/20"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {project.currentPhase === "MAINTENANCE"
                      ? "Maintenance"
                      : project.status === "Done"
                        ? "Done"
                        : "Development"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4 w-full pr-8">
                    <div className="flex-1 h-3 bg-muted/40 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out shadow-2xl",
                          project.currentPhase === "MAINTENANCE"
                            ? "bg-emerald-500"
                            : "bg-foreground",
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-foreground tabular-nums min-w-[2.5rem] tracking-tighter">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-right pr-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover/row:translate-x-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-2xl hover:bg-foreground hover:text-background transition-all"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-2xl bg-background/95 backdrop-blur-xl border-border/40 p-2"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-50">
                          Aksi
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem
                          className="rounded-xl h-11 px-4 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                          onClick={() =>
                            router.push(`/admin/projects/${project.id}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-3 opacity-50" /> Lihat
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl h-11 px-4 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                          onClick={() =>
                            router.push(`/admin/projects/${project.id}/edit`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-3 opacity-50" /> Ubah Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem
                          onClick={() => setProjectToDelete(project.id)}
                          className="rounded-xl h-11 px-4 text-destructive focus:bg-destructive focus:text-white cursor-pointer font-black text-[10px] uppercase tracking-widest"
                        >
                          <Trash2 className="w-4 h-4 mr-3" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/30">
            <p className="text-xs text-muted-foreground font-medium">
              Menampilkan{" "}
              <strong>
                {startIndex + 1}-{Math.min(endIndex, projects.length)}
              </strong>{" "}
              dari <strong>{projects.length}</strong> proyek
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-6 h-6 rounded-md text-[10px] font-bold transition-all",
                      currentPage === i + 1
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-8 text-xs font-bold rounded-lg"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Mobile Pagination (Simplified) */}
      <div className="md:hidden flex justify-center mt-6">
        {totalPages > 1 && (
          <div className="flex items-center gap-3 bg-card p-2 rounded-full shadow-lg shadow-accent/10 border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-full"
            >
              <ArrowUpRight className="w-4 h-4 rotate-[-135deg]" />
            </Button>
            <span className="text-xs font-bold tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-full"
            >
              <ArrowUpRight className="w-4 h-4 rotate-45" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="sm:max-w-[360px] p-6 rounded-[2rem] gap-6">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto ring-8 ring-destructive/5">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-black tracking-tight">
                Hapus Proyek?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center max-w-[280px] mx-auto text-muted-foreground font-medium">
                Tindakan ini permanen. Semua data proyek termasuk log akan
                hilang.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 grid grid-cols-2">
            <AlertDialogCancel className="w-full rounded-xl h-12 border-none bg-muted font-bold hover:bg-muted/80 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (projectToDelete) {
                  onDelete(projectToDelete);
                  setProjectToDelete(null);
                }
              }}
              className="w-full rounded-xl h-12 bg-destructive hover:bg-destructive/90 font-bold text-destructive-foreground shadow-lg shadow-destructive/20"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
