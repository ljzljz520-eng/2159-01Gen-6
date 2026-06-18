import type { Snowflake } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT, SNOWFLAKE_COUNT } from "./types";

const SNOWFLAKE_CHARS = ["*", "❄", "+", ".", "•", "❅", "❆"];

export const createSnowflake = (): Snowflake => {
  return {
    x: Math.random() * CANVAS_WIDTH,
    y: -Math.random() * CANVAS_HEIGHT,
    speed: 0.15 + Math.random() * 0.25,
    sway: 0.3 + Math.random() * 0.5,
    swayPhase: Math.random() * Math.PI * 2,
    char: SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)],
    opacity: 0.4 + Math.random() * 0.6,
  };
};

export const createSnowflakePool = (count: number = SNOWFLAKE_COUNT): Snowflake[] => {
  const pool: Snowflake[] = [];
  for (let i = 0; i < count; i++) {
    const flake = createSnowflake();
    flake.y = Math.random() * CANVAS_HEIGHT;
    pool.push(flake);
  }
  return pool;
};

export const updateSnowflakes = (snowflakes: Snowflake[], speedMultiplier: number = 1): void => {
  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.y += flake.speed * speedMultiplier;
    flake.swayPhase += 0.02 * speedMultiplier;
    flake.x += Math.sin(flake.swayPhase) * flake.sway * 0.1 * speedMultiplier;

    if (flake.y >= CANVAS_HEIGHT) {
      flake.y = -1;
      flake.x = Math.random() * CANVAS_WIDTH;
      flake.speed = 0.15 + Math.random() * 0.25;
      flake.sway = 0.3 + Math.random() * 0.5;
      flake.char = SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];
      flake.opacity = 0.4 + Math.random() * 0.6;
    }

    if (flake.x < 0) flake.x = CANVAS_WIDTH - 1;
    if (flake.x >= CANVAS_WIDTH) flake.x = 0;
  }
};

export const resetSnowflakes = (snowflakes: Snowflake[]): void => {
  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.y = -Math.random() * CANVAS_HEIGHT;
    flake.x = Math.random() * CANVAS_WIDTH;
    flake.swayPhase = Math.random() * Math.PI * 2;
  }
};
