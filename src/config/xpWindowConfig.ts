export type XpPaletteId = 'blue_orange' | 'lavender_butter' | 'teal_coral' | 'pink_mint';

export interface XpWindowPalette {
  id: XpPaletteId;
  label: string;
  frameFrom: string;
  frameMid: string;
  frameTo: string;
  frameBorder: string;
  sendBg: string;
  sendHover: string;
  sendBorder: string;
  sendText: string;
  bodyBg: string;
  surfaceBg: string;
  sunkenBorderDark: string;
  sunkenBorderLight: string;
  textPrimary: string;
  textMuted: string;
  menuHoverBg: string;
  closeBgFrom: string;
  closeBgTo: string;
}

export const DEFAULT_XP_PALETTE_ID: XpPaletteId = 'blue_orange';

export const XP_WINDOW_PALETTES: Record<XpPaletteId, XpWindowPalette> = {
  blue_orange: {
    id: 'blue_orange',
    label: 'Blue & Orange',
    frameFrom: '#4D8CFF',
    frameMid: '#2D72EB',
    frameTo: '#1E5FD8',
    frameBorder: '#1144A8',
    sendBg: '#FF9A3C',
    sendHover: '#FFB062',
    sendBorder: '#B85B08',
    sendText: '#1A1005',
    bodyBg: '#ECE9D8',
    surfaceBg: '#FFFFFF',
    sunkenBorderDark: '#7F9DB9',
    sunkenBorderLight: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textMuted: '#4A483E',
    menuHoverBg: '#316AC5',
    closeBgFrom: '#F0715B',
    closeBgTo: '#C93824',
  },
  lavender_butter: {
    id: 'lavender_butter',
    label: 'Lavender & Butter',
    frameFrom: '#CBB9F8',
    frameMid: '#B9A3F0',
    frameTo: '#977CE0',
    frameBorder: '#6E52BD',
    sendBg: '#FFE27A',
    sendHover: '#FFEB9E',
    sendBorder: '#B5921B',
    sendText: '#1E1805',
    bodyBg: '#F7F4FF',
    surfaceBg: '#FFFFFF',
    sunkenBorderDark: '#9A8CC2',
    sunkenBorderLight: '#FFFFFF',
    textPrimary: '#1D1829',
    textMuted: '#534A6B',
    menuHoverBg: '#8B6FD4',
    closeBgFrom: '#F27D8C',
    closeBgTo: '#C74055',
  },
  teal_coral: {
    id: 'teal_coral',
    label: 'Teal & Coral',
    frameFrom: '#54CCC4',
    frameMid: '#3FB8B0',
    frameTo: '#29968F',
    frameBorder: '#1A6E68',
    sendBg: '#FF7F6B',
    sendHover: '#FF9C8C',
    sendBorder: '#B83D2A',
    sendText: '#1F0A07',
    bodyBg: '#F2FBFA',
    surfaceBg: '#FFFFFF',
    sunkenBorderDark: '#78ABA7',
    sunkenBorderLight: '#FFFFFF',
    textPrimary: '#122422',
    textMuted: '#3E5E5B',
    menuHoverBg: '#29968F',
    closeBgFrom: '#FF8A75',
    closeBgTo: '#CC4B37',
  },
  pink_mint: {
    id: 'pink_mint',
    label: 'Pink & Mint',
    frameFrom: '#FFA4D3',
    frameMid: '#FF8CC6',
    frameTo: '#E364A4',
    frameBorder: '#B33B78',
    sendBg: '#8FE3C0',
    sendHover: '#ADEBD1',
    sendBorder: '#35946D',
    sendText: '#0A2419',
    bodyBg: '#FFF5FA',
    surfaceBg: '#FFFFFF',
    sunkenBorderDark: '#C48BA9',
    sunkenBorderLight: '#FFFFFF',
    textPrimary: '#26141E',
    textMuted: '#634153',
    menuHoverBg: '#DB5D9D',
    closeBgFrom: '#FF7A9A',
    closeBgTo: '#C93A5D',
  },
};

// =============================================================================
// CUSTOM 32x32 RETRO PIXEL CURSORS (Original SVG pixel-art, zero external assets)
// =============================================================================

const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;

// Crisp 32x32 retro pixel arrow
export const CURSOR_PIXEL_ARROW = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <path d="M1 1v12l3-3 2 4 2-1-2-4h4z" fill="#ffffff" stroke="#111111" stroke-width="1"/>
</svg>
`);

// Crisp 32x32 retro pixel pointing hand
export const CURSOR_PIXEL_HAND = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <path d="M5 1h2v5h2V5h2v1h2v5l-1 3H5l-3-4 1-1 2 1V1z" fill="#ffffff" stroke="#111111" stroke-width="1"/>
</svg>
`);

// Crisp 32x32 retro pixel I-beam
export const CURSOR_PIXEL_IBEAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <path d="M5 2h6v1H9v10h2v1H5v-1h2V3H5z" fill="#111111" stroke="#ffffff" stroke-width="0.6"/>
</svg>
`);

// Crisp 32x32 retro pixel hourglass
export const CURSOR_PIXEL_WAIT = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect x="3" y="1" width="10" height="2" fill="#111111"/>
  <rect x="3" y="13" width="10" height="2" fill="#111111"/>
  <path d="M4 3h8v2l-3 3 3 3v2H4v-2l3-3-3-3z" fill="#fef3c7" stroke="#111111" stroke-width="1"/>
  <rect x="6" y="4" width="4" height="1" fill="#eab308"/>
  <rect x="6" y="11" width="4" height="1" fill="#eab308"/>
</svg>
`);
