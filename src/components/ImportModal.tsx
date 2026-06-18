import { useState } from "react";
import { X, Upload, AlertCircle, Check } from "lucide-react";
import type { FrameData, Theme } from "@/engine/types";
import { deserializeFrameData, readFrameDataFromClipboard } from "@/engine/frames";
import { getThemeById } from "@/engine/themes";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (frameData: FrameData, theme: Theme) => void;
  theme: Theme;
}

export default function ImportModal({
  isOpen,
  onClose,
  onImport,
  theme,
}: ImportModalProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePaste = async () => {
    const data = await readFrameDataFromClipboard();
    if (data) {
      setInput(JSON.stringify(data, null, 2));
      setError(null);
    } else {
      setError("剪贴板中没有有效的帧数据");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const data = deserializeFrameData(input);
    if (!data) {
      setError("无效的帧数据格式，请检查输入");
      return;
    }

    const targetTheme = getThemeById(data.themeId);
    if (!targetTheme) {
      setError(`未知的主题ID: ${data.themeId}`);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onImport(data, targetTheme);
      setInput("");
      setError(null);
      setSuccess(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            导入动画帧
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: theme.colors.text }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex gap-3">
            <button
              onClick={handlePaste}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: theme.colors.text,
              }}
            >
              📋 从剪贴板粘贴
            </button>
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.colors.lampLight + "20",
                border: `1px solid ${theme.colors.lampLight}40`,
                color: theme.colors.lampLight,
              }}
            >
              <Upload size={16} />
              选择文件
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <p className="text-sm mb-2 opacity-70" style={{ color: theme.colors.text }}>
              或粘贴帧数据 JSON：
            </p>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder='{"version": "1.0", "themeId": "christmas-eve", "frames": [...]}'
              className="w-full h-40 p-3 rounded-lg font-mono text-sm resize-none"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: theme.colors.text,
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                color: "#fca5a5",
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                color: "#86efac",
              }}
            >
              <Check size={16} />
              导入成功！
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!input.trim() || success}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: theme.colors.accent + "30",
              border: `1px solid ${theme.colors.accent}60`,
              color: theme.colors.text,
            }}
          >
            {success ? <Check size={18} /> : <Upload size={18} />}
            {success ? "导入成功" : "开始回放"}
          </button>
        </div>
      </div>
    </div>
  );
}
