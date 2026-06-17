import { useEffect, useState } from "react";
import { useT } from "@/i18n";

const SHUTTING_DOWN_MS = 1500;

/**
 * The classic Windows 95 shut-down sequence: a brief "shutting down…" panel,
 * then the amber-on-black "It's now safe to turn off your computer." screen.
 * Clicking anywhere (or any key) "powers it back on" by reloading the app, which
 * re-runs the BootScreen. Respects reduced-motion by skipping the first step.
 */
export function ShutDownScreen() {
  const { t } = useT();
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState<"shutting" | "off">(
    reduceMotion ? "off" : "shutting",
  );

  useEffect(() => {
    if (phase !== "shutting") return;
    const id = setTimeout(() => setPhase("off"), SHUTTING_DOWN_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "off") return;
    const turnBackOn = () => window.location.reload();
    window.addEventListener("pointerdown", turnBackOn);
    window.addEventListener("keydown", turnBackOn);
    return () => {
      window.removeEventListener("pointerdown", turnBackOn);
      window.removeEventListener("keydown", turnBackOn);
    };
  }, [phase]);

  if (phase === "shutting") {
    return (
      <div
        role="alertdialog"
        aria-label={t("shutdown.title")}
        className="fixed inset-0 z-[3000] flex items-center justify-center bg-w95-desktop"
      >
        <p className="text-w95-lg font-bold text-w95-light">
          {t("shutdown.shuttingDown")}
        </p>
      </div>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-label={t("shutdown.safeToTurnOff")}
      aria-live="polite"
      className="fixed inset-0 z-[3000] flex cursor-pointer flex-col items-center justify-center gap-4 bg-black text-center"
    >
      {/* The signature amber MS-DOS message color. */}
      <p className="text-w95-lg font-bold" style={{ color: "#e8a33d" }}>
        {t("shutdown.safeToTurnOff")}
      </p>
      <p className="text-w95 opacity-70" style={{ color: "#e8a33d" }}>
        {t("shutdown.restartHint")}
      </p>
    </div>
  );
}
