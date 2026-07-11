// Vercel Edge Middleware — serves pre-rendered HTML to social media crawlers
// Fetches product data from /api/products (Vercel Blob storage)

const BOT_AGENTS = [
  'facebookexternalhit', 'WhatsApp', 'Twitter', 'Telegram', 'Slack',
  'Skype', 'Pinterest', 'LinkedIn', 'Discord', 'Googlebot', 'bingbot',
];

function isBot(ua) {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_AGENTS.some(b => lower.includes(b.toLowerCase()));
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function productHTML(p, id, base) {
  const title = `${p.name} | Lumina Store`;
  const url = `${base}/product/${id}`;
  const desc = stripHtml(p.description || p.desc || '');
  const img = p.image || p.img || '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <meta property="og:type" content="product"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:image" content="${img}"/>
  <meta property="og:image:width" content="800"/>
  <meta property="og:image:height" content="800"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Lumina Store"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <meta name="twitter:image" content="${img}"/>
  <meta name="theme-color" content="#ffffff"/>
  <link rel="icon" href="/favicon.ico" sizes="any"/>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`;
}

export const config = {
  matcher: ['/product/:path*'],
};

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!isBot(ua)) return undefined;

  const url = new URL(request.url);
  const match = url.pathname.match(/\/product\/([^/?]+)/);
  if (!match) return undefined;

  const pid = match[1];

  try {
    // Fetch products from the API endpoint
    const apiUrl = new URL('/api/products', url.origin);
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return undefined;

    const products = await res.json();
    if (!Array.isArray(products)) return undefined;

    const product = products.find(p => String(p.id) === String(pid));
    if (!product) return undefined;

    return new Response(productHTML(product, pid, url.origin), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    });
  } catch (e) {
    return undefined;
  }
}
