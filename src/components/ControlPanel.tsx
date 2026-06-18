import { Play, Pause, Download, Upload, RotateCcw } from "lucide-react";
import type { Theme } from "@/engine/types";

interface ControlPanelProps {
  theme: Theme;
  isPlaying: boolean;
  speed: number;
  isPlayback: boolean;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  theme,
  isPlaying,
  speed,
  isPlayback,
  onPlayToggle,
  onSpeedChange,
  onExport,
  onImport,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={onPlayToggle}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: theme.colors.accent + "30",
            border: `1px solid ${theme.colors.accent}60`,
            color: theme.colors.text,
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "暂停" : "播放"}
        </button>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-sm opacity-70">速度</span>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            disabled={isPlayback}
            className="w-32 h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              accentColor: theme.colors.accent,
              background: `linear-gradient(to right, ${theme.colors.accent} ${((speed - 0.3) / 2.7) * 100}%, rgba(255,255,255,0.1) ${((speed - 0.3) / 2.7) * 100}%)`,
            }}
          />
          <span className="text-sm font-mono w-10 text-center" style={{ color: theme.colors.accent }}>
            {speed.toFixed(1)}x
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={onExport}
          disabled={isPlayback}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95
            ${isPlayback ? "opacity-50 cursor-not-allowed" : ""}
          `}
          style={{
            backgroundColor: theme.colors.lampLight + "20",
            border: `1px solid ${theme.colors.lampLight}40`,
            color: theme.colors.lampLight,
          }}
        >
          <Download size={16} />
          导出帧
        </button>

        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: theme.colors.text,
          }}
        >
          <Upload size={16} />
          导入回放
        </button>

        {isPlayback && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.colors.accent + "20",
              border: `1px solid ${theme.colors.accent}40`,
              color: theme.colors.accent,
            }}
          >
            <RotateCcw size={16} />
            返回编辑
          </button>
        )}
      </div>

      {isPlayback && (
        <div className="text-center text-sm py-2 px-4 rounded-lg animate-pulse" style={{ backgroundColor: theme.colors.lampLight + "15", color: theme.colors.lampLight }}>
          🎬 正在回放导出的动画帧
        </div>
      )}
    </div>
  );
}
