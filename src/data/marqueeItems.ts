/**
 * Single source of truth for the three running-text ribbons on the page
 * (Services, MidBanner, Portfolio). Each item is editable through the CMS
 * editorial override `services.marquee.<index>`, so editing any one ribbon
 * updates all of them at once.
 */
export const MARQUEE_ITEMS = [
  'Development',
  'Branding',
  'Motion',
  'Digital Products',
  'UI/UX Design',
  'Creative Development',
  'Design Systems',
] as const;

/** Editorial override key for a ribbon slot (wraps across the item list). */
export const marqueeKey = (index: number) =>
  `services.marquee.${index % MARQUEE_ITEMS.length}`;
