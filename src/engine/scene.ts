import type { Theme, Snowflake } from "./types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./types";

export interface ColoredChar {
  char: string;
  color: string;
}

export const createEmptyBuffer = (): ColoredChar[][] => {
  const buffer: ColoredChar[][] = [];
  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    const row: ColoredChar[] = [];
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      row.push({ char: " ", color: "" });
    }
    buffer.push(row);
  }
  return buffer;
};

export const drawFixedElements = (
  buffer: ColoredChar[][],
  theme: Theme,
  greetingPulse: number
): void => {
  const { scene, colors } = theme;

  const roofStartY = CANVAS_HEIGHT - scene.roof.length;
  for (let y = 0; y < scene.roof.length; y++) {
    const line = scene.roof[y];
    for (let x = 0; x < line.length && x < CANVAS_WIDTH; x++) {
      const char = line[x];
      if (char !== " ") {
        const color = char === "*" || char === "~" || char === "福" || char === "春"
          ? colors.accent
          : char === "_" || char === "/" || char === "\\" || char === "|"
          ? colors.roof
          : char === "O" || char === "🎆" || char === "✨"
          ? colors.lampLight
          : colors.text;
        buffer[roofStartY + y][x] = { char, color };
      }
    }
  }

  const lampStartX = CANVAS_WIDTH - scene.lamp[0].length - 3;
  const lampStartY = CANVAS_HEIGHT - scene.lamp.length - 1;
  for (let y = 0; y < scene.lamp.length; y++) {
    const line = scene.lamp[y];
    for (let x = 0; x < line.length && x + lampStartX < CANVAS_WIDTH; x++) {
      const char = line[x];
      if (char !== " ") {
        const color = y === 1 || char === "O" || char === "*" || char === "@" || char === "🎆" || char === "✨"
          ? colors.lampLight
          : colors.lamp;
        buffer[lampStartY + y][lampStartX + x] = { char, color };
      }
    }
  }

  const lampX = lampStartX + Math.floor(scene.lamp[0].length / 2);
  const lampY = lampStartY + 1;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const nx = lampX + dx;
      const ny = lampY + dy;
      if (
        nx >= 0 && nx < CANVAS_WIDTH &&
        ny >= 0 && ny < CANVAS_HEIGHT &&
        buffer[ny][nx].char === " "
      ) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3) {
          buffer[ny][nx] = { char: "·", color: colors.lampLight + "60" };
        }
      }
    }
  }

  const greetingStartY = 3;
  for (let y = 0; y < scene.greeting.length; y++) {
    const line = scene.greeting[y];
    const startX = Math.floor((CANVAS_WIDTH - line.length) / 2);
    for (let x = 0; x < line.length && x + startX < CANVAS_WIDTH; x++) {
      const char = line[x];
      if (char !== " ") {
        const pulseAlpha = Math.floor(greetingPulse * 60 + 140).toString(16).padStart(2, "0");
        buffer[greetingStartY + y][startX + x] = {
          char,
          color: colors.text + pulseAlpha,
        };
      }
    }
  }
};

export const drawSnowflakes = (
  buffer: ColoredChar[][],
  snowflakes: Snowflake[],
  snowflakeColor: string
): void => {
  for (const flake of snowflakes) {
    const x = Math.floor(flake.x);
    const y = Math.floor(flake.y);
    if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
      if (buffer[y][x].char === " ") {
        const alpha = Math.floor(flake.opacity * 255).toString(16).padStart(2, "0");
        buffer[y][x] = { char: flake.char, color: snowflakeColor + alpha };
      }
    }
  }
};

export const renderBufferToString = (buffer: ColoredChar[][]): string => {
  return buffer.map((row) => row.map((c) => c.char).join("")).join("\n");
};

export const renderBufferWithColors = (
  buffer: ColoredChar[][],
  defaultColor: string
): string => {
  let result = "";
  for (let y = 0; y < buffer.length; y++) {
    for (let x = 0; x < buffer[y].length; x++) {
      const { char, color } = buffer[y][x];
      const actualColor = color || defaultColor;
      result += `<span style="color:${actualColor}">${char === " " ? "&nbsp;" : char}</span>`;
    }
    result += "\n";
  }
  return result;
};
