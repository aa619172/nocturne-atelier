export type Release = {
  id: string
  num: string
  title: string
  duration: string
  previewSrc: string
}

export const works = [
  {
    num: 'I.',
    title: 'Vesper Hymns',
    meta: 'Gothic Ambient · 47:12',
    description:
      'Cathedral drones woven with whispered choir and bowed glass.',
    year: 'MMXXIV',
  },
  {
    num: 'II.',
    title: 'The Hollow Crown',
    meta: 'Horror Score · 32:08',
    description:
      'Commissioned for a silent film of forgotten witches; brass and bone.',
    year: 'MMXXIV',
  },
  {
    num: 'III.',
    title: 'Crescent of Salt',
    meta: 'Arcane Atmosphere · 58:40',
    description:
      'Salt-circle rituals scored for tape loops, harpsichord, and rain.',
    year: 'MMXXIII',
  },
  {
    num: 'IV.',
    title: 'Nocturnes for the Drowned',
    meta: 'Spellbound Classical · 41:20',
    description:
      'Seven nocturnes for piano and submerged string quartet.',
    year: 'MMXXIII',
  },
]

export const tracks: Release[] = [
  {
    id: 'vesper-procession',
    num: '01',
    title: 'Vesper I — Procession',
    duration: '3:44',
    previewSrc: '/audio/vesper-procession.mp3',
  },
  {
    id: 'hollow-overture',
    num: '02',
    title: 'The Hollow Crown — Overture',
    duration: '3:34',
    previewSrc: '/audio/hollow-overture.mp3',
  },
  {
    id: 'crescent-circle',
    num: '03',
    title: 'Crescent of Salt — Circle Drawn',
    duration: '3:40',
    previewSrc: '/audio/crescent-circle.mp3',
  },
  {
    id: 'nocturne-drowned',
    num: '04',
    title: 'Nocturne IV — For the Drowned Bride',
    duration: '2:38',
    previewSrc: '/audio/nocturne-drowned.mp3',
  },
]

export const services = [
  {
    num: '01',
    title: 'Film & Television',
    description:
      'Original scores for gothic features, occult shorts, and slow-horror series.',
  },
  {
    num: '02',
    title: 'Games & Interactive',
    description: 'Adaptive arcane soundscapes for atmosphere-led worlds.',
  },
  {
    num: '03',
    title: 'Ritual & Theatre',
    description:
      'Bespoke music for ceremonies, immersive theatre, and gallery installations.',
  },
  {
    num: '04',
    title: 'Private Commissions',
    description: 'Heirloom compositions — a nocturne written for one listener.',
  },
]

export type MerchandiseItem = {
  id: string
  title: string
  description: string
  price: string
  imageSrc: string
}

export type MerchandiseCategory = {
  id: string
  num: string
  title: string
  description: string
  items: MerchandiseItem[]
}

const merchPlaceholder = '/merch/placeholder.svg'

export const merchandiseCategories: MerchandiseCategory[] = [
  {
    id: 'vestments',
    num: 'I.',
    title: 'Vestments & Raiment',
    description: 'Garments cut for processions, candle-watches, and unlit hours.',
    items: [
      {
        id: 'processional-tee',
        title: 'Processional Tee',
        description: 'Heavy cotton, sigil of the atelier upon the breast — inked in candle-gold.',
        price: 'XXXVIII',
        imageSrc: merchPlaceholder,
      },
      {
        id: 'crescent-sigil-shirt',
        title: 'Crescent Sigil Shirt',
        description: 'Salt-circle emblem at the nape; for those who draw circles after vespers.',
        price: 'XLII',
        imageSrc: merchPlaceholder,
      },
    ],
  },
  {
    id: 'crowns',
    num: 'II.',
    title: 'Crowns & Brims',
    description: 'Headwear for the threshold between daylight and the half-light.',
    items: [
      {
        id: 'vesper-brim',
        title: 'Vesper Brim',
        description: 'Wide-brim felt, wine-stitched band — shade for the listening hour.',
        price: 'XXXIV',
        imageSrc: merchPlaceholder,
      },
      {
        id: 'hollow-crown-cap',
        title: 'Hollow Crown Cap',
        description: 'Structured cap bearing the hollow crown mark; for quiet promenades.',
        price: 'XXXVI',
        imageSrc: merchPlaceholder,
      },
    ],
  },
  {
    id: 'talismans',
    num: 'III.',
    title: 'Talismans & Charms',
    description: 'Small keepsakes wrought for the wrist, the neck, and the key-ring.',
    items: [
      {
        id: 'salt-circle-charm',
        title: 'Salt Circle Charm',
        description: 'Enamel sigil on aged brass — a ward for the pocket or the locket.',
        price: 'XVIII',
        imageSrc: merchPlaceholder,
      },
      {
        id: 'nocturne-pendant',
        title: 'Nocturne Pendant',
        description: 'Crescent moon on a fine chain; worn close during long nocturnes.',
        price: 'XXIV',
        imageSrc: merchPlaceholder,
      },
    ],
  },
  {
    id: 'vessels',
    num: 'IV.',
    title: 'Vessels & Chalices',
    description: 'Drinkware for tea, ink, and whatever the night requires.',
    items: [
      {
        id: 'candle-watch-mug',
        title: 'Candle-Watch Mug',
        description: 'Stoneware vessel, gold rim — for correspondence and midnight tea.',
        price: 'XXVIII',
        imageSrc: merchPlaceholder,
      },
      {
        id: 'grimoire-flask',
        title: 'Grimoire Flask',
        description: 'Matte flask etched with manuscript lines; fits the inner pocket.',
        price: 'XXXII',
        imageSrc: merchPlaceholder,
      },
    ],
  },
  {
    id: 'grimoires',
    num: 'V.',
    title: 'Grimoires & Ledgers',
    description: 'Bound words — scores, annotations, and the house\'s own chronicle.',
    items: [
      {
        id: 'atelier-ledger',
        title: 'The Atelier Ledger',
        description: 'Cloth-bound journal, laid paper — for compositions and candle-notes.',
        price: 'XLVIII',
        imageSrc: merchPlaceholder,
      },
      {
        id: 'vesper-hymns-edition',
        title: 'Vesper Hymns — Annotated',
        description: 'Limited edition score with marginalia from the first candle-watch sessions.',
        price: 'LVI',
        imageSrc: merchPlaceholder,
      },
    ],
  },
]

export type TarotCard = {
  id: string
  num: string
  title: string
  symbol: string
  meaning: string
}

export const tarotCards: TarotCard[] = [
  {
    id: 'the-fool',
    num: '0',
    title: 'The Fool',
    symbol: 'Threshold',
    meaning:
      'You stand at the first measure — unwritten, unafraid. Step forward; the atelier receives wanderers.',
  },
  {
    id: 'the-magician',
    num: 'I',
    title: 'The Magician',
    symbol: 'As Above',
    meaning:
      'All four suits lie upon the table — will, cup, blade, and coin. What you summon here, the manuscript will keep.',
  },
  {
    id: 'the-high-priestess',
    num: 'II',
    title: 'The High Priestess',
    symbol: 'Veil',
    meaning:
      'Secrets sit between the staves. Trust the intuition that arrives before the downbeat.',
  },
  {
    id: 'the-empress',
    num: 'III',
    title: 'The Empress',
    symbol: 'Crown',
    meaning:
      'Abundance blooms in the walled garden — nurture the motif until it bears fruit in full orchestration.',
  },
  {
    id: 'the-lovers',
    num: 'VI',
    title: 'The Lovers',
    symbol: 'Union',
    meaning:
      'Two voices in counterpoint — a choice, a duet, a harmony forged in the half-light.',
  },
  {
    id: 'strength',
    num: 'VIII',
    title: 'Strength',
    symbol: 'Lion',
    meaning:
      'Gentleness need not be quiet. Hold your motif with patience; fortissimo follows restraint.',
  },
  {
    id: 'the-hermit',
    num: 'IX',
    title: 'The Hermit',
    symbol: 'Lantern',
    meaning:
      'Withdraw to the listening room. Solitude is not silence — it is the manuscript before ink.',
  },
  {
    id: 'wheel-of-fortune',
    num: 'X',
    title: 'Wheel of Fortune',
    symbol: 'Cycle',
    meaning:
      'Fortune turns like a slow reel. What ascends today may descend tomorrow — compose accordingly.',
  },
  {
    id: 'death',
    num: 'XIII',
    title: 'Death',
    symbol: 'Passage',
    meaning:
      'An ending measured in deep water — not loss, but transformation. Let the old key resolve.',
  },
  {
    id: 'the-tower',
    num: 'XVI',
    title: 'The Tower',
    symbol: 'Lightning',
    meaning:
      'What was built in brass must fall; from the rubble, a sharper motif will be scored.',
  },
  {
    id: 'the-star',
    num: 'XVII',
    title: 'The Star',
    symbol: 'Hope',
    meaning:
      'Hope glints at the circle\'s edge. A melody long submerged may yet surface, clean and bright.',
  },
  {
    id: 'the-moon',
    num: 'XVIII',
    title: 'The Moon',
    symbol: 'Tide',
    meaning:
      'A tide of silver sound rises after vespers — listen for what the choir forgot to sing.',
  },
]

export const synthPresets: Record<
  string,
  { baseFreq: number; detune: number; filterFreq: number; lfoRate: number }
> = {
  'vesper-procession': { baseFreq: 55, detune: 0.3, filterFreq: 400, lfoRate: 0.08 },
  'hollow-overture': { baseFreq: 41, detune: 0.8, filterFreq: 250, lfoRate: 0.05 },
  'crescent-circle': { baseFreq: 110, detune: 0.2, filterFreq: 1200, lfoRate: 0.12 },
  'nocturne-drowned': { baseFreq: 82.4, detune: 0.5, filterFreq: 800, lfoRate: 0.15 },
}
