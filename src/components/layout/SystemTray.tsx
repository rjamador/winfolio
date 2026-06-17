import { PixelIcon } from "@/components/win95";

/**
 * Faux Win95 system tray: a sunken well with a couple of static status glyphs
 * next to the clock. Purely decorative — a nostalgic nod, no behavior.
 */
export function SystemTray() {
  return (
    <div
      aria-hidden
      className="bevel-sunken flex items-center gap-1.5 px-1.5 py-0.5"
    >
      <PixelIcon name="alarm" />
      <PixelIcon name="volume" />
    </div>
  );
}
