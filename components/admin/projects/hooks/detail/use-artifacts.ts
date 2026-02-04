"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiscussionArtifact } from "@/lib/types/project";

export function useArtifacts(projectId: string) {
  const [artifacts, setArtifacts] = useState<DiscussionArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchArtifacts = useCallback(async () => {
    try {
      setError("");
      const res = await fetch(`/api/projects/${projectId}/artifacts`);
      if (!res.ok) {
        throw new Error("Failed");
      }
      const data = (await res.json()) as DiscussionArtifact[];
      setArtifacts(data);
    } catch {
      setError("Gagal memuat Discussion Archive");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchArtifacts();
    }
  }, [projectId, fetchArtifacts]);

  const createArtifact = useCallback(
    async (formData: FormData) => {
      const res = await fetch(`/api/projects/${projectId}/artifacts`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          data && typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Failed";
        throw new Error(message);
      }

      await fetchArtifacts();
    },
    [projectId, fetchArtifacts],
  );

  const deleteArtifact = useCallback(
    async (artifactId: string) => {
      const res = await fetch(`/api/projects/${projectId}/artifacts/${artifactId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data && typeof (data as { message?: unknown }).message === "string"
            ? (data as { message: string }).message
            : "Failed";
        throw new Error(message);
      }

      await fetchArtifacts();
    },
    [projectId, fetchArtifacts],
  );

  return {
    artifacts,
    isLoading,
    error,
    refresh: fetchArtifacts,
    createArtifact,
    deleteArtifact,
  };
}
