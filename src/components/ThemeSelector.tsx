import type { Theme } from "@/engine/types";
import { themes } from "@/engine/themes";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  disabled?: boolean;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  disabled = false,
}: ThemeSelectorProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onThemeChange(theme)}
          disabled={disabled}
          className={`
            px-5 py-3 rounded-xl font-medium text-sm
            backdrop-blur-md border transition-all duration-300
            flex items-center gap-2
            ${currentTheme.id === theme.id
              ? "bg-white/20 border-white/40 shadow-lg scale-105"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
          `}
          style={{
            color: currentTheme.id === theme.id ? theme.colors.accent : "inherit",
          }}
        >
          <span className="text-xl">{theme.icon}</span>
          <span>{theme.name}</span>
          {currentTheme.id === theme.id && (
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: theme.colors.lampLight }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
