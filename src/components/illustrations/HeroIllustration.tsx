// Warm-toned hero graphic: two young people on a stage with a trophy.
// prefers-reduced-motion is respected via the .hero-illustration__sparkle CSS rule.
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="Illustration of young people celebrating on a stage with a trophy"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="160" cy="215" rx="140" ry="16" fill="var(--color-accent-light)" />
      <rect x="40" y="150" width="240" height="20" rx="4" fill="var(--color-primary)" />
      <rect x="70" y="170" width="180" height="40" rx="4" fill="var(--color-primary-dark)" />

      {/* Trophy */}
      <g transform="translate(140,70)">
        <circle className="hero-illustration__sparkle" cx="20" cy="-6" r="34" fill="var(--color-accent-light)" />
        <path d="M4 10h32v26a16 16 0 0 1-32 0z" fill="var(--color-accent)" />
        <rect x="12" y="52" width="16" height="10" fill="var(--color-accent-dark)" />
        <rect x="2" y="60" width="36" height="8" rx="2" fill="var(--color-accent-dark)" />
        <path d="M4 14h-10a10 10 0 0 0 10 16z" fill="var(--color-accent)" />
        <path d="M36 14h10a10 10 0 0 1-10 16z" fill="var(--color-accent)" />
      </g>

      {/* Person 1 */}
      <g transform="translate(90,120)">
        <circle cx="0" cy="0" r="14" fill="#f2c29b" />
        <path d="M-16 44c0-18 32-18 32 0z" fill="var(--color-primary)" />
        <rect x="-5" y="18" width="10" height="20" fill="#f2c29b" />
      </g>

      {/* Person 2, arm raised */}
      <g transform="translate(210,118)">
        <circle cx="0" cy="0" r="14" fill="#c98a5e" />
        <path d="M-16 46c0-18 32-18 32 0z" fill="var(--color-accent)" />
        <rect x="10" y="4" width="8" height="26" rx="4" fill="#c98a5e" transform="rotate(-35 10 4)" />
      </g>
    </svg>
  )
}
