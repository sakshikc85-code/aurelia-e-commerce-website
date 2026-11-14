import type { CatalogPieceMeta } from '../types/aurelia';

export const CATALOG_META: CatalogPieceMeta[] = [
  {
    id: 'chronometre-souverain',
    reference: 'REF. AUR-014',
    name: 'Chronomètre Souverain Tourbillon',
    category: 'Haute Horlogerie',
    material: '18k Champagne Gold · Obsidian Guilloché',
    price: 68500,
    availability: 'Numbered Atelier Edition',
    summary:
      'Openworked flying tourbillon housed in brushed 18k champagne gold with hand-turned obsidian guilloché chapter ring.',
    craftStory:
      'Assembled by a single master horologist in our Rue du Rhône workshop over 190 hours, featuring hand-beveled gold bridges and an 80-hour twin-barrel reserve.',
    variantLabel: 'Strap & Buckle',
    variants: ['Matte Black Alligator', 'Anthracite Nubuck Calf', '18k Gold Deployant'],
    specs: [
      { label: 'Calibre', value: 'AUR-M09 Manual Tourbillon' },
      { label: 'Case', value: '40.5 mm × 9.4 mm · 18k Gold' },
      { label: 'Reserve', value: '80 Hours · Twin Barrel' },
      { label: 'Crystal', value: 'Domed Anti-Reflective Sapphire' },
    ],
  },
  {
    id: 'quantieme-celeste',
    reference: 'REF. AUR-028',
    name: 'Quantième Céleste Moonphase',
    category: 'Haute Horlogerie',
    material: '18k Gold · Smoked Anthracite Dial',
    price: 54200,
    availability: 'Available for Private Allocation',
    summary:
      'Ultra-thin perpetual calendar and astronomical moonphase accurate to one lunar day every 122 years.',
    craftStory:
      'Its sunburst anthracite dial undergoes fourteen stages of galvanic lacquer before receiving solid gold applied indices and a hand-engraved aventurine lunar disc.',
    variantLabel: 'Case Diameter',
    variants: ['38 mm Classic', '40 mm Grand'],
    specs: [
      { label: 'Calibre', value: 'AUR-240Q Micro-Rotor' },
      { label: 'Profile', value: '8.6 mm Ultra-Thin Case' },
      { label: 'Complication', value: 'Perpetual Calendar & Moonphase' },
      { label: 'Resistance', value: '30 Meters / 3 ATM' },
    ],
  },
  {
    id: 'calibre-1924',
    reference: 'REF. AUR-003',
    name: 'Calibre 1924 Dress Chronometer',
    category: 'Haute Horlogerie',
    material: 'Brushed 18k Gold · Matte Onyx Lacquer',
    price: 39800,
    availability: 'In Salon',
    summary:
      'Pure two-hand dress architecture with elongated Roman numerals in warm champagne gold over deep onyx lacquer.',
    craftStory:
      'Conceived as an homage to early-century Geneva observatory trials, stripped of superfluous apertures to let light glide across its stepped bezel.',
    variantLabel: 'Strap Length',
    variants: ['Standard (115/75 mm)', 'Short (105/65 mm)', 'Long (125/85 mm)'],
    specs: [
      { label: 'Calibre', value: 'AUR-1924 Hand-Wound' },
      { label: 'Case', value: '37.5 mm × 6.8 mm · 18k Gold' },
      { label: 'Dial', value: 'Kiln-Fired Onyx Lacquer' },
      { label: 'Strap', value: 'Hand-Stitched Mississippiensis' },
    ],
  },
  {
    id: 'manteau-imperial',
    reference: 'REF. COU-107',
    name: 'Manteau Impérial Evening Overcoat',
    category: 'Evening Couture',
    material: 'Double-Faced Cashmere · Duchess Satin',
    price: 8900,
    availability: 'Made to Measure',
    summary:
      'Full-length architectural evening overcoat tailored in double-faced obsidian cashmere with wide duchess silk satin peak lapels.',
    craftStory:
      'Cut and hand-felled in Milan without rigid canvas interlining, allowing the waist belt and dramatic lapel geometry to drape with effortless weight.',
    variantLabel: 'Atelier Size',
    variants: ['FR 36', 'FR 38', 'FR 40', 'FR 42', 'Bespoke Fitting'],
    specs: [
      { label: 'Cloth', value: '100% Double-Faced Cashmere (620g)' },
      { label: 'Lapels', value: 'Pure Mulberry Duchess Satin' },
      { label: 'Lining', value: 'Cupro-Silk Jacquard' },
      { label: 'Origin', value: 'Hand-Finished in Milan' },
    ],
  },
  {
    id: 'robe-nocturne',
    reference: 'REF. COU-119',
    name: 'Robe Nocturne Bias-Cut Gown',
    category: 'Evening Couture',
    material: 'Champagne Silk Charmeuse · Matte Crêpe',
    price: 12400,
    availability: 'Atelier Commission',
    summary:
      'Asymmetric bias-cut evening gown contrasting liquid champagne silk charmeuse against sculpted obsidian wool-silk crêpe.',
    craftStory:
      'Draped directly on the Parisian wooden form over thirty-six hours so every diagonal seam elongates the silhouette without visible closure hardware.',
    variantLabel: 'Atelier Size',
    variants: ['FR 34', 'FR 36', 'FR 38', 'FR 40', 'Bespoke Fitting'],
    specs: [
      { label: 'Silk', value: 'Heavyweight 30-Momme Charmeuse' },
      { label: 'Contrast', value: 'Obsidian Silk-Wool Crêpe' },
      { label: 'Construction', value: 'True 45° Bias Cut' },
      { label: 'Origin', value: 'Paris Couture Salon' },
    ],
  },
  {
    id: 'manchette-aurum',
    reference: 'REF. JOA-052',
    name: 'Manchette & Chevalière d’Or Parure',
    category: 'Fine Jewellery',
    material: 'Hand-Brushed 18k Gold · Carved Black Onyx',
    price: 16800,
    availability: 'Limited Salon Set',
    summary:
      'Sculptural twisted cuff bracelet paired with an octagonal signet ring set flush with mirror-polished black onyx.',
    craftStory:
      'Each piece receives a proprietary directional Florentine satin finish by hand, catching low evening light with a quiet, velvety sheen rather than high polish.',
    variantLabel: 'Ring Sizing',
    variants: ['EU 50', 'EU 52', 'EU 54', 'EU 56', 'EU 58'],
    specs: [
      { label: 'Precious Metal', value: 'Solid 18k Champagne Gold' },
      { label: 'Stone', value: 'Natural Brazilian Black Onyx' },
      { label: 'Finish', value: 'Hand-Brushed Satin Texture' },
      { label: 'Hallmark', value: 'Swiss & French Gold Assay' },
    ],
  },
];
