"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ClientFeedback, Project, ProjectLog } from "@/lib/types/project";
import { toast } from "sonner";

export function useProjectDetail(projectId: string) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [feedbacks, setFeedbacks] = useState<ClientFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  const fetchProjectData = useCallback(async () => {
    try {
      // Parallel data fetching
      const [projectRes, logsRes, feedbacksRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/logs`),
        fetch(`/api/projects/${projectId}/feedbacks`),
      ]);

      if (projectRes.status === 401 || logsRes.status === 401) {
        toast.error("Sesi kadaluarsa, silakan login kembali");
        router.push("/admin/login");
        return;
      }

      if (projectRes.ok && logsRes.ok) {
        const projectData = await projectRes.json();
        const logsData = await logsRes.json();
        const feedbacksData = feedbacksRes.ok ? await feedbacksRes.json() : [];
        setProject(projectData);
        setLogs(logsData);
        setFeedbacks(feedbacksData);
      } else {
        setError("Gagal memuat data proyek");
      }
    } catch (error) {
      console.error("Failed to fetch project detail:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  const handleCopyLink = () => {
    if (project) {
      const link = `${window.location.origin}/track/${project.uniqueToken}`; // Fixed from unique_token to uniqueToken
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Proyek berhasil dihapus");
        router.push("/admin/dashboard");
      } else {
        toast.error("Gagal menghapus proyek");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const handleLogSuccess = useCallback(() => {
    setShowLogForm(false);
    fetchProjectData();
  }, [fetchProjectData]);

  // Smart progress calculation
  let latestProgress = 0;
  if (project) {
    if (project.currentPhase === "MAINTENANCE") {
      latestProgress = 100;
    } else {
      latestProgress = project.developmentProgress || (logs.length > 0 ? logs[0].percentage : 0);
    }
  }

  return {
    project,
    logs,
    isLoading,
    error,
    copied,
    showLogForm,
    setShowLogForm,
    handleCopyLink,
    handleDeleteProject,
    handleLogSuccess,
    latestProgress,
    feedbacks,
  };
}
