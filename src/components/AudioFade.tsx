"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FiUpload, FiDownload, FiRefreshCw, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import { MdAudiotrack } from "react-icons/md";
import { useFFmpeg } from "@/hooks/useFFmpeg";

interface Props { locale?: string; }

const REENCODE_CODEC: Record<string, string[]> = {
  mp3: ["-acodec", "libmp3lame", "-q:a", "2"],
  wav: ["-acodec", "pcm_s16le"],
  ogg: ["-acodec", "libvorbis", "-q:a", "5"],
  flac: ["-acodec", "flac"],
  m4a: ["-acodec", "aac", "-b:a", "192k"],
  aac: ["-acodec", "aac", "-b:a", "192k"],
};

const MIME_MAP: Record<string, string> = {
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
  flac: "audio/flac", m4a: "audio/mp4", aac: "audio/aac",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDuration(secs: number): string {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioFade({ locale = "es" }: Props) {
  const isEs = locale === "es";

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const audioUrlRef = useRef("");
  const audioElRef = useRef<HTMLAudioElement>(null);

  const { ffmpegRef, ffmpegLoaded, loadFFmpeg, progress } = useFFmpeg(isEs);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fadeInOn, setFadeInOn] = useState(true);
  const [fadeOutOn, setFadeOutOn] = useState(true);
  const [fadeInDur, setFadeInDur] = useState(2);
  const [fadeOutDur, setFadeOutDur] = useState(3);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [resultName, setResultName] = useState("");

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const setAudioUrlSafe = (url: string) => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = url;
    setAudioUrl(url);
  };

  const setResultUrlSafe = (url: string | null) => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = url;
    setResultUrl(url);
  };

  const loadFile = useCallback((f: File) => {
    setError(null);
    setResultUrlSafe(null);
    setResultSize(0);
    setResultName("");
    setDuration(0);
    setAudioUrlSafe(URL.createObjectURL(f));
    setFile(f);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const el = audioElRef.current;
    if (!el) return;
    setDuration(el.duration);
    setFadeOutDur((d) => Math.min(d, Math.max(0.5, el.duration / 2)));
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = "";
  }, [loadFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const resetFile = useCallback(() => {
    setFile(null);
    setAudioUrlSafe("");
    setResultUrlSafe(null);
    setError(null);
  }, []);

  const applyFade = useCallback(async () => {
    if (!file || !duration) return;
    if (!fadeInOn && !fadeOutOn) {
      setError(isEs ? "Activa al menos un fundido." : "Enable at least one fade.");
      return;
    }

    setError(null);
    setResultUrlSafe(null);
    setProcessing(true);

    try {
      if (!ffmpegLoaded) await loadFFmpeg();
      const ff = ffmpegRef.current!;
      const { fetchFile } = await import("@ffmpeg/util");

      const inExt = (file.name.split(".").pop() || "mp3").toLowerCase();
      const inputName = `input.${inExt}`;
      await ff.writeFile(inputName, await fetchFile(file));

      const outExt = inExt in REENCODE_CODEC ? inExt : "mp3";
      const outputFile = `output.${outExt}`;

      const filters: string[] = [];
      if (fadeInOn) filters.push(`afade=t=in:st=0:d=${fadeInDur}`);
      if (fadeOutOn) {
        const start = Math.max(0, duration - fadeOutDur);
        filters.push(`afade=t=out:st=${start}:d=${fadeOutDur}`);
      }

      await ff.exec([
        "-i", inputName,
        "-af", filters.join(","),
        ...REENCODE_CODEC[outExt],
        outputFile,
      ]);

      const data = await ff.readFile(outputFile) as unknown as Uint8Array<ArrayBuffer>;
      const blob = new Blob([data], { type: MIME_MAP[outExt] });
      const url = URL.createObjectURL(blob);
      setResultUrlSafe(url);
      setResultSize(data.byteLength);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setResultName(`${baseName}_fade.${outExt}`);

      try { await ff.deleteFile(inputName); } catch { /* ignore */ }
      try { await ff.deleteFile(outputFile); } catch { /* ignore */ }
    } catch (e) {
      console.error("Audio fade error:", e);
      setError(
        isEs
          ? "Error al aplicar el fundido. Comprueba que el formato es compatible."
          : "Error applying the fade. Check the format is supported."
      );
    } finally {
      setProcessing(false);
    }
  }, [file, duration, fadeInOn, fadeOutOn, fadeInDur, fadeOutDur, ffmpegLoaded, loadFFmpeg, ffmpegRef, isEs]);

  if (!file) {
    return (
      <div className="space-y-4">
        <div
          className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/40 bg-surface/40 p-10 transition-colors hover:border-primary/50 hover:bg-primary/5"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("af-file-input")?.click()}
        >
          <MdAudiotrack className="text-6xl text-primary/40" />
          <div className="text-center">
            <p className="text-base font-medium text-text-muted">
              {isEs ? "Arrastra tu audio aquí o haz clic para seleccionar" : "Drag your audio here or click to select"}
            </p>
            <p className="mt-1.5 text-sm text-text-muted/50">
              MP3, WAV, OGG, FLAC, M4A, AAC {" · "} {isEs ? "sin límite de tamaño artificial" : "no artificial size limit"}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">
            <FiUpload className="text-base" />
            {isEs ? "Seleccionar audio" : "Select audio"}
          </div>
          <input id="af-file-input" type="file" accept="audio/*" className="hidden" onChange={handleFileInput} />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <FiAlertTriangle className="shrink-0" />
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-border/20 bg-surface/30 p-4">
        <audio ref={audioElRef} src={audioUrl} controls onLoadedMetadata={handleLoadedMetadata} className="w-full" />
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{file.name}</p>
            <p className="mt-1 text-sm text-text-muted">
              {formatDuration(duration)} · {formatBytes(file.size)}
            </p>
          </div>
          <button
            onClick={resetFile}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-border/30 bg-surface/60 px-4 py-2 text-sm text-text-muted transition-colors hover:border-border/60 hover:text-text"
          >
            <FiRefreshCw className="text-sm" />
            {isEs ? "Cambiar audio" : "Change audio"}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-xl border border-border/20 bg-surface/30 p-5">
        <div className="space-y-3 rounded-lg border border-border/20 bg-surface/20 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-muted">{isEs ? "Fundido de entrada" : "Fade in"}</label>
            <button
              onClick={() => setFadeInOn((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                fadeInOn ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-surface/60 text-text-muted"
              }`}
            >
              {fadeInOn ? (isEs ? "Activado" : "On") : (isEs ? "Desactivado" : "Off")}
            </button>
          </div>
          {fadeInOn && (
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs text-text-muted/70">{isEs ? "Duración" : "Duration"}</span>
                <span className="text-sm text-primary">{fadeInDur}s</span>
              </div>
              <input
                type="range" min="0.5" max={Math.max(1, duration)} step="0.5" value={fadeInDur}
                onChange={(e) => setFadeInDur(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-border/20 bg-surface/20 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-muted">{isEs ? "Fundido de salida" : "Fade out"}</label>
            <button
              onClick={() => setFadeOutOn((v) => !v)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                fadeOutOn ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-surface/60 text-text-muted"
              }`}
            >
              {fadeOutOn ? (isEs ? "Activado" : "On") : (isEs ? "Desactivado" : "Off")}
            </button>
          </div>
          {fadeOutOn && (
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-xs text-text-muted/70">{isEs ? "Duración" : "Duration"}</span>
                <span className="text-sm text-primary">{fadeOutDur}s</span>
              </div>
              <input
                type="range" min="0.5" max={Math.max(1, duration)} step="0.5" value={fadeOutDur}
                onChange={(e) => setFadeOutDur(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}
        </div>

        <button
          onClick={applyFade}
          disabled={processing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
        >
          {processing ? (
            <>{isEs ? `Procesando… ${progress}%` : `Processing… ${progress}%`}</>
          ) : (
            <><FiTrendingUp /> {isEs ? "Aplicar fundido" : "Apply fade"}</>
          )}
        </button>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <FiAlertTriangle className="shrink-0" />
            {error}
          </div>
        )}
      </div>

      {resultUrl && (
        <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-primary">{isEs ? "Listo" : "Done"}</p>
          <audio src={resultUrl} controls className="w-full" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">{formatBytes(resultSize)}</p>
            <a
              href={resultUrl}
              download={resultName}
              className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <FiDownload /> {isEs ? "Descargar" : "Download"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
