// Computes WCAG contrast ratios for the design tokens in src/styles/tokens.css,
// for both the light and dark theme value blocks, and fails if any
// normal-size text pair is below 4.5:1 or any large-size pair is below 3:1.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tokensPath = path.join(__dirname, '..', 'src', 'styles', 'tokens.css')
const css = readFileSync(tokensPath, 'utf8')

function parseBlock(block) {
  const vars = {}
  const re = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi
  let m
  while ((m = re.exec(block))) {
    vars[m[1]] = m[2].trim()
  }
  return vars
}

// Light theme: the top-level :root { ... } block (first one).
const rootMatch = css.match(/:root\s*{([^}]*)}/)
const light = parseBlock(rootMatch[1])

// Dark theme: the :root[data-theme='dark'] { ... } block.
const darkMatch = css.match(/:root\[data-theme=['"]dark['"]\]\s*{([^}]*)}/)
const dark = parseBlock(darkMatch[1])

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

function srgbToLinear(c) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function relativeLuminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1))
  const l2 = relativeLuminance(hexToRgb(hex2))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Text/background pairs that actually occur on the public pages.
// large: true means the text is large-scale (headlines, big buttons) -> 3:1 minimum.
const PAIRS = [
  { name: 'ink on bg', fg: 'ink', bg: 'bg', large: false },
  { name: 'muted on bg', fg: 'muted', bg: 'bg', large: false },
  { name: 'ink on surface', fg: 'ink', bg: 'surface', large: false },
  { name: 'muted on surface', fg: 'muted', bg: 'surface', large: false },
  { name: 'brand on bg', fg: 'brand', bg: 'bg', large: false },
  { name: 'brand on surface', fg: 'brand', bg: 'surface', large: false },
  { name: 'white on brand-fill (primary button)', fg: '#ffffff', bg: 'brand-fill', large: false },
  { name: 'white on brand-fill-hover', fg: '#ffffff', bg: 'brand-fill-hover', large: false },
  { name: 'accent-ink on accent-fill (accent button)', fg: 'accent-ink', bg: 'accent-fill', large: false },
  { name: 'accent-ink on accent-fill-hover', fg: 'accent-ink', bg: 'accent-fill-hover', large: false },
  { name: 'accent on bg (large headline accent)', fg: 'accent', bg: 'bg', large: true },
  { name: 'ink on brand-light', fg: 'ink', bg: 'brand-light', large: false },
  // Admin sidebar (src/components/AdminLayout/AdminLayout.module.css): literal colours
  // aliased through index.css's --color-sidebar(-text) onto the fixed brand fill.
  { name: 'admin sidebar text on brand-fill', fg: '#aab4d6', bg: 'brand-fill', large: false },
  { name: 'admin sidebar active text on brand-fill', fg: '#ffffff', bg: 'brand-fill', large: false },
  // Semantic status pairs (StatusBadge, Toast, InlineError, FilterBar, etc.)
  { name: 'success on success-bg', fg: 'success', bg: 'success-bg', large: false },
  { name: 'warning on warning-bg', fg: 'warning', bg: 'warning-bg', large: false },
  { name: 'danger on danger-bg', fg: 'danger', bg: 'danger-bg', large: false },
  { name: 'info on info-bg', fg: 'info', bg: 'info-bg', large: false },
]

function resolve(vars, token) {
  return token.startsWith('#') ? token : vars[token]
}

let failed = false

for (const themeName of ['light', 'dark']) {
  const vars = themeName === 'light' ? light : dark
  console.log(`\n${themeName.toUpperCase()} THEME`)
  for (const pair of PAIRS) {
    const fg = resolve(vars, pair.fg)
    const bg = resolve(vars, pair.bg)
    if (!fg || !bg) {
      console.log(`  SKIP  ${pair.name} (missing token)`)
      continue
    }
    const ratio = contrastRatio(fg, bg)
    const threshold = pair.large ? 3 : 4.5
    const ok = ratio >= threshold
    if (!ok) failed = true
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${pair.name}: ${ratio.toFixed(2)}:1 (needs ${threshold}:1) [${fg} on ${bg}]`,
    )
  }
}

if (failed) {
  console.error('\nContrast check FAILED. Adjust tokens.css until all pairs pass.')
  process.exit(1)
} else {
  console.log('\nAll contrast pairs pass.')
}
