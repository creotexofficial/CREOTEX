import dns from 'dns';
if (dns && dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from '../models/Product.js';
import StoreSettings from '../models/StoreSettings.js';
import seedProducts from '../data/seedProducts.js';

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing in backend/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected successfully to MongoDB Atlas database!');

    // 1. Import FILAMENT_SUBCATEGORIES from frontend
    const { FILAMENT_SUBCATEGORIES } = await import('../../frontend/src/data/productsData.js');

    // 2. Upsert all 22 products
    console.log(`Processing ${seedProducts.length} catalog products...`);
    let inserted = 0;
    let updated = 0;

    for (const p of seedProducts) {
      const existing = await Product.findOne({
        $or: [{ sku: p.sku }, { customId: p.customId }]
      });

      if (existing) {
        Object.assign(existing, p);
        await existing.save();
        updated++;
      } else {
        await Product.create(p);
        inserted++;
      }
    }
    console.log(`Products Sync Complete: ${inserted} inserted, ${updated} updated.`);

    // 3. Update StoreSettings with filament subcategories
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings();
    }
    settings.filamentSubcategories = FILAMENT_SUBCATEGORIES;
    await settings.save();
    console.log(`StoreSettings updated with ${FILAMENT_SUBCATEGORIES.length} filament subcategories!`);

    // 4. Verify in DB
    const totalCount = await Product.countDocuments({ isActive: true });
    console.log(`Total active products now in MongoDB: ${totalCount}`);

    const breakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('Category breakdown in DB:', breakdown);

    console.log('CATALOG SYNC TO MONGODB FINISHED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Catalog Sync Error:', err);
    process.exit(1);
  }
}

run();

