import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '../src/data/products.json');
const outputDir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const categoryThemes = {
  audio: { bg1: '#0f172a', bg2: '#1e1b4b', accent: '#6366f1', glow: '#818cf8', symbol: '🎧' },
  wearables: { bg1: '#0f172a', bg2: '#022c22', accent: '#10b981', glow: '#34d399', symbol: '⌚' },
  computers: { bg1: '#0f172a', bg2: '#172554', accent: '#3b82f6', glow: '#60a5fa', symbol: '💻' },
  photography: { bg1: '#0f172a', bg2: '#312e81', accent: '#8b5cf6', glow: '#a78bfa', symbol: '📷' },
  gaming: { bg1: '#0f172a', bg2: '#450a0a', accent: '#f43f5e', glow: '#fb7185', symbol: '🎮' },
};

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSVG(product) {
  const theme = categoryThemes[product.category] || categoryThemes.audio;
  const priceFormatted = `$${product.price.toFixed(2)}`;
  const safeName = escapeXml(product.name);
  const safeBrand = escapeXml(product.brand);
  const safeCategory = escapeXml(product.category);

  return `
  <svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}" />
        <stop offset="100%" stop-color="${theme.bg2}" />
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <rect width="1200" height="900" fill="url(#bgGrad)" />
    
    <g opacity="0.05" stroke="#ffffff" stroke-width="1">
      <path d="M 0,150 L 1200,150 M 0,300 L 1200,300 M 0,450 L 1200,450 M 0,600 L 1200,600 M 0,750 L 1200,750" />
      <path d="M 200,0 L 200,900 M 400,0 L 400,900 M 600,0 L 600,900 M 800,0 L 800,900 M 1000,0 L 1000,900" />
    </g>

    <circle cx="600" cy="420" r="400" fill="url(#glowGrad)" />

    <rect x="200" y="140" width="800" height="580" rx="32" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2" filter="url(#shadow)" />

    <circle cx="600" cy="320" r="100" fill="${theme.accent}" fill-opacity="0.25" stroke="${theme.glow}" stroke-width="3" />
    <text x="600" y="355" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="90" text-anchor="middle">${theme.symbol}</text>

    <text x="600" y="490" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="${theme.glow}" text-anchor="middle" text-transform="uppercase">${safeBrand.toUpperCase()}</text>

    <text x="600" y="545" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">${safeName}</text>

    <rect x="500" y="595" width="200" height="50" rx="25" fill="${theme.accent}" />
    <text x="600" y="628" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">${priceFormatted}</text>

    <text x="70" y="840" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#94a3b8">AURA PREMIUM COLLECTION</text>
    <text x="1130" y="840" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#94a3b8" text-anchor="end">${safeCategory.toUpperCase()} • RATING ${product.rating}★</text>
  </svg>
  `;
}

async function processAll() {
  console.log(`Processing responsive WebP images for ${products.length} products...`);
  
  for (const product of products) {
    const svgString = generateSVG(product);
    const svgBuffer = Buffer.from(svgString);

    const baseName = product.id;

    await sharp(svgBuffer)
      .resize(1200, 900)
      .webp({ quality: 90 })
      .toFile(path.join(outputDir, `${baseName}-1200w.webp`));

    await sharp(svgBuffer)
      .resize(800, 600)
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${baseName}-800w.webp`));

    await sharp(svgBuffer)
      .resize(400, 300)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${baseName}-400w.webp`));

    console.log(`Generated WebP variants for ${product.id} (${product.name})`);
  }

  console.log('All 72 product images successfully processed into public/images/products!');
}

processAll().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
