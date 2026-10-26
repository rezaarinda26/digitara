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
  /** Hairline rule on paper. */
  ruleOnPaper: 'rgba(11, 43, 107, 0.28)',
  /** Hairline rule on blue. */
  ruleOnBlue: 'rgba(241, 240, 234, 0.35)',
} as const;

/** Rotation of the diagonal axis shared by every Swiss composition. */
export const SWISS_AXIS_DEG = -18;
