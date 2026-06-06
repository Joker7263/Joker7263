export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Proxy endpoint para sa mga HTTP stream
    if (url.pathname === '/stream' && url.searchParams.has('url')) {
      const targetUrl = url.searchParams.get('url');
      try {
        // Kunin ang stream mula sa orihinal na HTTP source
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Origin': 'https://breadtv.pages.dev',
            'Referer': 'https://breadtv.pages.dev/'
          }
        });

        // Gumawa ng bagong response na may tamang CORS headers
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

        return new Response(response.body, {
          status: response.status,
          headers: newHeaders
        });
      } catch (error) {
        return new Response(`Proxy error: ${error.message}`, { status: 500 });
      }
    }

    // Para sa mga OPTIONS request (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};