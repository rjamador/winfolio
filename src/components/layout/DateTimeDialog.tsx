import { useEffect, useState } from "react";
import { AnalogClock, Button95, Dialog } from "@/components/win95";
import { useT } from "@/i18n";

type DateTimeDialogProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * A "Date/Time Properties" dialog: a pixel analog clock plus the digital date
 * and time, ticking once a second. Decorative — it shows the time, it doesn't
 * set it.
 */
export function DateTimeDialog({ open, onClose }: DateTimeDialogProps) {
  const { t, locale } = useT();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [open]);

  return (
    <Dialog
      open={open}
      title={t("datetime.title")}
      onClose={onClose}
      footer={
        <Button95 variant="primary" onClick={onClose}>
          {t("common.ok")}
        </Button95>
      }
    >
      <div className="flex flex-col items-center gap-3">
        <AnalogClock date={now} size={112} />
        <p className="text-w95-lg font-bold tabular-nums">
          {now.toLocaleTimeString(locale)}
        </p>
        <p className="text-w95">
          {now.toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </Dialog>
  );
}
