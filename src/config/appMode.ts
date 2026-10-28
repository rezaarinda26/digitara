/**
 * CMS tools are intentionally available only in local development and in the
 * explicit prototype build. The normal production build is visitor-facing.
 */
export const CMS_ENABLED = import.meta.env.DEV || import.meta.env.MODE === 'prototype';
