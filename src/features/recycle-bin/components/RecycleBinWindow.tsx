import { PixelIcon } from "@/components/win95";
import { useT } from "@/i18n";

/**
 * The Recycle Bin: a deliberately empty window with a wink. A desktop-only
 * decorative nod — there's nothing to restore here.
 */
export function RecycleBinWindow() {
  const { t } = useT();
  return (
    <div className="flex h-full min-h-40 flex-col gap-3 text-w95">
      <div className="bevel-sunken flex flex-1 flex-col items-center justify-center gap-2 bg-w95-light p-4 text-center">
        <PixelIcon name="trash" size={32} />
        <p className="font-bold">{t("recycle.empty")}</p>
        <p className="opacity-70">{t("recycle.description")}</p>
      </div>
    </div>
  );
}
