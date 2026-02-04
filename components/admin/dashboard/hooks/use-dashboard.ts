"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Project, DashboardStats } from "@/lib/types/project";
import { toast } from "sonner";

export function useDashboardLogic() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/projects");

      if (response.status === 401) {
        toast.error("Sesi kadaluarsa, silakan login kembali");
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setError("");
      } else {
        setError("Gagal memuat data proyek");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Optimistic update or refetch
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Proyek berhasil dihapus");
      } else {
        toast.error("Gagal menghapus proyek");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Terjadi kesalahan");
    }
  }, []);

  // Compute derived state
  const filteredProjects = useMemo(() => {
    let result = projects;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.clientName.toLowerCase().includes(lowerQuery) ||
          project.projectName.toLowerCase().includes(lowerQuery),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter);
    }

    return result;
  }, [projects, searchQuery, statusFilter]);

  const stats: DashboardStats = useMemo(
    () => ({
      total: projects.length,
      onProgress: projects.filter((p) => p.status === "On Progress").length,
      done: projects.filter((p) => p.status === "Done").length,
    }),
    [projects],
  );

  return {
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
    stats,
  };
}
