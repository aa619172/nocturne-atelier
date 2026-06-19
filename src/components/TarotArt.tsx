import type { ComponentType, ReactNode } from 'react'

const gold = '#c9a96e'
const goldDim = '#a68a55'
const wine = '#7a2e2e'
const dark = '#14101c'
const fg = '#eae3d8'
const muted = '#998f80'

type ArtProps = { className?: string }

function ArtSvg({ className, children }: ArtProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function FoolArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <circle cx="50" cy="18" r="10" stroke={gold} strokeWidth="0.6" opacity="0.5" />
      <path d="M50 28 L50 72" stroke={gold} strokeWidth="0.7" />
      <path d="M38 42 L62 42" stroke={gold} strokeWidth="0.6" />
      <path d="M42 72 L42 88 M58 72 L58 88" stroke={gold} strokeWidth="0.6" />
      <path d="M32 88 Q50 96 68 88" stroke={goldDim} strokeWidth="0.5" opacity="0.7" />
      <circle cx="72" cy="52" r="5" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M72 47 L72 38 M69 41 L75 41" stroke={gold} strokeWidth="0.4" />
      <path d="M18 78 Q28 68 22 58" stroke={muted} strokeWidth="0.5" opacity="0.6" />
      <path d="M14 82 L20 76" stroke={goldDim} strokeWidth="0.4" />
      <path d="M78 78 L84 72" stroke={gold} strokeWidth="0.5" />
      <circle cx="84" cy="70" r="1.5" fill={gold} opacity="0.6" />
    </ArtSvg>
  )
}

function MagicianArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M30 22 L70 22" stroke={goldDim} strokeWidth="0.4" opacity="0.5" />
      <path d="M50 22 L50 32" stroke={gold} strokeWidth="0.5" />
      <path d="M48 18 L52 18 L50 14 Z" fill={gold} opacity="0.7" />
      <rect x="28" y="68" width="44" height="6" rx="1" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M50 38 L50 68" stroke={gold} strokeWidth="0.6" />
      <path d="M42 48 L58 48" stroke={gold} strokeWidth="0.5" />
      <path d="M34 74 L34 82 M66 74 L66 82" stroke={goldDim} strokeWidth="0.5" />
      <path d="M34 82 L30 90 M66 82 L70 90" stroke={gold} strokeWidth="0.5" />
      <line x1="36" y1="71" x2="36" y2="76" stroke={wine} strokeWidth="1.2" />
      <ellipse cx="50" cy="71" rx="3" ry="2" stroke={gold} strokeWidth="0.5" fill="none" />
      <path d="M62 71 L66 74 L62 77 Z" stroke={gold} strokeWidth="0.4" fill={dark} />
      <circle cx="64" cy="71" r="2.5" stroke={gold} strokeWidth="0.4" fill="none" />
    </ArtSvg>
  )
}

function HighPriestessArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <rect x="32" y="28" width="8" height="52" stroke={gold} strokeWidth="0.6" fill={dark} />
      <rect x="60" y="28" width="8" height="52" stroke={gold} strokeWidth="0.6" fill={dark} />
      <text x="36" y="42" fill={goldDim} fontSize="6" fontFamily="serif">B</text>
      <text x="64" y="42" fill={goldDim} fontSize="6" fontFamily="serif">J</text>
      <path d="M46 30 L54 30 L50 22 Z" stroke={gold} strokeWidth="0.5" fill={dark} />
      <circle cx="50" cy="20" r="4" stroke={gold} strokeWidth="0.4" fill="none" />
      <path d="M44 52 L56 52" stroke={goldDim} strokeWidth="0.4" />
      <rect x="46" y="56" width="8" height="14" rx="1" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M48 58 L48 68 M52 58 L52 68" stroke={goldDim} strokeWidth="0.3" opacity="0.6" />
      <path d="M40 82 Q50 88 60 82" stroke={gold} strokeWidth="0.5" fill={dark} />
      <ellipse cx="50" cy="48" rx="6" ry="8" stroke={gold} strokeWidth="0.5" fill={dark} />
    </ArtSvg>
  )
}

function EmpressArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M20 78 Q50 58 80 78" stroke={goldDim} strokeWidth="0.5" opacity="0.6" />
      <path d="M30 78 Q50 64 70 78" stroke={gold} strokeWidth="0.4" opacity="0.5" />
      <circle cx="50" cy="18" r="8" stroke={gold} strokeWidth="0.5" fill="none" />
      <path d="M42 18 Q50 10 58 18" stroke={gold} strokeWidth="0.4" fill={gold} opacity="0.3" />
      <path d="M50 26 L50 48" stroke={gold} strokeWidth="0.6" />
      <path d="M44 36 Q50 32 56 36" stroke={gold} strokeWidth="0.5" />
      <path d="M38 48 L62 48" stroke={gold} strokeWidth="0.5" />
      <path d="M42 48 L42 72 M58 48 L58 72" stroke={gold} strokeWidth="0.5" />
      <path d="M36 72 L64 72" stroke={goldDim} strokeWidth="0.4" />
      <path d="M24 82 Q34 76 30 68 Q38 72 50 70 Q62 72 70 68 Q66 76 76 82" stroke={gold} strokeWidth="0.45" fill={dark} />
      <circle cx="30" cy="70" r="2" fill={gold} opacity="0.5" />
      <circle cx="70" cy="70" r="2" fill={gold} opacity="0.5" />
    </ArtSvg>
  )
}

function LoversArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <circle cx="50" cy="16" r="10" stroke={gold} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M50 26 L50 34" stroke={goldDim} strokeWidth="0.4" />
      <path d="M38 40 L38 72 M62 40 L62 72" stroke={gold} strokeWidth="0.6" />
      <circle cx="38" cy="36" r="5" stroke={gold} strokeWidth="0.5" fill={dark} />
      <circle cx="62" cy="36" r="5" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M34 48 L42 48 M58 48 L66 48" stroke={goldDim} strokeWidth="0.4" />
      <path d="M44 78 Q50 84 56 78" stroke={gold} strokeWidth="0.5" />
      <path d="M36 72 L36 82 M64 72 L64 82" stroke={gold} strokeWidth="0.5" />
      <path d="M46 58 Q50 62 54 58" stroke={wine} strokeWidth="0.5" fill="none" />
      <path d="M28 52 L24 48 M72 52 L76 48" stroke={muted} strokeWidth="0.4" opacity="0.5" />
    </ArtSvg>
  )
}

function StrengthArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M50 16 L54 24 L62 24 L56 30 L58 38 L50 34 L42 38 L44 30 L38 24 L46 24 Z" stroke={gold} strokeWidth="0.4" fill={gold} opacity="0.25" />
      <circle cx="38" cy="40" r="6" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M38 34 L38 30 M34 36 L42 36" stroke={goldDim} strokeWidth="0.4" />
      <path d="M48 44 L48 78" stroke={gold} strokeWidth="0.6" />
      <path d="M44 52 L52 52" stroke={gold} strokeWidth="0.5" />
      <ellipse cx="68" cy="62" rx="12" ry="10" stroke={gold} strokeWidth="0.6" fill={dark} />
      <path d="M58 58 Q62 52 66 58" stroke={gold} strokeWidth="0.5" />
      <path d="M64 68 L72 68" stroke={goldDim} strokeWidth="0.4" />
      <path d="M66 72 L70 76 M70 72 L66 76" stroke={gold} strokeWidth="0.4" />
      <path d="M42 78 L42 88 M54 78 L54 88" stroke={gold} strokeWidth="0.5" />
      <path d="M60 62 L56 66" stroke={gold} strokeWidth="0.5" />
    </ArtSvg>
  )
}

function HermitArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M16 92 L84 92" stroke={goldDim} strokeWidth="0.5" opacity="0.5" />
      <path d="M24 92 L40 68 L60 72 L76 92" stroke={muted} strokeWidth="0.5" fill={dark} opacity="0.6" />
      <path d="M48 38 L48 78" stroke={gold} strokeWidth="0.6" />
      <circle cx="48" cy="32" r="6" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M44 28 L52 28" stroke={goldDim} strokeWidth="0.4" />
      <path d="M58 48 L58 88" stroke={gold} strokeWidth="0.7" />
      <circle cx="62" cy="42" r="8" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M58 42 L66 42 M62 38 L62 46" stroke={gold} strokeWidth="0.4" />
      <circle cx="62" cy="42" r="3" fill={gold} opacity="0.35" />
      <path d="M42 78 L42 88 M54 78 L54 88" stroke={gold} strokeWidth="0.5" />
    </ArtSvg>
  )
}

function WheelOfFortuneArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <circle cx="50" cy="52" r="28" stroke={gold} strokeWidth="0.7" fill={dark} />
      <circle cx="50" cy="52" r="20" stroke={goldDim} strokeWidth="0.4" fill="none" opacity="0.6" />
      <path d="M50 24 L50 80 M24 52 L76 52 M32 34 L68 70 M68 34 L32 70" stroke={goldDim} strokeWidth="0.35" opacity="0.5" />
      <circle cx="50" cy="52" r="6" stroke={gold} strokeWidth="0.5" fill={gold} opacity="0.2" />
      <path d="M46 20 L50 14 L54 20" stroke={gold} strokeWidth="0.5" fill={gold} opacity="0.4" />
      <path d="M46 84 L50 90 L54 84" stroke={gold} strokeWidth="0.5" fill={gold} opacity="0.4" />
      <text x="47" y="30" fill={gold} fontSize="5" fontFamily="serif">T</text>
      <text x="47" y="78" fill={goldDim} fontSize="5" fontFamily="serif">A</text>
      <path d="M18 52 Q14 44 18 36" stroke={muted} strokeWidth="0.4" opacity="0.5" />
      <path d="M82 52 Q86 60 82 68" stroke={muted} strokeWidth="0.4" opacity="0.5" />
    </ArtSvg>
  )
}

function DeathArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M20 88 L80 88" stroke={goldDim} strokeWidth="0.4" opacity="0.5" />
      <ellipse cx="50" cy="72" rx="18" ry="6" stroke={goldDim} strokeWidth="0.4" fill="none" opacity="0.4" />
      <path d="M38 72 L38 48 M62 72 L62 48" stroke={gold} strokeWidth="0.5" />
      <circle cx="50" cy="38" r="10" stroke={gold} strokeWidth="0.6" fill={dark} />
      <circle cx="46" cy="36" r="2" fill={fg} opacity="0.8" />
      <circle cx="54" cy="36" r="2" fill={fg} opacity="0.8" />
      <path d="M46 42 Q50 46 54 42" stroke={fg} strokeWidth="0.4" fill="none" opacity="0.6" />
      <rect x="68" y="44" width="14" height="10" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M70 46 L82 46 M70 50 L80 50 M70 54 L82 54" stroke={wine} strokeWidth="0.5" opacity="0.7" />
      <path d="M28 60 L34 54 M72 60 L66 54" stroke={goldDim} strokeWidth="0.4" />
    </ArtSvg>
  )
}

function TowerArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M36 88 L36 36 L50 24 L64 36 L64 88" stroke={gold} strokeWidth="0.6" fill={dark} />
      <path d="M40 88 L40 44 L50 36 L60 44 L60 88" stroke={goldDim} strokeWidth="0.4" fill="none" opacity="0.5" />
      <path d="M32 36 L68 28" stroke={gold} strokeWidth="0.5" />
      <path d="M50 12 L44 28 L56 28 Z" stroke={gold} strokeWidth="0.5" fill={wine} opacity="0.4" />
      <path d="M28 20 L36 32" stroke={gold} strokeWidth="0.8" />
      <path d="M72 16 L64 30" stroke={gold} strokeWidth="0.8" />
      <circle cx="28" cy="18" r="3" fill={gold} opacity="0.5" />
      <path d="M42 56 L38 68 L46 64 Z" stroke={fg} strokeWidth="0.4" fill={fg} opacity="0.5" />
      <path d="M58 52 L54 66 L62 62 Z" stroke={fg} strokeWidth="0.4" fill={fg} opacity="0.5" />
      <path d="M48 72 L44 84 L52 80 Z" stroke={fg} strokeWidth="0.4" fill={fg} opacity="0.4" />
    </ArtSvg>
  )
}

function StarArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M20 78 Q50 68 80 78" stroke={goldDim} strokeWidth="0.4" opacity="0.5" />
      <path d="M36 78 L36 92 M64 78 L64 92" stroke={gold} strokeWidth="0.5" opacity="0.6" />
      <path d="M44 78 L44 88 M56 78 L56 88" stroke={goldDim} strokeWidth="0.4" opacity="0.5" />
      <path d="M50 48 L50 76" stroke={gold} strokeWidth="0.5" />
      <ellipse cx="50" cy="44" rx="5" ry="8" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M50 16 L52 24 L60 24 L54 28 L56 36 L50 32 L44 36 L46 28 L40 24 L48 24 Z" stroke={gold} strokeWidth="0.4" fill={gold} opacity="0.35" />
      <path d="M28 28 L30 32 L34 32 L31 35 L32 39 L28 37 L24 39 L25 35 L22 32 L26 32 Z" stroke={goldDim} strokeWidth="0.3" fill={gold} opacity="0.25" />
      <path d="M72 34 L73 37 L76 37 L74 39 L75 42 L72 40 L69 42 L70 39 L68 37 L71 37 Z" stroke={goldDim} strokeWidth="0.3" fill={gold} opacity="0.25" />
      <circle cx="62" cy="22" r="1.5" fill={gold} opacity="0.6" />
      <circle cx="34" cy="20" r="1" fill={gold} opacity="0.4" />
    </ArtSvg>
  )
}

function MoonArt({ className }: ArtProps) {
  return (
    <ArtSvg className={className}>
      <path d="M20 88 L80 88" stroke={goldDim} strokeWidth="0.4" opacity="0.4" />
      <path d="M32 88 L32 56 L68 56 L68 88" stroke={gold} strokeWidth="0.5" fill={dark} />
      <path d="M38 56 L38 44 L62 44 L62 56" stroke={goldDim} strokeWidth="0.4" fill="none" />
      <path d="M36 88 L36 72 L44 72 L44 88 M56 88 L56 72 L64 72 L64 88" stroke={goldDim} strokeWidth="0.35" opacity="0.6" />
      <path d="M30 28 Q42 18 50 28 Q58 38 70 28" stroke={gold} strokeWidth="0.6" fill={gold} opacity="0.2" />
      <circle cx="50" cy="24" r="12" stroke={gold} strokeWidth="0.5" fill="none" />
      <path d="M44 24 A6 6 0 0 0 56 24 A8 8 0 0 1 44 24" fill={gold} opacity="0.35" />
      <path d="M22 72 Q18 68 22 64" stroke={muted} strokeWidth="0.5" fill="none" />
      <path d="M20 74 L24 70 M22 76 L26 72" stroke={goldDim} strokeWidth="0.35" />
      <path d="M76 70 Q80 66 76 62" stroke={muted} strokeWidth="0.5" fill="none" />
      <ellipse cx="50" cy="92" rx="8" ry="3" stroke={goldDim} strokeWidth="0.4" fill={dark} opacity="0.5" />
      <path d="M46 91 L48 89 L50 91 L52 89 L54 91" stroke={gold} strokeWidth="0.3" opacity="0.5" />
    </ArtSvg>
  )
}


const ART_MAP: Record<string, ComponentType<ArtProps>> = {
  'the-fool': FoolArt,
  'the-magician': MagicianArt,
  'the-high-priestess': HighPriestessArt,
  'the-empress': EmpressArt,
  'the-lovers': LoversArt,
  strength: StrengthArt,
  'the-hermit': HermitArt,
  'wheel-of-fortune': WheelOfFortuneArt,
  death: DeathArt,
  'the-tower': TowerArt,
  'the-star': StarArt,
  'the-moon': MoonArt,
}

export function TarotIllustration({ cardId, className }: { cardId: string; className?: string }) {
  const Art = ART_MAP[cardId]
  if (!Art) return null
  return <Art className={className} />
}
