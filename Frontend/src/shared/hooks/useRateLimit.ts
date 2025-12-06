import { useState, useRef, useCallback } from "react";

interface RateLimitState {
  isBlocked: boolean;
  remainingSeconds: number;
}

export const useRateLimit = (cooldownSeconds: number = 30) => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    isBlocked: false,
    remainingSeconds: 0,
  });
  const lastRequestTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const lastRequest = lastRequestTimeRef.current;

    if (lastRequest === null) {
      return false;
    }

    const timeSinceLastRequest = now - lastRequest;
    const cooldownMs = cooldownSeconds * 1000;

    if (timeSinceLastRequest < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - timeSinceLastRequest) / 1000);
      setRateLimitState({
        isBlocked: true,
        remainingSeconds: remaining,
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLast = currentTime - lastRequest;
        const remaining = Math.ceil((cooldownMs - timeSinceLast) / 1000);

        if (remaining <= 0) {
          setRateLimitState({
            isBlocked: false,
            remainingSeconds: 0,
          });
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          setRateLimitState({
            isBlocked: true,
            remainingSeconds: remaining,
          });
        }
      }, 1000);

      return true;
    }

    return false;
  }, [cooldownSeconds]);

  const recordRequest = useCallback(() => {
    lastRequestTimeRef.current = Date.now();
    setRateLimitState({
      isBlocked: true,
      remainingSeconds: cooldownSeconds,
    });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const lastRequest = lastRequestTimeRef.current;
      if (lastRequest === null) return;

      const timeSinceLast = now - lastRequest;
      const cooldownMs = cooldownSeconds * 1000;
      const remaining = Math.ceil((cooldownMs - timeSinceLast) / 1000);

      if (remaining <= 0) {
        setRateLimitState({
          isBlocked: false,
          remainingSeconds: 0,
        });
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setRateLimitState({
          isBlocked: true,
          remainingSeconds: remaining,
        });
      }
    }, 1000);
  }, [cooldownSeconds]);

  const reset = useCallback(() => {
    lastRequestTimeRef.current = null;
    setRateLimitState({
      isBlocked: false,
      remainingSeconds: 0,
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return {
    isBlocked: rateLimitState.isBlocked,
    remainingSeconds: rateLimitState.remainingSeconds,
    checkRateLimit,
    recordRequest,
    reset,
  };
};

