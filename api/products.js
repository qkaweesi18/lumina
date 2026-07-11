// /api/products.js — Vercel Serverless Function
// GET: returns all products (middleware calls this)
// POST: saves all products from admin panel

import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'products/' });
      const latest = blobs
        .filter(b => b.pathname === 'products/latest.json')
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
      if (!latest) return res.status(200).json([]);
      const response = await fetch(latest.url);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(200).json([]);
    }
  }

  if (req.method === 'POST') {
    try {
      const products = req.body;
      await put('products/latest.json', JSON.stringify(products, null, 2), {
        contentType: 'application/json',
        access: 'public',
        addRandomSuffix: false,
      });
      return res.status(200).json({ success: true, count: products.length });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
