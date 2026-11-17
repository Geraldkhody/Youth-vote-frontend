// Step icon: a phone with a USSD-style menu, representing Mobile Money voting.
export function VoteIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Vote by mobile money icon" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="5" width="20" height="38" rx="4" fill="var(--brand-light)" stroke="var(--brand-fill)" strokeWidth="2" />
      <line x1="18" y1="14" x2="30" y2="14" stroke="var(--brand-fill)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="20" x2="30" y2="20" stroke="var(--brand-fill)" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="26" x2="26" y2="26" stroke="var(--brand-fill)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="37" r="2.5" fill="var(--brand-fill)" />
      <circle cx="35" cy="32" r="9" fill="var(--accent-fill)" />
      <path d="M31 32l3 3 5-6" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
