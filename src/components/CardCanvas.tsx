import { useRef, useEffect, useCallback } from "react";
import type { Theme, Snowflake, FrameData } from "@/engine/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEFAULT_FPS } from "@/engine/types";
import {
  createEmptyBuffer,
  drawFixedElements,
  drawSnowflakes,
  renderBufferToString,
  renderBufferWithColors,
  type ColoredChar,
} from "@/engine/scene";
import { createSnowflakePool, updateSnowflakes, resetSnowflakes } from "@/engine/snowflakes";
import { useAnimationLoop } from "@/hooks/useAnimationLoop";

interface CardCanvasProps {
  theme: Theme;
  isPlaying: boolean;
  speed: number;
  onFrameCapture?: (frame: string) => void;
  playbackData?: FrameData | null;
}

export default function CardCanvas({
  theme,
  isPlaying,
  speed,
  onFrameCapture,
  playbackData,
}: CardCanvasProps) {
  const canvasRef = useRef<HTMLPreElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const bufferRef = useRef<ColoredChar[][]>([]);
  const greetingPulseRef = useRef(0);
  const pulseDirectionRef = useRef(1);
  const playbackIndexRef = useRef(0);
  const frameCountRef = useRef(0);

  useEffect(() => {
    snowflakesRef.current = createSnowflakePool();
    bufferRef.current = createEmptyBuffer();
  }, []);

  useEffect(() => {
    if (playbackData) {
      playbackIndexRef.current = 0;
    } else {
      resetSnowflakes(snowflakesRef.current);
    }
  }, [playbackData]);

  const renderPlayback = useCallback(() => {
    if (!playbackData || !canvasRef.current) return;

    const frame = playbackData.frames[playbackIndexRef.current];
    if (frame) {
      canvasRef.current.textContent = frame;
      playbackIndexRef.current = (playbackIndexRef.current + 1) % playbackData.frames.length;
    }
  }, [playbackData]);

  const renderLive = useCallback(() => {
    if (!canvasRef.current) return;

    const buffer = bufferRef.current;
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      for (let x = 0; x < CANVAS_WIDTH; x++) {
        buffer[y][x] = { char: " ", color: "" };
      }
    }

    greetingPulseRef.current += 0.02 * pulseDirectionRef.current;
    if (greetingPulseRef.current >= 1) {
      greetingPulseRef.current = 1;
      pulseDirectionRef.current = -1;
    } else if (greetingPulseRef.current <= 0) {
      greetingPulseRef.current = 0;
      pulseDirectionRef.current = 1;
    }

    drawFixedElements(buffer, theme, greetingPulseRef.current);
    drawSnowflakes(buffer, snowflakesRef.current, theme.colors.snowflake);

    const html = renderBufferWithColors(buffer, theme.colors.text);
    canvasRef.current.innerHTML = html;

    if (onFrameCapture) {
      const frameStr = renderBufferToString(buffer);
      frameCountRef.current++;
      if (frameCountRef.current % 4 === 0) {
        onFrameCapture(frameStr);
      }
    }
  }, [theme, onFrameCapture]);

  const { start, stop, setFps } = useAnimationLoop({
    onFrame: () => {
      if (playbackData) {
        renderPlayback();
      } else {
        updateSnowflakes(snowflakesRef.current, speed);
        renderLive();
      }
    },
    fps: playbackData ? playbackData.fps : DEFAULT_FPS,
    autoStart: false,
  });

  useEffect(() => {
    if (playbackData) {
      setFps(playbackData.fps);
    }
  }, [playbackData, setFps]);

  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    if (!isPlaying) {
      if (playbackData) {
        renderPlayback();
      } else {
        renderLive();
      }
    }
  }, [theme, isPlaying, playbackData, renderLive, renderPlayback]);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 60%, ${theme.colors.lampLight}30 0%, transparent 50%)`,
        }}
      />
      <pre
        ref={canvasRef}
        className="relative z-10 p-4 leading-relaxed tracking-tight select-none"
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: "14px",
          lineHeight: "1.4",
          minWidth: `${CANVAS_WIDTH * 9}px`,
          minHeight: `${CANVAS_HEIGHT * 20}px`,
        }}
      />
    </div>
  );
}
