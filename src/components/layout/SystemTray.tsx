import { PixelIcon } from "@/components/win95";
import { useSoundEnabled } from "@/hooks/useSoundEnabled";
import { playSound } from "@/lib/sounds";
import { useT } from "@/i18n";

/**
 * Faux Win95 system tray: a sunken well beside the clock. The alarm glyph is
 * decorative; the speaker is a real toggle that mutes/unmutes the desktop
 * sounds (mirrors the checkbox in Settings — both share one preference).
 */
export function SystemTray() {
  const [soundOn, setSoundOn] = useSoundEnabled();
  const { t } = useT();

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (next) playSound("ding");
  };

  return (
    <div className="bevel-sunken flex items-center gap-1.5 px-1.5 py-0.5">
      <PixelIcon name="alarm" />
      <button
        type="button"
        onClick={toggleSound}
        aria-label={soundOn ? t("tray.mute") : t("tray.unmute")}
        className="focus-ring flex items-center text-w95-text"
      >
        <PixelIcon name={soundOn ? "volume" : "volume-x"} />
      </button>
    </div>
  );
}
