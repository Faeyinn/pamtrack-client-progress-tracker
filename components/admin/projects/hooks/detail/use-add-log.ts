"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useAddLog(projectId: string, onSuccess: () => void, workPhase: "DEVELOPMENT" | "MAINTENANCE" = "DEVELOPMENT") {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logForm, setLogForm] = useState({
    title: "",
    description: "",
    percentage: "",
    sendNotification: true,
    visualDescription: "",
    phase: "",
    images: [] as File[],
    links: [] as { label: string; url: string }[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", logForm.title);
      formData.append("description", logForm.description);
      formData.append("percentage", logForm.percentage);
      formData.append("sendNotification", String(logForm.sendNotification));
      formData.append("visualDescription", logForm.visualDescription);
      formData.append("phase", logForm.phase);
      formData.append("workPhase", workPhase);

      const sanitizedLinks = logForm.links
        .map((l) => ({ label: l.label.trim() || "Link", url: l.url.trim() }))
        .filter((l) => /^https?:\/\//i.test(l.url));
      formData.append("links", JSON.stringify(sanitizedLinks));

      logForm.images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/projects/${projectId}/logs`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setLogForm({
          title: "",
          description: "",
          percentage: "",
          sendNotification: true,
          visualDescription: "",
          phase: "",
          images: [],
          links: [],
        });
        onSuccess();
        toast.success("Log progress & visual update berhasil ditambahkan!");
      } else {
        const data = await response.json();
        toast.error(data.message || "Gagal menambahkan log");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    logForm,
    setLogForm,
    handleSubmit,
  };
}
