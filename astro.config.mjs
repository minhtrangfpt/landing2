import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// VERIFY: change to the real registered domain before launch.
const SITE = 'https://mangfpt.vn';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: { format: 'directory' },
});
