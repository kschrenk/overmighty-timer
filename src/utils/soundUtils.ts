// Sound frequencies for different states
const FREQUENCIES = {
  startHang: 880, // A5
  endHang: 660,   // E5
  startRest: 440, // A4
  endSet: 220,    // A3
  endTraining: [440, 660, 880] // A4, E5, A5 chord
};

// Play a tone with given frequency
export const playTone = (frequency: number, duration: number = 200): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Apply fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (duration / 1000));
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + (duration / 1000));
    
    // Clean up
    setTimeout(() => {
      audioContext.close();
    }, duration + 100);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Play a sequence of tones
export const playToneSequence = (frequencies: number[], duration: number = 200): void => {
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
    case 'hanging':
      playStartHangSound();
      break;
    case 'restingBetweenReps':
      playEndHangSound();
      break;
    case 'restingAfterSet':
      playEndSetSound();
      break;
    case 'finished':
      playEndTrainingSound();
      break;
    default:
      break;
  }
};