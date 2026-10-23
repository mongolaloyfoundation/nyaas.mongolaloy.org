import CONFIG from '../data/config.json';
import PRODUCTS from '../data/content.json';

const ORIGIN = 'https://web-sufi.aivoo.app';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoints — store-specific data
    if (url.pathname === '/api/store') {
      return new Response(JSON.stringify({ ...CONFIG, ...PRODUCTS }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.pathname === '/api/products') {
      return new Response(JSON.stringify(PRODUCTS.products || []), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.pathname === '/api/notifications') {
      return new Response(JSON.stringify(PRODUCTS.notifications || []), {
        headers: { 'Content-Type': 'application/json' },
      });
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
        icons: [{ src: CONFIG.logo && CONFIG.logo.startsWith('/') ? CONFIG.logo : '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      };
      return new Response(JSON.stringify(manifest), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Serve static assets from the worker (logo, favicon, images, etc.)
    if (env && env.ASSETS) {
      try {
        const assetResp = await env.ASSETS.fetch(request);
        if (assetResp.status !== 404) {
          return assetResp;
        }
      } catch (e) {}
    }

    // Proxy everything else to the main Sufi Pages URL
    const originUrl = new URL(url.pathname + url.search, ORIGIN);
    const resp = await fetch(originUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
    });
  },
};