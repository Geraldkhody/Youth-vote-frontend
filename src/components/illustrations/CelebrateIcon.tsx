// Step icon: a trophy with confetti, for the awards night.
export function CelebrateIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Awards night celebration icon" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 12h14v11a7 7 0 0 1-14 0z" fill="var(--color-accent)" />
      <path d="M17 15h-6a7 7 0 0 0 7 9z" fill="var(--color-accent-dark)" />
      <path d="M31 15h6a7 7 0 0 1-7 9z" fill="var(--color-accent-dark)" />
      <rect x="21" y="30" width="6" height="6" fill="var(--color-accent-dark)" />
      <rect x="15" y="36" width="18" height="4" rx="1" fill="var(--color-accent-dark)" />
      <rect x="6" y="8" width="4" height="4" fill="var(--color-primary)" transform="rotate(20 8 10)" />
      <rect x="38" y="20" width="4" height="4" fill="var(--color-primary)" transform="rotate(-15 40 22)" />
      <circle cx="40" cy="8" r="2.5" fill="var(--color-primary)" />
      <circle cx="8" cy="26" r="2.5" fill="var(--color-primary)" />
    </svg>
  )
}
