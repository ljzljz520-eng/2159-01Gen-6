import { useState, useRef, useCallback } from "react";
import type { Theme, FrameData } from "@/engine/types";
import { DEFAULT_FPS } from "@/engine/types";
import { getDefaultTheme } from "@/engine/themes";
import { createFrameData } from "@/engine/frames";
import CardCanvas from "@/components/CardCanvas";
import ThemeSelector from "@/components/ThemeSelector";
import ControlPanel from "@/components/ControlPanel";
import ExportModal from "@/components/ExportModal";
import ImportModal from "@/components/ImportModal";

const CAPTURE_DURATION = 5;
const CAPTURE_FPS = 15;

export default function Home() {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [playbackData, setPlaybackData] = useState<FrameData | null>(null);

  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [exportedData, setExportedData] = useState<FrameData | null>(null);

  const capturedFramesRef = useRef<string[]>([]);
  const captureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleFrameCapture = useCallback((frame: string) => {
    if (isCapturing) {
      capturedFramesRef.current.push(frame);
    }
  }, [isCapturing]);

  const handleExport = () => {
    setShowExport(true);
    setIsCapturing(true);
    setCaptureProgress(0);
    capturedFramesRef.current = [];
    setExportedData(null);

    const totalFrames = CAPTURE_DURATION * CAPTURE_FPS;
    let framesCaptured = 0;

    captureIntervalRef.current = setInterval(() => {
      framesCaptured++;
      setCaptureProgress((framesCaptured / totalFrames) * 100);

      if (framesCaptured >= totalFrames) {
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }

        captureTimerRef.current = setTimeout(() => {
          const frameData = createFrameData(
            theme.id,
            capturedFramesRef.current,
            CAPTURE_FPS
          );
          setExportedData(frameData);
          setIsCapturing(false);
          setCaptureProgress(100);
        }, 300);
      }
    }, 1000 / CAPTURE_FPS);
  };

  const handleCloseExport = () => {
    setShowExport(false);
    if (captureTimerRef.current) {
      clearTimeout(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    setIsCapturing(false);
    setExportedData(null);
    capturedFramesRef.current = [];
  };

  const handleImport = (frameData: FrameData, targetTheme: Theme) => {
    setPlaybackData(frameData);
    setTheme(targetTheme);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setPlaybackData(null);
    setIsPlaying(true);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #000000 100%)`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: theme.colors.lampLight }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6">
        <header className="text-center mb-2">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 tracking-wide"
            style={{ color: theme.colors.text }}
          >
            ❄️ 字符雪景贺卡 ❄️
          </h1>
          <p className="text-sm opacity-60" style={{ color: theme.colors.text }}>
            选择主题，观看雪花飘落，导出分享你的祝福
          </p>
        </header>

        <ThemeSelector
          currentTheme={theme}
          onThemeChange={handleThemeChange}
          disabled={!!playbackData}
        />

        <div className="flex justify-center">
          <CardCanvas
            theme={theme}
            isPlaying={isPlaying}
            speed={speed}
            onFrameCapture={handleFrameCapture}
            playbackData={playbackData}
          />
        </div>

        <ControlPanel
          theme={theme}
          isPlaying={isPlaying}
          speed={speed}
          isPlayback={!!playbackData}
          onPlayToggle={handlePlayToggle}
          onSpeedChange={handleSpeedChange}
          onExport={handleExport}
          onImport={() => setShowImport(true)}
          onReset={handleReset}
        />

        <footer className="text-center text-xs opacity-40 mt-4" style={{ color: theme.colors.text }}>
          提示：导出动画帧后，可以分享给朋友，他们可以通过「导入回放」功能重新播放
        </footer>
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={handleCloseExport}
        frameData={exportedData}
        theme={theme}
        isCapturing={isCapturing}
        captureProgress={captureProgress}
      />

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
        theme={theme}
      />
    </div>
  );
}
