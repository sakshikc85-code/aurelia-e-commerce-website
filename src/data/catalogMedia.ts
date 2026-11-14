import heroAtelierImg from '../assets/images/hero_aurelia_atelier_1794648897829.jpg';
import watchChronometreImg from '../assets/images/watch_chronometre_noir_1794648897317.jpg';
import watchQuantiemeImg from '../assets/images/watch_quantieme_celeste_1794648898082.jpg';
import coutureCoatImg from '../assets/images/couture_coat_obsidian_1794648898318.jpg';
import coutureGownImg from '../assets/images/couture_gown_champagne_1794648899178.jpg';
import jewelleryCuffImg from '../assets/images/jewellery_cuff_aurum_1794648899212.jpg';
import craftMovementImg from '../assets/images/craft_movement_macro_1794648900274.jpg';

import type { CatalogPiece } from '../types/aurelia';
import { CATALOG_META } from './catalogMeta';

export const EDITORIAL_MEDIA = {
  heroCampaign: heroAtelierImg,
  craftMovement: craftMovementImg,
};

const IMAGE_BY_ID: Record<string, { src: string; alt: string }> = {
  'chronometre-souverain': {
    src: watchChronometreImg,
    alt: 'Chronomètre Souverain Tourbillon in 18k champagne gold with openworked obsidian dial',
  },
  'quantieme-celeste': {
    src: watchQuantiemeImg,
    alt: 'Quantième Céleste Moonphase dress watch with smoked anthracite dial',
  },
  'calibre-1924': {
    src: heroAtelierImg,
    alt: 'Calibre 1924 ultra-thin gold dress watch beside tailored charcoal cashmere',
  },
  'manteau-imperial': {
    src: coutureCoatImg,
    alt: 'Manteau Impérial double-faced obsidian cashmere evening overcoat with satin lapels',
  },
  'robe-nocturne': {
    src: coutureGownImg,
    alt: 'Robe Nocturne bias-cut champagne silk charmeuse and black crêpe evening gown',
  },
  'manchette-aurum': {
    src: jewelleryCuffImg,
    alt: 'Manchette and Chevalière brushed 18k gold cuff bracelet and black onyx signet ring',
  },
};

export const CATALOG_PIECES: CatalogPiece[] = CATALOG_META.map((meta) => ({
  ...meta,
  image: IMAGE_BY_ID[meta.id]?.src ?? heroAtelierImg,
  imageAlt: IMAGE_BY_ID[meta.id]?.alt ?? meta.name,
}));
