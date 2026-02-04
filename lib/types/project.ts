export interface Project {
  id: string;
  clientName: string;
  clientPhone: string;
  projectName: string;
  deadline: string;
  status: "On Progress" | "Done";
  progress: number;
  uniqueToken: string;
  currentPhase?: "DEVELOPMENT" | "MAINTENANCE";
  developmentProgress?: number;
  maintenanceProgress?: number;
  developmentCompletedAt?: string | null;
  createdAt: string;
}

export interface ProjectLog {
  id: string;
  projectId: string;
  title: string;
  description: string;
  percentage: number;
  phase?: "DEVELOPMENT" | "MAINTENANCE";
  createdAt: string;
  progressUpdate?: ProgressUpdate | null;
}

export interface ClientFeedback {
  id: string;
  projectId: string;
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  onProgress: number;
  done: number;
}

export type ProjectPhase =
  | "DISCOVERY"
  | "DESIGN"
  | "DEVELOPMENT"
  | "QA"
  | "LAUNCH"
  | "MAINTENANCE";

export type ArtifactType =
  | "WIREFRAME"
  | "USER_FLOW"
  | "MEETING_NOTES"
  | "OTHER";

export interface DiscussionArtifact {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  phase: ProjectPhase;
  type?: ArtifactType | null;
  createdAt: string;
  updatedAt: string;

  // one of these will be present
  sourceLinkUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
}

export interface ProgressUpdateLink {
  id: string;
  label: string;
  url: string;
}

export interface ProgressUpdateImage {
  id: string;
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
}

export interface ProgressUpdate {
  id: string;
  projectId: string;
  description: string;
  phase?: ProjectPhase | null;
  createdAt: string;
  images: ProgressUpdateImage[];
  links: ProgressUpdateLink[];
}
