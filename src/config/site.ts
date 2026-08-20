const SITE_URL =
  (import.meta.env.SITE_URL as string) ||
  (typeof process !== 'undefined' && process.env && process.env.SITE_URL) ||
  'https://fpt24h.com.vn';

export const site = {
  brand: 'Mạng FPT',
  /** Per-deploy via the SITE_URL env var; fallback is the live domain. */
  siteUrl: SITE_URL,
  phoneDisplay: '0931.50.55.56',
  phoneRaw: '0931505556',
  zalo: 'https://zalo.me/0931505556',
  defaultProvince: 'haiphong',
} as const;

/** Analytics IDs — set via env vars. Inactive until configured. */
export const analytics = {
  ga4Id: (import.meta.env.PUBLIC_GA4_ID as string) || '',
  adsId: (import.meta.env.PUBLIC_ADS_ID as string) || '',
  adsLabel: (import.meta.env.PUBLIC_ADS_LABEL as string) || '',
};

/** Web3Forms access key — silent lead delivery to email (no mailto popup). */
export const web3forms = {
  key: (import.meta.env.PUBLIC_WEB3FORMS_KEY as string) || '',
};
