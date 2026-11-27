export type PaletteId = 'A' | 'B' | 'C';
export type FilterId = 'dreamcore_peach' | 'pastel_haze' | 'liminal_yellow' | 'vhs_memory';

export interface BedroomPalette {
  id: PaletteId;
  label: string;
  woodColor: string;
  wallColor: string;
  accentColor: string;
  secondaryAccentColor: string;
  lightBeamColor: string;
  shadowColor: string;
  ambientIntensity: number;
  beamIntensity: number;
  hemisphereIntensity: number;
  defaultFilter: FilterId;
}

export interface BedroomFilter {
  id: FilterId;
  label: string;
  sepia: number;
  saturate: number;
  contrast: number;
  brightness: number;
  hueRotateDeg: number;
  blurPx: number;
  washBlendMode: 'soft-light' | 'multiply';
  washBackground: string;
  washOpacity: number;
  scanlines: boolean;
  scanlineOpacity: number;
  edgeSplitPx: number;
}

// =============================================================================
// STEP 1: RECOLOR PALETTES (Every value is a single variable)
// =============================================================================

export const PALETTE_A_WOOD = '#3B2417';
export const PALETTE_A_LIGHT = '#E8A64A';
export const PALETTE_A_WALLS = '#D9BF92';
export const PALETTE_A_ACCENT = '#B9776B';
export const PALETTE_A_SHADOWS = '#1B1020';

export const PALETTE_B_PEACH = '#F4C6B8';
export const PALETTE_B_LAVENDER = '#D8B4E2';
export const PALETTE_B_MINT = '#A8D5D1';
export const PALETTE_B_CREAM = '#FFF1D6';
export const PALETTE_B_SHADOWS = '#2A1F3D';

export const PALETTE_C_MUSTARD = '#D8C36A';
export const PALETTE_C_OLIVE = '#8A7A3A';
export const PALETTE_C_DARK = '#3A3418';

export const BEDROOM_PALETTES: Record<PaletteId, BedroomPalette> = {
  A: {
    id: 'A',
    label: 'A) Golden Memory',
    woodColor: PALETTE_A_WOOD,
    wallColor: PALETTE_A_WALLS,
    accentColor: PALETTE_A_ACCENT,
    secondaryAccentColor: PALETTE_A_LIGHT,
    lightBeamColor: PALETTE_A_LIGHT,
    shadowColor: PALETTE_A_SHADOWS,
    ambientIntensity: 0.7,
    beamIntensity: 5.5,
    hemisphereIntensity: 0.9,
    defaultFilter: 'dreamcore_peach',
  },
  B: {
    id: 'B',
    label: 'B) Pastel Dreamcore',
    woodColor: PALETTE_B_PEACH,
    wallColor: PALETTE_B_CREAM,
    accentColor: PALETTE_B_LAVENDER,
    secondaryAccentColor: PALETTE_B_MINT,
    lightBeamColor: PALETTE_B_CREAM,
    shadowColor: PALETTE_B_SHADOWS,
    ambientIntensity: 0.85,
    beamIntensity: 5.0,
    hemisphereIntensity: 1.0,
    defaultFilter: 'pastel_haze',
  },
  C: {
    id: 'C',
    label: 'C) Liminal Yellow',
    woodColor: PALETTE_C_OLIVE,
    wallColor: PALETTE_C_MUSTARD,
    accentColor: PALETTE_C_MUSTARD,
    secondaryAccentColor: PALETTE_C_OLIVE,
    lightBeamColor: PALETTE_C_MUSTARD,
    shadowColor: PALETTE_C_DARK,
    ambientIntensity: 0.75,
    beamIntensity: 5.2,
    hemisphereIntensity: 0.85,
    defaultFilter: 'liminal_yellow',
  },
};

// =============================================================================
// STEP 2: INSTAGRAM-STYLE FILTERS (Every value is a single variable)
// =============================================================================

export const FILTER_DREAMCORE_SEPIA = 0.25;
export const FILTER_DREAMCORE_SATURATE = 0.9;
export const FILTER_DREAMCORE_CONTRAST = 0.92;
export const FILTER_DREAMCORE_BRIGHTNESS = 1.03;
export const FILTER_DREAMCORE_HUE = -8;
export const FILTER_DREAMCORE_BLUR = 0.3;
export const FILTER_DREAMCORE_WASH_OPACITY = 0.23;

export const FILTER_PASTEL_SATURATE = 0.75;
export const FILTER_PASTEL_CONTRAST = 0.85;
export const FILTER_PASTEL_BRIGHTNESS = 1.1;
export const FILTER_PASTEL_HUE = 15;
export const FILTER_PASTEL_WASH_OPACITY = 0.23;

export const FILTER_LIMINAL_SEPIA = 0.45;
export const FILTER_LIMINAL_SATURATE = 0.8;
export const FILTER_LIMINAL_CONTRAST = 0.88;
export const FILTER_LIMINAL_BRIGHTNESS = 1.02;
export const FILTER_LIMINAL_HUE = -18;
export const FILTER_LIMINAL_WASH_OPACITY = 1.0; // rgba(200,185,90,0.2) already has 0.2 alpha

export const FILTER_VHS_SATURATE = 0.8;
export const FILTER_VHS_CONTRAST = 1.05;
export const FILTER_VHS_BRIGHTNESS = 0.95;
export const FILTER_VHS_BLUR = 0.5;
export const FILTER_VHS_SCANLINE_OPACITY = 0.14;
export const FILTER_VHS_EDGE_SPLIT_PX = 1.5;

export const BEDROOM_FILTERS: Record<FilterId, BedroomFilter> = {
  dreamcore_peach: {
    id: 'dreamcore_peach',
    label: 'Dreamcore Peach',
    sepia: FILTER_DREAMCORE_SEPIA,
    saturate: FILTER_DREAMCORE_SATURATE,
    contrast: FILTER_DREAMCORE_CONTRAST,
    brightness: FILTER_DREAMCORE_BRIGHTNESS,
    hueRotateDeg: FILTER_DREAMCORE_HUE,
    blurPx: FILTER_DREAMCORE_BLUR,
    washBlendMode: 'soft-light',
    washBackground: 'linear-gradient(135deg, #F4C6B8 0%, #8B5CF6 100%)',
    washOpacity: FILTER_DREAMCORE_WASH_OPACITY,
    scanlines: false,
    scanlineOpacity: 0,
    edgeSplitPx: 0,
  },
  pastel_haze: {
    id: 'pastel_haze',
    label: 'Pastel Haze',
    sepia: 0,
    saturate: FILTER_PASTEL_SATURATE,
    contrast: FILTER_PASTEL_CONTRAST,
    brightness: FILTER_PASTEL_BRIGHTNESS,
    hueRotateDeg: FILTER_PASTEL_HUE,
    blurPx: 0,
    washBlendMode: 'soft-light',
    washBackground: 'linear-gradient(135deg, #D8B4E2 0%, #A8D5D1 100%)',
    washOpacity: FILTER_PASTEL_WASH_OPACITY,
    scanlines: false,
    scanlineOpacity: 0,
    edgeSplitPx: 0,
  },
  liminal_yellow: {
    id: 'liminal_yellow',
    label: 'Liminal Yellow',
    sepia: FILTER_LIMINAL_SEPIA,
    saturate: FILTER_LIMINAL_SATURATE,
    contrast: FILTER_LIMINAL_CONTRAST,
    brightness: FILTER_LIMINAL_BRIGHTNESS,
    hueRotateDeg: FILTER_LIMINAL_HUE,
    blurPx: 0,
    washBlendMode: 'multiply',
    washBackground: 'rgba(200, 185, 90, 0.2)',
    washOpacity: FILTER_LIMINAL_WASH_OPACITY,
    scanlines: false,
    scanlineOpacity: 0,
    edgeSplitPx: 0,
  },
  vhs_memory: {
    id: 'vhs_memory',
    label: 'VHS Memory',
    sepia: 0,
    saturate: FILTER_VHS_SATURATE,
    contrast: FILTER_VHS_CONTRAST,
    brightness: FILTER_VHS_BRIGHTNESS,
    hueRotateDeg: 0,
    blurPx: FILTER_VHS_BLUR,
    washBlendMode: 'soft-light',
    washBackground: 'linear-gradient(180deg, rgba(216,180,226,0.12) 0%, rgba(168,213,209,0.08) 100%)',
    washOpacity: 1.0,
    scanlines: true,
    scanlineOpacity: FILTER_VHS_SCANLINE_OPACITY,
    edgeSplitPx: FILTER_VHS_EDGE_SPLIT_PX,
  },
};

// =============================================================================
// GLOBAL OVERLAY & TUNING DEFAULTS
// =============================================================================

export const DEFAULT_PALETTE_ID: PaletteId = 'A';
export const DEFAULT_RECOLOR_STRENGTH = 0.10;
export const DEFAULT_FILTER_STRENGTH = 0.40;

export const FILM_GRAIN_OPACITY = 0.07; // 7% (within 6-8%)
export const VIGNETTE_OPACITY = 0.45;
export const BRIGHTNESS_DRIFT_DURATION_SEC = 14;
export const BRIGHTNESS_DRIFT_MIN = 0.97;
export const BRIGHTNESS_DRIFT_MAX = 1.03;

/**
 * Builds a CSS filter string interpolated by `strength` (0 = neutral, 1 = full filter).
 */
export function buildCssFilter(filter: BedroomFilter, strength: number): string {
  const s = Math.max(0, Math.min(1, strength));
  if (s === 0) return 'none';

  const lerp = (neutral: number, target: number) => neutral + (target - neutral) * s;

  const sepia = lerp(0, filter.sepia);
  const saturate = lerp(1, filter.saturate);
  const contrast = lerp(1, filter.contrast);
  const brightness = lerp(1, filter.brightness);
  const hue = lerp(0, filter.hueRotateDeg);
  const blur = lerp(0, filter.blurPx);

  const parts: string[] = [];
  if (sepia > 0.001) parts.push(`sepia(${sepia.toFixed(3)})`);
  parts.push(`saturate(${saturate.toFixed(3)})`);
  parts.push(`contrast(${contrast.toFixed(3)})`);
  parts.push(`brightness(${brightness.toFixed(3)})`);
  if (Math.abs(hue) > 0.05) parts.push(`hue-rotate(${hue.toFixed(2)}deg)`);
  if (blur > 0.01) parts.push(`blur(${blur.toFixed(2)}px)`);

  return parts.join(' ');
}
