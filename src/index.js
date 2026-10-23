import CONFIG from '../data/config.json';
import PRODUCTS from '../data/content.json';

const ORIGIN = 'https://web-sufi.aivoo.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/store') {
      const store = { ...CONFIG, ...PRODUCTS };
      return new Response(JSON.stringify(store), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/api/products') {
      return new Response(JSON.stringify(PRODUCTS.products || []), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/api/notifications') {
      return new Response(JSON.stringify(PRODUCTS.notifications || []), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/manifest.json') {
      const manifest = {
        name: CONFIG.storeName,
        short_name: CONFIG.storeName,
        description: CONFIG.heroSubtitle || 'Online store',
        start_url: '/',
        display: 'standalone',
        background_color: '#f9fafb',
        theme_color: (CONFIG.theme && CONFIG.theme.brand && CONFIG.theme.brand['600']) || '#4f46e5',
        icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      };
      return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/logo.svg' || url.pathname === '/favicon.svg') {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="' + ((CONFIG.theme && CONFIG.theme.brand && CONFIG.theme.brand['600']) || '#4f46e5') + '"/><text x="100" y="38" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">' + (CONFIG.storeName || 'Store') + '</text></svg>';
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' } });
    }

    const originUrl = new URL(url.pathname + url.search, ORIGIN);
    const resp = await fetch(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: ['GET','HEAD'].includes(request.method) ? undefined : request.body,
    });
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
    });
  },
};
