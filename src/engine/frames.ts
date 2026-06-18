import type { FrameData } from "./types";
import { FRAME_VERSION, DEFAULT_FPS, CANVAS_WIDTH, CANVAS_HEIGHT } from "./types";

export const createFrameData = (
  themeId: string,
  frames: string[],
  fps: number = DEFAULT_FPS
): FrameData => {
  return {
    version: FRAME_VERSION,
    themeId,
    fps,
    frameCount: frames.length,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    frames,
  };
};

export const validateFrameData = (data: unknown): data is FrameData => {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.version === "string" &&
    typeof obj.themeId === "string" &&
    typeof obj.fps === "number" &&
    typeof obj.frameCount === "number" &&
    typeof obj.width === "number" &&
    typeof obj.height === "number" &&
    Array.isArray(obj.frames) &&
    obj.frames.every((f: unknown) => typeof f === "string")
  );
};

export const serializeFrameData = (data: FrameData): string => {
  return JSON.stringify(data, null, 2);
};

export const deserializeFrameData = (json: string): FrameData | null => {
  try {
    const parsed = JSON.parse(json);
    if (validateFrameData(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const downloadFrameData = (data: FrameData, filename: string = "snowcard-frames.json"): void => {
  const json = serializeFrameData(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyFrameDataToClipboard = async (data: FrameData): Promise<boolean> => {
  try {
    const json = serializeFrameData(data);
    await navigator.clipboard.writeText(json);
    return true;
  } catch {
    return false;
  }
};

export const readFrameDataFromClipboard = async (): Promise<FrameData | null> => {
  try {
    const text = await navigator.clipboard.readText();
    return deserializeFrameData(text);
  } catch {
    return null;
  }
};
