/** Reliquary catalogue — prices in USD cents (Roman display on frontend). */
export const merchandiseCatalog = {
  'processional-tee': {
    title: 'Processional Tee',
    description: 'Heavy cotton, sigil of the atelier upon the breast — inked in candle-gold.',
    priceCents: 3800,
  },
  'crescent-sigil-shirt': {
    title: 'Crescent Sigil Shirt',
    description: 'Salt-circle emblem at the nape; for those who draw circles after vespers.',
    priceCents: 4200,
  },
  'vesper-brim': {
    title: 'Vesper Brim',
    description: 'Wide-brim felt, wine-stitched band — shade for the listening hour.',
    priceCents: 3400,
  },
  'hollow-crown-cap': {
    title: 'Hollow Crown Cap',
    description: 'Structured cap bearing the hollow crown mark; for quiet promenades.',
    priceCents: 3600,
  },
  'salt-circle-charm': {
    title: 'Salt Circle Charm',
    description: 'Enamel sigil on aged brass — a ward for the pocket or the locket.',
    priceCents: 1800,
  },
  'nocturne-pendant': {
    title: 'Nocturne Pendant',
    description: 'Crescent moon on a fine chain; worn close during long nocturnes.',
    priceCents: 2400,
  },
  'candle-watch-mug': {
    title: 'Candle-Watch Mug',
    description: 'Stoneware vessel, gold rim — for correspondence and midnight tea.',
    priceCents: 2800,
  },
  'grimoire-flask': {
    title: 'Grimoire Flask',
    description: 'Matte flask etched with manuscript lines; fits the inner pocket.',
    priceCents: 3200,
  },
  'atelier-ledger': {
    title: 'The Atelier Ledger',
    description: 'Cloth-bound journal, laid paper — for compositions and candle-notes.',
    priceCents: 4800,
  },
  'vesper-hymns-edition': {
    title: 'Vesper Hymns — Annotated',
    description: 'Limited edition score with marginalia from the first candle-watch sessions.',
    priceCents: 5600,
  },
}

export function getMerchItem(itemId) {
  return merchandiseCatalog[itemId] ?? null
}
