export interface ThemeColors {
  background: string;
  snowflake: string;
  roof: string;
  lamp: string;
  lampLight: string;
  text: string;
  accent: string;
}

export interface ThemeScene {
  roof: string[];
  lamp: string[];
  greeting: string[];
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: ThemeColors;
  scene: ThemeScene;
}

export interface Snowflake {
  x: number;
  y: number;
  speed: number;
  sway: number;
  swayPhase: number;
  char: string;
  opacity: number;
}

export interface FrameData {
  version: string;
  themeId: string;
  fps: number;
  frameCount: number;
  width: number;
  height: number;
  frames: string[];
}

export const CANVAS_WIDTH = 60;
export const CANVAS_HEIGHT = 30;
export const DEFAULT_FPS = 15;
export const SNOWFLAKE_COUNT = 60;
export const FRAME_VERSION = "1.0";
