"use client";

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { useCallback, useEffect, useRef, useState } from "react";

// Shared loader for the audio/video tool family — every tool using FFmpeg.wasm
// pulls the same core build from the same CDN, so this is the one place that
// pattern lives instead of being copy-pasted per tool.
export function useFFmpeg(isEs: boolean) {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (ffmpegRef.current) {
        try { ffmpegRef.current.terminate(); } catch { /* ignore */ }
      }
    };
  }, []);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegLoaded) return;
    try {
      const { FFmpeg: FFmpegClass } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ff = new FFmpegClass();
      ff.on("progress", ({ progress: p }: { progress: number }) => {
        setProgress(Math.round(Math.min(p, 1) * 100));
      });
      const base = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      await ff.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ff;
      setFfmpegLoaded(true);
    } catch {
      throw new Error(isEs ? "Error al cargar FFmpeg. Comprueba tu conexión a internet." : "Error loading FFmpeg. Check your internet connection.");
    }
  }, [ffmpegLoaded, isEs]);

  return { ffmpegRef, ffmpegLoaded, loadFFmpeg, progress, setProgress };
}
