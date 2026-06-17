type AnalogClockProps = {
  /** The time to display. */
  date: Date;
  /** Width/height in px. */
  size?: number;
};

// A small coordinate space (rendered much larger) so `crispEdges` turns every
// line and the circle into chunky, stair-stepped pixels — matching the retro
// pixel-art look rather than a smooth vector clock.
const VIEWBOX = 32;
const CENTER = 16;
const HOUR_LEN = 8;
const MINUTE_LEN = 11;
const SECOND_LEN = 12;

/** Endpoint of a clock hand at `angleDeg` (0 = 12 o'clock) and length. */
function hand(angleDeg: number, length: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + length * Math.cos(rad),
    y: CENTER + length * Math.sin(rad),
  };
}

/**
 * A pixel-faithful analog clock face (crisp-edged SVG, no anti-aliasing, drawn
 * in a tiny grid and scaled up so the circle and hands read as chunky pixels).
 * Purely presentational: pass it a `Date`.
 */
export function AnalogClock({ date, size = 96 }: AnalogClockProps) {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours() % 12;

  const hourHand = hand((hours + minutes / 60) * 30, HOUR_LEN);
  const minuteHand = hand(minutes * 6, MINUTE_LEN);
  const secondHand = hand(seconds * 6, SECOND_LEN);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={date.toLocaleTimeString()}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r="15"
        fill="var(--w95-light)"
        stroke="var(--w95-darkshadow)"
      />
      {/* Hour ticks (longer at 12/3/6/9). */}
      {Array.from({ length: 12 }, (_, i) => {
        const outer = hand(i * 30, 14);
        const inner = hand(i * 30, i % 3 === 0 ? 12 : 13);
        return (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="var(--w95-text)"
          />
        );
      })}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourHand.x}
        y2={hourHand.y}
        stroke="var(--w95-text)"
        strokeWidth="2"
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteHand.x}
        y2={minuteHand.y}
        stroke="var(--w95-text)"
      />
      <line
        x1={CENTER}
        y1={CENTER}
        x2={secondHand.x}
        y2={secondHand.y}
        stroke="var(--w95-titlebar)"
      />
      <rect
        x={CENTER - 1}
        y={CENTER - 1}
        width="2"
        height="2"
        fill="var(--w95-text)"
      />
    </svg>
  );
}
