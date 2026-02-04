"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProgressUpdate } from "@/lib/types/project";

export function useProgressUpdates(projectId: string) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchUpdates = useCallback(async () => {
    try {
      setError("");
      const res = await fetch(`/api/projects/${projectId}/updates`);
      if (!res.ok) {
        throw new Error("Failed");
      }
      const data = (await res.json()) as ProgressUpdate[];
      setUpdates(data);
    } catch {
      setError("Gagal memuat Progress Updates");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchUpdates();
    }
  }, [projectId, fetchUpdates]);

  const createUpdate = useCallback(
    async (formData: FormData) => {
      const res = await fetch(`/api/projects/${projectId}/updates`, {
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

      await fetchUpdates();
    },
    [projectId, fetchUpdates],
  );

  const deleteUpdate = useCallback(
    async (updateId: string) => {
      const res = await fetch(`/api/projects/${projectId}/updates/${updateId}`, {
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

      await fetchUpdates();
    },
    [projectId, fetchUpdates],
  );

  return {
    updates,
    isLoading,
    error,
    refresh: fetchUpdates,
    createUpdate,
    deleteUpdate,
  };
}
