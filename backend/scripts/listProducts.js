import dns from 'dns';
if (dns && dns.setServers) dns.setServers(['8.8.8.8', '1.1.1.1']);

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from '../models/Product.js';
import StoreSettings from '../models/StoreSettings.js';

async function listAll() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({ isActive: true }).sort({ category: 1, name: 1 }).lean();
  console.log(`\n=== TOTAL PRODUCTS IN MONGODB: ${products.length} ===\n`);
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.category.toUpperCase()}] [${p.subCategory || 'N/A'}] ${p.name} (SKU: ${p.sku}) - Price: ₹${p.price}, Stock: ${p.stock}`);
  });

  const settings = await StoreSettings.findOne().lean();
  console.log(`\n=== TOTAL FILAMENT SUBCATEGORIES IN DB: ${settings?.filamentSubcategories?.length || 0} ===\n`);
  (settings?.filamentSubcategories || []).forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.subCategoryKey}] ${s.displayName || s.name} - Badge: ${s.badge} | Price: ₹${s.price}`);
  });

  process.exit(0);
}

listAll().catch(e => { console.error(e); process.exit(1); });

