// Step icon: a magnifying glass over a checklist, for committee review.
export function ReviewIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Committee review icon" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="26" height="32" rx="3" fill="var(--brand-light)" stroke="var(--brand-fill)" strokeWidth="2" />
      <path d="M14 17h12M14 24h12M14 31h7" stroke="var(--brand-fill)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="32" r="8" fill="var(--surface)" stroke="var(--accent-fill)" strokeWidth="2.5" />
      <line x1="38" y1="38" x2="43" y2="43" stroke="var(--accent-fill)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
