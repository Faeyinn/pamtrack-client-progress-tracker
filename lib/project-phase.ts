export const PROJECT_PHASES = [
  "DISCOVERY",
  "DESIGN",
  "DEVELOPMENT",
  "QA",
  "LAUNCH",
  "MAINTENANCE",
] as const;

export type ProjectPhase = (typeof PROJECT_PHASES)[number];

export const ARTIFACT_TYPES = [
  "WIREFRAME",
  "USER_FLOW",
  "MEETING_NOTES",
  "OTHER",
] as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export function isProjectPhase(value: unknown): value is ProjectPhase {
  return typeof value === "string" && (PROJECT_PHASES as readonly string[]).includes(value);
}

export function isArtifactType(value: unknown): value is ArtifactType {
  return typeof value === "string" && (ARTIFACT_TYPES as readonly string[]).includes(value);
}
