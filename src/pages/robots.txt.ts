import type { APIRoute } from 'astro';
import { site } from '../config/site';

// robots.txt generated from site.siteUrl (single source of truth).
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${site.siteUrl}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
