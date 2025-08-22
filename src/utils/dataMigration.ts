import { TimerViewEnum, type TrainingSession } from "@/types/training";

/**
 * Migrates old training session data to ensure compatibility with current application state.
 * This handles cases where old database records might have timerView: "bar" which no longer exists.
 */
export function migrateTrainingSession(
  session: TrainingSession,
): TrainingSession {
  // Ensure timerView is always set to CIRCLE for any session
  // This handles old database records that might have timerView: "bar"
  const migratedSession: TrainingSession = {
    ...session,
    timerView: TimerViewEnum.CIRCLE,
  };

  return migratedSession;
}

/**
 * Migrates an array of training sessions
 */
export function migrateTrainingSessions(
  sessions: TrainingSession[],
): TrainingSession[] {
  return sessions.map(migrateTrainingSession);
}
