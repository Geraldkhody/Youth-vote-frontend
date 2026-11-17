// Feature icon: a phone with signal bars, no wifi symbol, for USSD without internet.
export function UssdIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Works by USSD without internet icon" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="4" width="18" height="34" rx="4" fill="var(--icon-tint-brand)" stroke="var(--brand-fill)" strokeWidth="2" />
      <circle cx="24" cy="32" r="2" fill="var(--brand-fill)" />
      <path d="M12 16a17 17 0 0 1 24 0" stroke="var(--accent-fill)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M17 20a10 10 0 0 1 14 0" stroke="var(--accent-fill)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
