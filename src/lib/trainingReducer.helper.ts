import type { Set, TrainingSession } from "@/types/training";

/**
 * Checks if there is a next set in the training session.
 * @param {number} currentSetIndex - The index of the current set.
 * @param {TrainingSession} currentSession - The current training session.
 * @returns {boolean} - True if there is a next set, false otherwise.
 */
export function hasNextSet(
  currentSetIndex: number,
  currentSession: TrainingSession,
): boolean {
  return currentSetIndex < currentSession.sets.length - 1;
}

/**
 * Checks if there is a next repetition in the current set.
 * @param {number} currentRepetition - The index of the current repetition.
 * @param {Set} currentSet - The current set.
 * @returns {boolean} - True if there is a next repetition, false otherwise.
 */
export function hasNextRepetition(
  currentRepetition: number,
  currentSet: Set,
): boolean {
  return currentRepetition < currentSet.repetitions - 1;
}

/**
 * Retrieves the hang time from the next set in the training session.
 * @param {TrainingSession} currentSession - The current training session.
 * @param {number} currentSetIndex - The index of the current set.
 * @returns {number} - The hang time of the next set.
 */
export function getHangTimeFromNextSet(
  currentSession: TrainingSession,
  currentSetIndex: number,
) {
  const nextSet = currentSession.sets[currentSetIndex + 1];

  if (!nextSet) {
    throw new Error("No next set available");
  }

  return currentSession.sets[currentSetIndex + 1].hangTime;
}

/**
 * Checks if there is a rest period after the current set.
 * @param {TrainingSession} currentSession - The current training session.
 * @param {number} currentSetIndex - The index of the current set.
 * @returns {number} - The duration of the rest period after the set.
 */
export function hasRestAfterSet(
  currentSession: TrainingSession,
  currentSetIndex: number,
) {
  return currentSession.sets[currentSetIndex].restAfter > 0;
}
