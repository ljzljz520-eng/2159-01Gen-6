import type { Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "christmas-eve",
    name: "平安夜",
    icon: "🎄",
    colors: {
      background: "#0a1628",
      snowflake: "#ffffff",
      roof: "#8b4513",
      lamp: "#4a4a4a",
      lampLight: "#ffd700",
      text: "#ffffff",
      accent: "#dc143c",
    },
    scene: {
      roof: [
        "                              ",
        "                              ",
        "            _______           ",
        "           /       \\          ",
        "          /  *   *  \\         ",
        "         /___________\\        ",
        "         |  ___   ___|        ",
        "         | |   | |            ",
        "         |_|___|_|____________",
      ],
      lamp: [
        "         ",
        "    O    ",
        "   /|\\   ",
        "    |    ",
        "    |    ",
        "    |    ",
        "   / \\   ",
      ],
      greeting: [
        "   平 安 夜 快 乐   ",
        "Merry Christmas Eve",
      ],
    },
  },
  {
    id: "birthday",
    name: "生日",
    icon: "🎂",
    colors: {
      background: "#1a0a1f",
      snowflake: "#ffb6c1",
      roof: "#8b008b",
      lamp: "#ff69b4",
      lampLight: "#ffd700",
      text: "#ffffff",
      accent: "#ff69b4",
    },
    scene: {
      roof: [
        "                              ",
        "    O      O      O           ",
        "   /|\\    /|\\    /|\\         ",
        "    |      |      |           ",
        "   / \\    / \\    / \\          ",
        "            _______           ",
        "           /       \\          ",
        "          /  ~   ~  \\         ",
        "         /___________\\        ",
        "         |  ___   ___|        ",
        "         | |   | |            ",
        "         |_|___|_|____________",
      ],
      lamp: [
        "         ",
        "  * @ *  ",
        "   \\|/   ",
        "    |    ",
        "    |    ",
        "    |    ",
        "   / \\   ",
      ],
      greeting: [
        "    生 日 快 乐    ",
        "  Happy Birthday  ",
      ],
    },
  },
  {
    id: "new-year",
    name: "新年",
    icon: "🧧",
    colors: {
      background: "#1a0505",
      snowflake: "#fff8dc",
      roof: "#8b0000",
      lamp: "#dc143c",
      lampLight: "#ffd700",
      text: "#ffd700",
      accent: "#dc143c",
    },
    scene: {
      roof: [
        "                              ",
        "     红灯笼    红灯笼         ",
        "       |          |           ",
        "      / \\        / \\          ",
        "            _______           ",
        "           /       \\          ",
        "          /  福  春  \\         ",
        "         /___________\\        ",
        "         |  ___   ___|        ",
        "         | |   | |            ",
        "         |_|___|_|____________",
      ],
      lamp: [
        "         ",
        "  🎆 ✨  ",
        "   \\|/   ",
        "    |    ",
        "    |    ",
        "    |    ",
        "   / \\   ",
      ],
      greeting: [
        "    新 年 快 乐    ",
        "  Happy New Year  ",
      ],
    },
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find((t) => t.id === id);
};

export const getDefaultTheme = (): Theme => {
  return themes[0];
};
