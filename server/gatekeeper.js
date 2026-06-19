const WORKS = [
  {
    title: 'Vesper Hymns',
    meta: 'Gothic Ambient · 47:12',
    year: 'MMXXIV',
    description: 'Cathedral drones woven with whispered choir and bowed glass.',
  },
  {
    title: 'The Hollow Crown',
    meta: 'Horror Score · 32:08',
    year: 'MMXXIV',
    description: 'Commissioned for a silent film of forgotten witches; brass and bone.',
  },
  {
    title: 'Crescent of Salt',
    meta: 'Arcane Atmosphere · 58:40',
    year: 'MMXXIII',
    description: 'Salt-circle rituals scored for tape loops, harpsichord, and rain.',
  },
  {
    title: 'Nocturnes for the Drowned',
    meta: 'Spellbound Classical · 41:20',
    year: 'MMXXIII',
    description: 'Seven nocturnes for piano and submerged string quartet.',
  },
]

const SERVICES = [
  'Film & Television — gothic features, occult shorts, slow-horror series.',
  'Games & Interactive — adaptive arcane soundscapes for atmosphere-led worlds.',
  'Ritual & Theatre — music for ceremonies, immersive theatre, and gallery installations.',
  'Private Commissions — heirloom compositions written for one listener.',
]

const TRACKS = [
  'Vesper I — Procession (6:42)',
  'The Hollow Crown — Overture (4:58)',
  'Crescent of Salt — Circle Drawn (8:21)',
  'Nocturne IV — For the Drowned Bride (5:33)',
]

const MERCHANDISE = [
  'Vestments & Raiment — processional tees and sigil shirts.',
  'Crowns & Brims — vesper brims and hollow crown caps.',
  'Talismans & Charms — salt circle charms and nocturne pendants.',
  'Vessels & Chalices — candle-watch mugs and grimoire flasks.',
  'Grimoires & Ledgers — atelier journals and annotated scores.',
]

const TAROT = [
  { title: 'The Fool', meaning: 'You stand at the first measure — unwritten, unafraid. Step forward; the atelier receives wanderers.' },
  { title: 'The Magician', meaning: 'All four suits lie upon the table — will, cup, blade, and coin. What you summon here, the manuscript will keep.' },
  { title: 'The High Priestess', meaning: 'Secrets sit between the staves. Trust the intuition that arrives before the downbeat.' },
  { title: 'The Empress', meaning: 'Abundance blooms in the walled garden — nurture the motif until it bears fruit in full orchestration.' },
  { title: 'The Lovers', meaning: 'Two voices in counterpoint — a choice, a duet, a harmony forged in the half-light.' },
  { title: 'Strength', meaning: 'Gentleness need not be quiet. Hold your motif with patience; fortissimo follows restraint.' },
  { title: 'The Hermit', meaning: 'Withdraw to the listening room. Solitude is not silence — it is the manuscript before ink.' },
  { title: 'Wheel of Fortune', meaning: 'Fortune turns like a slow reel. What ascends today may descend tomorrow — compose accordingly.' },
  { title: 'Death', meaning: 'An ending measured in deep water — not loss, but transformation. Let the old key resolve.' },
  { title: 'The Tower', meaning: 'What was built in brass must fall; from the rubble, a sharper motif will be scored.' },
  { title: 'The Star', meaning: 'Hope glints at the circle\'s edge. A melody long submerged may yet surface, clean and bright.' },
  { title: 'The Moon', meaning: 'A tide of silver sound rises after vespers — listen for what the choir forgot to sing.' },
]

const GREETING =
  'Good evening. I am Gate Keeper — sentinel at this atelier\'s threshold and keeper of its night correspondence. Ask me of our works, the listening room, the reliquary, the Arcanum, commissions, or how one might write to the house. What shall we illumine?'

function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term))
}

function formatWorksList() {
  return WORKS.map((w) => `· ${w.title} (${w.meta}, ${w.year}) — ${w.description}`).join('\n')
}

function formatServicesList() {
  return SERVICES.map((s) => `· ${s}`).join('\n')
}

function formatTracksList() {
  return TRACKS.map((t) => `· ${t}`).join('\n')
}

function formatMerchandiseList() {
  return MERCHANDISE.map((m) => `· ${m}`).join('\n')
}

function formatTarotList() {
  return TAROT.map((c) => `· ${c.title}`).join('\n')
}

function findTarotCard(text) {
  const aliases = [
    { keys: ['the fool', 'fool', 'threshold'], card: TAROT[0] },
    { keys: ['the magician', 'magician'], card: TAROT[1] },
    { keys: ['high priestess', 'priestess', 'grimoire keeper'], card: TAROT[2] },
    { keys: ['the empress', 'empress'], card: TAROT[3] },
    { keys: ['the lovers', 'lovers', 'twin nocturnes'], card: TAROT[4] },
    { keys: ['strength', 'brass resolve', 'resolve'], card: TAROT[5] },
    { keys: ['the hermit', 'hermit', 'candle hermit'], card: TAROT[6] },
    { keys: ['wheel of fortune', 'wheel', 'fortune', 'procession wheel'], card: TAROT[7] },
    { keys: ['death', 'drowned passage', 'drowned'], card: TAROT[8] },
    { keys: ['the tower', 'tower', 'hollow tower'], card: TAROT[9] },
    { keys: ['the star', 'star', 'salt star'], card: TAROT[10] },
    { keys: ['the moon', 'moon', 'vesper moon'], card: TAROT[11] },
  ]

  return aliases.find((entry) => entry.keys.some((key) => text.includes(key)))?.card
}

function findWork(text) {
  const aliases = [
    { keys: ['vesper hymn', 'vesper i', 'vesper hymns'], work: WORKS[0] },
    { keys: ['hollow crown', 'hollow'], work: WORKS[1] },
    { keys: ['crescent', 'salt', 'circle drawn'], work: WORKS[2] },
    { keys: ['drowned', 'nocturne iv', 'nocturnes for'], work: WORKS[3] },
  ]

  return aliases.find((entry) => entry.keys.some((key) => text.includes(key)))?.work
}

export function getGateKeeperGreeting() {
  return GREETING
}

export function replyToMessage(message) {
  const text = normalize(message)

  if (!text) {
    return 'Speak, and I shall listen. Even a whisper carries in the half-light.'
  }

  if (includesAny(text, ['hello', 'hi', 'hey', 'good evening', 'good night', 'greetings'])) {
    return 'The atelier receives you. I tend the catalogue by candlelight — ask what you will of our music, our manifesto, or the path to commission.'
  }

  const work = findWork(text)
  if (work) {
    return `${work.title} (${work.meta}, ${work.year}). ${work.description} A preview may be heard in the Listening Room, if the manuscript has been laid open.`
  }

  if (
    includesAny(text, ['who are you', 'your name', 'what are you', 'gate keeper', 'gatekeeper']) ||
    (text.includes('vesper') && !includesAny(text, ['hymn', 'procession', 'album', 'track', 'work', 'brim']))
  ) {
    return 'I am Gate Keeper, sentinel at the threshold of Nocturne Atelier — nocturneatelier.net. I keep the listening room, know the manuscripts in our catalogue, and guide correspondence to the house. Not a composer — only the one who remembers what was written in the dark.'
  }

  if (includesAny(text, ['thank', 'grateful', 'lovely', 'wonderful', 'beautiful'])) {
    return 'The house is honoured. Should you need further counsel, I remain at the threshold.'
  }

  if (includesAny(text, ['bye', 'goodbye', 'farewell', 'leave'])) {
    return 'Go gently into the unlit hours. The music will keep vigil until you return.'
  }

  if (includesAny(text, ['manifesto', 'philosophy', 'belief', 'why', 'purpose'])) {
    return 'Our manifesto declares: we write music for the half-light — for cathedrals after vespers, forests that remember names, and the small hour when the mind, alone, becomes a chapel. You may read it in full under Manifesto on this page.'
  }

  if (includesAny(text, ['genre', 'style', 'gothic', 'ambient', 'arcane', 'horror', 'classical', 'what kind'])) {
    return 'Nocturne Atelier composes gothic ambient, arcane atmospheres, horror-inspired scores, and spellbound classical soundscapes — music for screen, ritual, and the quiet listener who keeps candle-watch.'
  }

  if (includesAny(text, ['about', 'nocturne', 'atelier', 'who is', 'what is', 'house', 'studio'])) {
    return 'Nocturne Atelier is a dark music house — Est. by candlelight, Anno MMXX. We compose for the unlit hours: long-form atmospheres, ritual scores, and private nocturnes. The catalogue spans MMXXIII–MMXXIV. This threshold opens at nocturneatelier.net. I can tell you of individual works, the listening room, or how to commission a piece.'
  }

  if (includesAny(text, ['listen', 'preview', 'track', 'play', 'audio', 'hear', 'room', 'streaming'])) {
    return `The Listening Room holds four previews drawn from our recent manuscripts:\n${formatTracksList()}\nDescend to Listen upon this page and press play — the player will follow you as you wander.`
  }

  if (
    includesAny(text, [
      'merch',
      'merchandise',
      'reliquary',
      'shop',
      'store',
      'buy',
      'purchase',
      'shirt',
      'tee',
      'hat',
      'cap',
      'charm',
      'talisman',
      'mug',
      'flask',
      'drinkware',
      'book',
      'journal',
      'ledger',
      'wares',
      'vestments',
    ])
  ) {
    return `The Reliquary keeps house wares for the candle-watch:\n${formatMerchandiseList()}\nPrices are inscribed in Roman numerals upon each item. To inquire after a piece, write to Correspondence — orders are fulfilled at leisure, by candlelight.`
  }

  if (includesAny(text, ['catalogue', 'catalog', 'works', 'album', 'release', 'discography', 'record'])) {
    return `Our catalogue, inscribed thus:\n${formatWorksList()}\nAsk of any title by name, and I shall speak of it more closely.`
  }

  if (includesAny(text, ['commission', 'hire', 'collaborat', 'project', 'score', 'licens', 'work with'])) {
    return `The atelier accepts commissions across several chambers:\n${formatServicesList()}\nFor film, ritual, games, or a private nocturne — inscribe your intent in Correspondence. Letters are read by candlelight and answered within the fortnight.`
  }

  if (includesAny(text, ['contact', 'email', 'write', 'letter', 'raven', 'reach', 'correspond'])) {
    return 'To write to the house, descend to Correspondence. Leave your name, sigil (email), and the nature of the work. Your raven will be dispatched, and we shall answer within the fortnight.'
  }

  if (includesAny(text, ['service', 'film', 'television', 'game', 'theatre', 'theater', 'ritual', 'installation'])) {
    return `Our disciplines:\n${formatServicesList()}\nEach commission is approached as a manuscript — slow, deliberate, composed in long candle-watches.`
  }

  if (includesAny(text, ['price', 'cost', 'rate', 'fee', 'budget', 'how much'])) {
    return 'Fees are not posted in the public ledger — each work is measured by scope, duration, and the silence it must hold. Write to Correspondence with your intent; the house will reply with terms suited to the commission.'
  }

  if (includesAny(text, ['where', 'location', 'based', 'country', 'city', 'address', 'website', 'url', 'domain'])) {
    return 'The atelier keeps no fixed address in daylight — yet its threshold opens at nocturneatelier.net. Correspondence travels by raven; music travels by wire. We compose wherever the candles are lit and the hour grows late.'
  }

  if (includesAny(text, ['help', 'guide', 'navigate', 'find', 'how do i', 'what can'])) {
    return 'I can speak of: our manifesto and philosophy; the catalogue (Vesper Hymns, The Hollow Crown, Crescent of Salt, Nocturnes for the Drowned); the Arcanum and its candle-draw; the Listening Room and its previews; the Reliquary and its house wares; commissions for film, games, ritual, and private works; and how to send correspondence to the atelier.'
  }

  const tarotCard = findTarotCard(text)
  if (tarotCard) {
    return `${tarotCard.title}. ${tarotCard.meaning} You may draw from the full deck under The Arcanum upon this page.`
  }

  if (
    includesAny(text, [
      'tarot',
      'arcanum',
      'oracle',
      'draw a card',
      'draw card',
      'candle draw',
      'candle-draw',
      'reading',
      'fortune',
      'sigil',
    ])
  ) {
    return `The Arcanum holds twelve Major Arcana for candle-draw:\n${formatTarotList()}\nDescend to The Arcanum upon this page, draw a card, and read what the half-light whispers. Ask of any title by name, and I shall speak its meaning.`
  }

  return 'I do not find that in our ledgers. Ask of the catalogue, the Arcanum, the Listening Room, commissions, or Correspondence — or name a work such as Vesper Hymns or The Hollow Crown, and I shall speak more plainly.'
}
