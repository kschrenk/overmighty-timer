import { toast } from "sonner";

type WindowWithWebkit = Window & {
  webkitAudioContext: typeof AudioContext;
};

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass =
    window.AudioContext ||
    ("webkitAudioContext" in window
      ? (window as WindowWithWebkit).webkitAudioContext
      : null);

  if (!AudioContextClass) {
    toast("Audio not supported", {
      description:
        "The browser does not support the Web Audio API, which is required to play sounds in this application.",
    });
    console.error("AudioContext not supported");
    return null;
  }

  audioContext = new AudioContextClass();

  // Resume the audio context on the first user interaction
  const resumeContext = () => {
    if (audioContext?.state === "suspended") {
      audioContext.resume().catch((error) => {
        console.error("Error resuming audio context:", error);
      });
    }
    document.removeEventListener("touchstart", resumeContext);
    document.removeEventListener("mousedown", resumeContext);
  };

  document.addEventListener("touchstart", resumeContext);
  document.addEventListener("mousedown", resumeContext);

  return audioContext;
};

// Sound frequencies for different states
const FREQUENCIES = {
  startHang: 880, // A5
  endHang: 660, // E5
  startRest: 440, // A4
  endRest: 220, // A3
  endSet: 220, // A3
  endTraining: [440, 660, 880], // A4, E5, A5 chord
  preparation: 1100, // C6
};

let lastPrioritySoundUntil = 0;
const markPriorityWindow = (durationMs: number) => {
  try {
    lastPrioritySoundUntil = performance.now() + durationMs + 50; // small buffer
  } catch {
    lastPrioritySoundUntil = Date.now() + durationMs + 50;
  }
};
export const isInPriorityWindow = () => {
  try {
    return performance.now() < lastPrioritySoundUntil;
  } catch {
    return Date.now() < lastPrioritySoundUntil;
  }
};

// Play a tone with given frequency
export const playTone = (frequency: number, duration: number = 200): void => {
  try {
    const audioContext = getAudioContext();

    if (!audioContext) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    // Apply fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + duration / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);

    // Clean up
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, duration + 100);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

// Play a sequence of tones
export const playToneSequence = (
  frequencies: number[],
  duration: number = 200,
): void => {
  frequencies.forEach((freq, index) => {
    setTimeout(() => playTone(freq, duration), index * duration);
  });
};

// Sound for starting a hang
export const playStartHangSound = (): void => {
  markPriorityWindow(440);
  playTone(FREQUENCIES.startHang, 440);
};

// Sound for ending a hang
export const playEndHangSound = (): void => {
  markPriorityWindow(440);
  playTone(FREQUENCIES.endHang, 440);
};

// Sound for starting a rest period
export const playStartRestSound = (): void => {
  markPriorityWindow(200);
  playTone(FREQUENCIES.startRest);
};

// Sound for ending a rest period
export const playEndRestSound = (): void => {
  markPriorityWindow(100);
  playTone(FREQUENCIES.endRest, 100);
};

// Sound for ending a set
export const playEndSetSound = (): void => {
  markPriorityWindow(300);
  playTone(FREQUENCIES.endSet, 300);
};

// Sound for ending a training session
export const playEndTrainingSound = (): void => {
  markPriorityWindow(900); // sequence ~ 3 * 300
  playToneSequence(FREQUENCIES.endTraining, 300);
};

// Sound for preparing a training session
export const playPreparationSound = (): void => {
  markPriorityWindow(300);
  playTone(FREQUENCIES.preparation, 300);
};

// Sound for last three seconds of a hang
export const playLastThreeSecondsSound = (): void => {
  if (isInPriorityWindow()) return; // suppress if high priority active
  playTone(810, 80);
};

// General state change notification
export const playStateChangeSound = (state: string): void => {
  switch (state) {
    case "hanging":
      playStartHangSound();
      break;
    case "restingBetweenReps":
      playEndHangSound();
      break;
    case "restingAfterSet":
      playEndSetSound();
      break;
    case "finished":
      playEndTrainingSound();
      break;
    case "preparation": {
      playPreparationSound();
      break;
    }
    default:
      break;
  }
};
