import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { ProgressBar } from "@/components/win95";
import { useT } from "@/i18n";

const DEFAULT_DURATION_MS = 1800;
const STEP_MS = 90;
const FADE_MS = 350;

type BootScreenProps = {
  onDone: () => void;
  /** How long the progress bar takes to fill (ms). */
  durationMs?: number;
};

/**
 * Win95-style boot splash shown on every visit: centered logo + wordmark with
 * a full-width progress strip along the bottom edge,
 * then a fade into the desktop. Honors `prefers-reduced-motion`.
 */
export function BootScreen({
  onDone,
  durationMs = DEFAULT_DURATION_MS,
}: BootScreenProps) {
  const { t } = useT();
  const [progress, setProgress] = useState(0);
  const leaving = progress >= 100;

  // Advance the progress bar.
  useEffect(() => {
    const step = Math.ceil(100 / Math.max(1, durationMs / STEP_MS));
    const id = setInterval(
      () => setProgress((p) => (p >= 100 ? p : Math.min(100, p + step))),
      STEP_MS,
    );
    return () => clearInterval(id);
  }, [durationMs]);

  // Once full, fade out then finish (immediately if reduced-motion).
  useEffect(() => {
    if (progress < 100) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = setTimeout(onDone, reduce ? 0 : FADE_MS);
    return () => clearTimeout(id);
  }, [progress, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        // The dark text shadow keeps the splash legible on any desktop color.
        "desktop-icon-legible fixed inset-0 z-2000 flex flex-col items-center justify-center gap-3 bg-w95-desktop transition-opacity duration-300",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      {/* The 32px source upscaled 3× with nearest-neighbor → chunky pixels. */}
      <img
        src="/favicon-32x32.png"
        alt=""
        width={96}
        height={96}
        style={{ imageRendering: "pixelated" }}
      />
      <p className="text-4xl text-w95-light">
        Winfolio <span className="font-bold">95</span>
      </p>
      <p className="text-w95 text-w95-light opacity-90">
        Roberto Amador — Portfolio
      </p>
      <p className="text-w95 text-w95-light opacity-75">{t("boot.starting")}</p>

      <div className="absolute inset-x-0 bottom-0">
        <ProgressBar value={progress} label={t("boot.starting")} />
      </div>
    </div>
  );
}
