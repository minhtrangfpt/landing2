import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

// Domain (single source of truth): src/config/site.ts → site.siteUrl.
// canonical, sitemap, schema, and robots.txt all derive from it.
export default defineConfig({
  site: site.siteUrl,
  integrations: [sitemap()],
  build: { format: 'directory' },
});
