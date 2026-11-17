// Brand-coloured SVG fill patterns used as ImageCard backgrounds when there is no photo.
const PALETTES = ['var(--brand-fill)', 'var(--accent-fill)', 'var(--brand-fill-hover)', 'var(--accent-fill-hover)']

type PatternBackgroundProps = {
  variant: number
}

export function PatternBackground({ variant }: PatternBackgroundProps) {
  const base = PALETTES[variant % PALETTES.length]
  const dot = PALETTES[(variant + 1) % PALETTES.length]

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill={base} />
      {variant % 2 === 0 ? (
        <g opacity="0.35" fill={dot}>
          <circle cx="40" cy="40" r="60" />
          <circle cx="340" cy="90" r="90" />
          <circle cx="200" cy="260" r="70" />
        </g>
      ) : (
        <g opacity="0.3" stroke={dot} strokeWidth="18" fill="none">
          <path d="M-20 60 L420 260" />
          <path d="M-20 160 L420 -40" />
          <path d="M-20 260 L420 60" />
        </g>
      )}
    </svg>
  )
}
