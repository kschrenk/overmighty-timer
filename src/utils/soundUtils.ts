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
  endSet: 220, // A3
  endTraining: [440, 660, 880], // A4, E5, A5 chord
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
  playTone(FREQUENCIES.startHang);
};

// Sound for ending a hang
export const playEndHangSound = (): void => {
  playTone(FREQUENCIES.endHang);
};

// Sound for starting a rest period
export const playStartRestSound = (): void => {
  playTone(FREQUENCIES.startRest);
};

// Sound for ending a set
export const playEndSetSound = (): void => {
  playTone(FREQUENCIES.endSet, 300);
};

// Sound for ending a training session
export const playEndTrainingSound = (): void => {
  playToneSequence(FREQUENCIES.endTraining, 300);
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
    default:
      break;
  }
};
