// Vercel Edge Middleware — serves pre-rendered HTML to social media crawlers
// This runs on the EDGE before the request hits your Vite app

const PRODUCTS = {
  '1': { name: 'Minimalist Leather Tote', desc: 'Handcrafted from genuine full-grain leather. A versatile companion for your daily commute or weekend getaway.', img: 'https://picsum.photos/id/20/800/800' },
  '2': { name: 'Ceramic Pour-Over Set', desc: 'Experience the ritual of coffee brewing with this matte black ceramic set. Designed for optimal heat retention.', img: 'https://picsum.photos/id/30/800/800' },
  '3': { name: 'Analog Desk Clock', desc: 'Stripped back to the essentials. A silent sweep movement mechanism housed in a solid oak frame.', img: 'https://picsum.photos/id/175/800/800' },
  '4': { name: 'Merino Wool Scarf', desc: 'Ultra-soft, ethically sourced merino wool. Keeps you warm without the bulk.', img: 'https://picsum.photos/id/103/800/800' },
  '5': { name: 'Graphite Sketch Set', desc: 'Professional grade graphite pencils for the aspiring artist. Encased in a reusable tin box.', img: 'https://picsum.photos/id/24/800/800' },
  '6': { name: 'Linen Bed Sheets', desc: 'Breathable, stone-washed linen that gets softer with every wash. Cool in summer, warm in winter.', img: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&h=800&fit=crop' },
};

const BOT_AGENTS = [
  'facebookexternalhit', 'WhatsApp', 'Twitter', 'Telegram', 'Slack',
  'Skype', 'Pinterest', 'LinkedIn', 'Discord', 'Googlebot', 'bingbot',
];

function isBot(ua) {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_AGENTS.some(b => lower.includes(b.toLowerCase()));
}

function productHTML(p, id, base) {
  const title = `${p.name} | Lumina Store`;
  const url = `${base}/product/${id}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <meta property="og:type" content="product"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${p.desc}"/>
  <meta property="og:image" content="${p.img}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Lumina Store"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${p.desc}"/>
  <meta name="twitter:image" content="${p.img}"/>
  <meta name="theme-color" content="#ffffff"/>
  <link rel="icon" href="/favicon.ico" sizes="any"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
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

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!isBot(ua)) return undefined; // Let Vite handle it normally

  const url = new URL(request.url);
  const match = url.pathname.match(/\/product\/([^/?]+)/);
  if (!match) return undefined;

  const pid = match[1];
  const product = PRODUCTS[pid];
  if (!product) return undefined;

  return new Response(productHTML(product, pid, url.origin), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
