/**
 * Apex Academy mark.
 *
 * A monoline capital A drawn as a summit — the apex you climb. The crossbar is
 * split in two: the left segment in brand colour, the right in a muted tone, so
 * the letter doubles as a progress bar. No gradients, no illustration; it holds
 * up at 16 px (favicon) and at header size because it is three strokes.
 */

export function Mark({
  size = 28,
  className = "",
  /** filled rounded square with the A knocked out — used for the favicon/badge */
  badge = false,
  /** colour of the knocked-out A on the badge */
  knockout = "var(--c-bg, #fff)",
  /** corner radius of the badge square, in viewBox units (0–16) */
  radius = 8,
}: {
  size?: number;
  className?: string;
  badge?: boolean;
  knockout?: string;
  radius?: number;
}) {
  if (badge) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="Apex Academy"
      >
        <rect width="32" height="32" rx={radius} fill="currentColor" />
        <g
          fill="none"
          stroke={knockout}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.5 24 L16 8 L24.5 24" />
          <path d="M11.6 18.4 H16" />
          <path d="M16 18.4 H20.4" opacity="0.45" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Apex Academy"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.5 24 L16 8 L24.5 24" />
        <path d="M11.6 18.4 H16" />
        <path d="M16 18.4 H20.4" opacity="0.4" />
      </g>
    </svg>
  );
}

/**
 * Apex Academy mascot — a trailblazer otter in a green hoodie, replacing the lettered Mark on
 * the home page. The PNGs are already a filled circle with transparent corners (their own
 * background baked in per theme), so this never needs clipping or a radius.
 *
 * Both variants are rendered and CSS shows the one matching data-theme, which
 * the inline script in layout.tsx sets before paint: choosing in React would
 * flash the light icon on a dark page until the settings load.
 */
export function MascotMark({
  size = 30,
  className = "",
  label = "Apex Academy",
}: {
  size?: number;
  className?: string;
  /** accessible name; empty string makes it decorative */
  label?: string;
}) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {(["light", "dark"] as const).map((v) => (
        // eslint-disable-next-line @next/next/no-img-element -- fixed small icon from /public, no Image loader needed
        <img
          key={v}
          src={`/mascot/apex-academy-mascota-verde-icon-${v}.png`}
          width={size}
          height={size}
          alt=""
          className={`mascot-${v}`}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );
}

export function Logo({
  size = 28,
  compact = false,
  className = "",
}: {
  size?: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} className="text-brand shrink-0" />
      {!compact && (
        <span className="flex items-baseline gap-1.5 leading-none">
          <span className="font-bold tracking-[-0.025em] text-[0.975rem] text-heading">
            Apex
          </span>
          <span className="text-[0.975rem] tracking-[-0.01em] text-muted">
            Academy
          </span>
        </span>
      )}
    </span>
  );
}
