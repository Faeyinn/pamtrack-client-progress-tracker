import { ProjectWorkPhase } from "@prisma/client";

/**
 * Validates whether a phase is unlocked based on current project state
 * @param currentPhase - The current active phase
 * @param developmentProgress - Development phase progress (0-100)
 * @returns boolean - True if the phase can be updated
 */
export function isPhaseUnlocked(
  targetPhase: ProjectWorkPhase,
  developmentProgress: number
): boolean {
  if (targetPhase === "DEVELOPMENT") {
    return true;
  }

  if (targetPhase === "MAINTENANCE") {
    return developmentProgress === 100;
  }

  return false;
}

/**
 * Determines if a phase transition is valid
 * @param currentPhase - Current active phase
 * @param targetPhase - Desired phase to transition to
 * @param developmentProgress - Development phase progress
 * @returns object with valid flag and error message if invalid
 */
export function validatePhaseTransition(
  currentPhase: ProjectWorkPhase,
  targetPhase: ProjectWorkPhase,
  developmentProgress: number
): { valid: boolean; error?: string } {
  // Can't transition to the same phase
  if (currentPhase === targetPhase) {
    return { valid: false, error: "Already in this phase" };
  }

  // Can only transition from Development to Maintenance
  if (
    currentPhase === "DEVELOPMENT" &&
    targetPhase === "MAINTENANCE"
  ) {
    if (developmentProgress < 100) {
      return {
        valid: false,
        error: "Cannot transition to Maintenance until Development is 100% complete",
      };
    }
    return { valid: true };
  }

  // Cannot transition from Maintenance back to Development
  if (
    currentPhase === "MAINTENANCE" &&
    targetPhase === "DEVELOPMENT"
  ) {
    return {
      valid: false,
      error: "Cannot revert from Maintenance to Development",
    };
  }

  return {
    valid: false,
    error: "Invalid phase transition",
  };
}

/**
 * Determines if phase should auto-transition based on progress
 * @param currentPhase - Current active phase
 * @param developmentProgress - Development phase progress
 * @returns object with shouldTransition flag and new phase if true
 */
export function checkPhaseAutoTransition(
  currentPhase: ProjectWorkPhase,
  developmentProgress: number
): { shouldTransition: boolean; newPhase?: ProjectWorkPhase } {
  // Auto-transition from Development to Maintenance when Development reaches 100%
  if (
    currentPhase === "DEVELOPMENT" &&
    developmentProgress === 100
  ) {
    return {
      shouldTransition: true,
      newPhase: "MAINTENANCE",
    };
  }

  return { shouldTransition: false };
}

/**
 * Gets the appropriate progress value based on phase
 * @param phase - The phase to get progress for
 * @param developmentProgress - Development progress value
 * @param maintenanceProgress - Maintenance progress value
 * @returns number - The progress value for the phase
 */
export function getPhaseProgress(
  phase: ProjectWorkPhase,
  developmentProgress: number,
  maintenanceProgress: number
): number {
  return phase === "DEVELOPMENT" ? developmentProgress : maintenanceProgress;
}

/**
 * Validates phase progress value
 * @param progress - Progress percentage (0-100)
 * @returns object with valid flag and error message if invalid
 */
export function validateProgressValue(progress: number): {
  valid: boolean;
  error?: string;
} {
  if (typeof progress !== "number") {
    return {
      valid: false,
      error: "Progress must be a number",
    };
  }

  if (progress < 0 || progress > 100) {
    return {
      valid: false,
      error: "Progress must be between 0 and 100",
    };
  }

  return { valid: true };
}

/**
 * Determines the overall project progress
 * @param developmentProgress - Development phase progress
 * @param maintenanceProgress - Maintenance phase progress
 * @param currentPhase - Current active phase
 * @returns number - Overall progress percentage
 */
export function calculateOverallProgress(
  developmentProgress: number,
  maintenanceProgress: number,
  currentPhase: ProjectWorkPhase
): number {
  // If still in Development, overall progress = development progress
  if (currentPhase === "DEVELOPMENT") {
    return developmentProgress;
  }

  // If in Maintenance, consider both phases
  // Development is weighted at 60%, Maintenance at 40%
  const weightedProgress =
    developmentProgress * 0.6 + maintenanceProgress * 0.4;
  return Math.round(weightedProgress);
}

/**
 * Gets the phase display label
 * @param phase - The phase to get label for
 * @returns string - Display label for the phase
 */
export function getPhaseLabel(phase: ProjectWorkPhase): string {
  const labels: Record<ProjectWorkPhase, string> = {
    DEVELOPMENT: "Development",
    MAINTENANCE: "Maintenance",
  };
  return labels[phase] || phase;
}

/**
 * Gets the phase color for UI display
 * @param phase - The phase to get color for
 * @returns string - Color code/class name for the phase
 */
export function getPhaseColor(phase: ProjectWorkPhase): string {
  const colors: Record<ProjectWorkPhase, string> = {
    DEVELOPMENT: "bg-blue-500",
    MAINTENANCE: "bg-amber-500",
  };
  return colors[phase] || "bg-gray-500";
}

/**
 * Gets the phase progress status text
 * @param phase - The phase
 * @param progress - The progress percentage
 * @returns string - Status text
 */
export function getPhaseStatusText(
  phase: ProjectWorkPhase,
  progress: number
): string {
  if (phase === "DEVELOPMENT") {
    if (progress === 0) return "Not Started";
    if (progress < 100) return `In Progress (${progress}%)`;
    return "Complete - Ready for Maintenance";
  }

  if (phase === "MAINTENANCE") {
    if (progress === 0) return "Not Started";
    if (progress < 100) return `In Progress (${progress}%)`;
    return "Complete";
  }

  return `${progress}%`;
}
