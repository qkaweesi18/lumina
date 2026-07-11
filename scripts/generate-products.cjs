#!/usr/bin/env node
// prebuild: generates public/products-data.json from constants.ts
// This file is read by the Edge Middleware for OG tag generation

const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', 'constants.ts');
const content = fs.readFileSync(constantsPath, 'utf8');

const products = [];
// Split by product blocks (each starts with { id:)
const blocks = content.split(/\{\s*id:\s*'/).slice(1);

for (const block of blocks) {
  const id = block.match(/^([^'"]+)'/)?.[1];
  const name = block.match(/name:\s*'([^']+)'/)?.[1];
  const price = block.match(/price:\s*(\d+)/)?.[1];
  const description = block.match(/description:\s*'([^']+)'/)?.[1];
  const image = block.match(/image:\s*'([^']+)'/)?.[1];
  const category = block.match(/category:\s*'([^']+)'/)?.[1];

  if (id && name && image) {
    products.push({ id, name, price: Number(price)||0, description: description||'', image, category: category||'' });
  }
}

// Also load admin-added products if they exist
const adminPath = path.join(__dirname, '..', 'admin-products.json');
if (fs.existsSync(adminPath)) {
  try {
    const admin = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
    for (const ap of admin) {
      if (!products.find(p => p.id === ap.id)) {
        products.push(ap);
      }
    }
  } catch(e) { /* ignore */ }
}

const outDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'products-data.json');
fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log(`✅ Generated products-data.json with ${products.length} products`);
