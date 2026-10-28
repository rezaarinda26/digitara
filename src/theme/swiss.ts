/**
 * Swiss / International Typographic Style palette.
 *
 * Two inks only, sampled from a 1955 Müller-Brockmann concert poster: a deep
 * cobalt blue and a warm off-white paper. No gradients, no shadows, no radii.
 */
export const SWISS = {
  /** Ink used for dark surfaces (hero, mid-banner, footer). */
  blue: '#0B2B6B',
  /** Paper used for content sections and for type sitting on blue. */
  paper: '#F1F0EA',
  /** Panel ink: strips and cards that sit one step away from the main ink. */
  panel: '#0A2459',
} as const;

/** Rotation of the diagonal axis shared by every Swiss composition. */
export const SWISS_AXIS_DEG = -18;

/** Parse a #RGB / #RRGGBB hex colour into its 0-255 channels. */
export function hexChannels(hex: string): [number, number, number] | null {
  const value = hex.trim().replace(/^#/, '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Hex colour -> `rgba(...)`, used for hairlines and tinted hovers. */
export function withAlpha(hex: string, alpha: number): string {
  const channels = hexChannels(hex);
  if (!channels) return `rgba(11, 43, 107, ${alpha})`;
  return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
}

/**
 * Perceived darkness of a colour (WCAG relative luminance). Used to decide
 * whether a stored Modern custom palette is safe to show in Swiss: a dark
 * "tertiary" would become black-on-black paper, so it gets seeded instead.
 */
export function isDarkColor(hex: string): boolean {
  const channels = hexChannels(hex);
  if (!channels) return true;
  const [r, g, b] = channels.map((c) => {
    const channel = c / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.32;
}

/**
 * Swiss-safe custom palette. The old custom colours belong to the Modern
 * style (dark surfaces), so entering Swiss Custom resets them to the poster
 * duo while keeping the brand accent the user already picked.
 */
export function seedSwissCustomColors(
  previous: { accent?: string } | null | undefined,
  accent?: string
): { primary: string; secondary: string; tertiary: string; accent: string } {
  return {
    primary: SWISS.blue,
    secondary: SWISS.panel,
    tertiary: SWISS.paper,
    accent: accent || previous?.accent || '#2563EB',
  };
}
