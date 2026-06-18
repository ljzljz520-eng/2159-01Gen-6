import { useRef, useEffect, useCallback } from "react";

interface UseAnimationLoopOptions {
  onFrame: (deltaTime: number) => void;
  fps?: number;
  autoStart?: boolean;
}

export const useAnimationLoop = ({
  onFrame,
  fps = 60,
  autoStart = true,
}: UseAnimationLoopOptions) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isRunningRef = useRef(autoStart);
  const fpsIntervalRef = useRef(1000 / fps);
  const accumulatorRef = useRef(0);

  const animate = useCallback(
    (time: number) => {
      if (!isRunningRef.current) return;

      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;

      accumulatorRef.current += deltaTime;

      while (accumulatorRef.current >= fpsIntervalRef.current) {
        onFrame(fpsIntervalRef.current);
        accumulatorRef.current -= fpsIntervalRef.current;
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [onFrame]
  );

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      previousTimeRef.current = undefined;
      accumulatorRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  }, []);

  const setFps = useCallback((newFps: number) => {
    fpsIntervalRef.current = 1000 / newFps;
  }, []);

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => {
      stop();
    };
  }, [autoStart, start, stop]);

  return { start, stop, setFps };
};
