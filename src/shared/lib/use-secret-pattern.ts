import { useEffect, useRef } from "react";

interface UseSecretPatternConfig {
  pattern: string[];
  longPressMs?: number;
  resetTimeoutMs?: number;
  onMatch: () => void;
}

export function useSecretPattern({
  pattern,
  longPressMs = 400,
  resetTimeoutMs = 3000,
  onMatch,
}: UseSecretPatternConfig) {
  const pressStartRef = useRef<number>(0);
  const sequenceRef = useRef<string[]>([]);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const onPointerDown = () => {
    pressStartRef.current = Date.now();
  };

  const onPointerUp = () => {
    const duration = Date.now() - pressStartRef.current;
    const symbol = duration >= longPressMs ? "-" : ".";

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      sequenceRef.current = [];
    }, resetTimeoutMs);

    sequenceRef.current = [...sequenceRef.current, symbol];
    console.log(`[pattern] ${sequenceRef.current.join(" ")}`);

    if (sequenceRef.current.length >= pattern.length) {
      const tail = sequenceRef.current.slice(-pattern.length);
      if (tail.join("") === pattern.join("")) {
        sequenceRef.current = [];
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        onMatch();
      }
    }
  };

  return { onPointerDown, onPointerUp };
}
