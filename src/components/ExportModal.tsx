import { useState, useEffect } from "react";
import { X, Copy, Download, Check, Loader2 } from "lucide-react";
import type { FrameData, Theme } from "@/engine/types";
import { serializeFrameData, copyFrameDataToClipboard, downloadFrameData } from "@/engine/frames";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  frameData: FrameData | null;
  theme: Theme;
  isCapturing: boolean;
  captureProgress: number;
}

export default function ExportModal({
  isOpen,
  onClose,
  frameData,
  theme,
  isCapturing,
  captureProgress,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (!frameData) return;
    const success = await copyFrameDataToClipboard(frameData);
    if (success) {
      setCopied(true);
    }
  };

  const handleDownload = () => {
    if (!frameData) return;
    const filename = `snowcard-${theme.id}-${Date.now()}.json`;
    downloadFrameData(frameData, filename);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
            导出动画帧
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: theme.colors.text }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isCapturing ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 size={40} className="animate-spin" style={{ color: theme.colors.accent }} />
              <p className="text-lg" style={{ color: theme.colors.text }}>
                正在捕获动画帧...
              </p>
              <div className="w-64 h-3 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${captureProgress}%`,
                    backgroundColor: theme.colors.accent,
                  }}
                />
              </div>
              <p className="text-sm opacity-70" style={{ color: theme.colors.text }}>
                {Math.round(captureProgress)}%
              </p>
            </div>
          ) : frameData ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: theme.colors.accent + "30",
                    border: `1px solid ${theme.colors.accent}60`,
                    color: theme.colors.text,
                  }}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "已复制" : "复制到剪贴板"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: theme.colors.lampLight + "20",
                    border: `1px solid ${theme.colors.lampLight}40`,
                    color: theme.colors.lampLight,
                  }}
                >
                  <Download size={18} />
                  下载文件
                </button>
              </div>

              <div className="text-center text-sm opacity-70" style={{ color: theme.colors.text }}>
                共 {frameData.frameCount} 帧，{frameData.fps} FPS，约 {Math.round(frameData.frameCount / frameData.fps)} 秒
              </div>

              <div className="mt-4">
                <p className="text-sm mb-2 opacity-70" style={{ color: theme.colors.text }}>数据预览：</p>
                <textarea
                  readOnly
                  value={serializeFrameData(frameData).slice(0, 500) + "\n..."}
                  className="w-full h-40 p-3 rounded-lg font-mono text-xs resize-none"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: theme.colors.text,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
