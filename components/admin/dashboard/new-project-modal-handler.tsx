"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NewProjectModal } from "@/components/admin/dashboard/new-project-modal";

interface NewProjectModalHandlerProps {
  onSuccess: () => void;
}

export function NewProjectModalHandler({
  onSuccess,
}: NewProjectModalHandlerProps) {
  const searchParams = useSearchParams();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Watch for newProject query parameter changes
  useEffect(() => {
    setIsNewProjectModalOpen(searchParams.get("newProject") === "true");
  }, [searchParams]);

  return (
    <NewProjectModal
      onSuccess={onSuccess}
      open={isNewProjectModalOpen}
      onOpenChange={setIsNewProjectModalOpen}
    />
  );
}
