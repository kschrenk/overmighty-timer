import { useState, useCallback, useEffect } from "react";

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if ("wakeLock" in navigator) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      return;
    }

    try {
      if (wakeLock) {
        return;
      }

      navigator.wakeLock.request("screen").then((result) => {
        setWakeLock(result);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error requesting wake lock: ${error.message}`);
      }
    }
  }, [isSupported, wakeLock]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release().then(() => {
        setWakeLock(null);
      });
    }
  }, [wakeLock]);

  return {
    requestWakeLock,
    releaseWakeLock,
    isSupported,
  };
};
