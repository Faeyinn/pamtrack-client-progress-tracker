"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DiscussionArtifact,
  ProgressUpdate,
  Project,
  ProjectLog,
} from "@/lib/types/project";

export function useTracking(token: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [artifacts, setArtifacts] = useState<DiscussionArtifact[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjectData = useCallback(async () => {
    try {
      const response = await fetch(`/api/track/${token}`);

      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setLogs(data.logs);
        setArtifacts(Array.isArray(data.artifacts) ? data.artifacts : []);
        setUpdates(Array.isArray(data.updates) ? data.updates : []);
      } else {
        setError("Data tidak ditemukan. Token mungkin salah atau tidak valid.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProjectData();
    }
  }, [token, fetchProjectData]);

  // Smart progress calculation to prevent "Progress Drop"
  let latestProgress = 0;
  
  if (project) {
    if (project.currentPhase === "MAINTENANCE") {
      // In maintenance mode, the main development progress is always 100%
      latestProgress = 100;
    } else {
      // In development, use the tracked development progress
      // Fallback to logs if developmentProgress is 0 (legacy support)
      latestProgress = project.developmentProgress || (logs.length > 0 ? logs[0].percentage : 0);
    }
  }

  return {
    project,
    logs,
    artifacts,
    updates,
    isLoading,
    error,
    latestProgress,
  };
}
