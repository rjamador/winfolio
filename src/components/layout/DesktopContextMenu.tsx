import { useEffect, useRef } from "react";
import { useT } from "@/i18n";

type DesktopContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onMinimizeAll: () => void;
  onRefresh: () => void;
  onProperties: () => void;
};

/**
 * The classic right-click desktop menu (Minimize All Windows / Refresh /
 * Properties). Positioned at the cursor; closes on outside click, Escape, or
 * item choice.
 */
export function DesktopContextMenu({
  x,
  y,
  onClose,
  onMinimizeAll,
  onRefresh,
  onProperties,
}: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const { t } = useT();
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };

  const itemClass =
    "focus-ring flex w-full px-4 py-1 text-left text-w95 hover:bg-w95-titlebar hover:text-w95-titlebar-text";

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Desktop"
      style={{ left: x, top: y }}
      className="bevel-raised absolute z-[1500] min-w-44 bg-w95-bg py-1"
    >
      <button type="button" role="menuitem" className={itemClass} onClick={run(onMinimizeAll)}>
        {t("desktop.minimizeAll")}
      </button>
      <button type="button" role="menuitem" className={itemClass} onClick={run(onRefresh)}>
        {t("desktop.refresh")}
      </button>
      <hr className="my-1 border-0 border-t border-t-w95-shadow" />
      <button type="button" role="menuitem" className={itemClass} onClick={run(onProperties)}>
        {t("desktop.properties")}
      </button>
    </div>
  );
}
