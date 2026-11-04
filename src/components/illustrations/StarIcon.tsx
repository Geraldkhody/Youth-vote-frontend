// Simple star badge used on category cards.
export function StarIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Award category icon" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="var(--color-accent-light)" />
      <path
        d="M24 10l4.3 9 9.9 1.4-7.2 7 1.7 9.8L24 32.3l-8.7 4.9 1.7-9.8-7.2-7 9.9-1.4z"
        fill="var(--color-accent)"
      />
    </svg>
  )
}
