import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Models
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Customer from './models/Customer.js';
import Datasheet from './models/Datasheet.js';
import StoreSettings from './models/StoreSettings.js';
import RobotBuilderConfig from './models/RobotBuilder.js';

// Seed Data
import seedUsers from './data/seedUsers.js';
import seedProducts from './data/seedProducts.js';
import seedOrders from './data/seedOrders.js';
import seedCoupons from './data/seedCoupons.js';
import seedCustomers from './data/seedCustomers.js';
import seedDatasheets from './data/seedDatasheets.js';
import seedSettings from './data/seedSettings.js';
import {
  seedRobotBuilderPresets,
  seedRobotBuilderSlots,
  seedRobotBuilderSettings
} from './data/seedRobotBuilder.js';

// Load env vars
dotenv.config();

/**
 * Import Demo Data into MongoDB
 */
const importData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('\x1b[31m%s\x1b[0m', 'Cannot seed database without a valid MONGO_URI in backend/.env');
      process.exit(1);
    }

    console.log('\x1b[33m%s\x1b[0m', '⚡ Clearing existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    await Customer.deleteMany();
    await Datasheet.deleteMany();
    await StoreSettings.deleteMany();
    await RobotBuilderConfig.deleteMany();

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Users (with bcrypt hashing)...');
    for (const user of seedUsers) {
      await User.create(user);
    }

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Products Catalog...');
    await Product.insertMany(seedProducts);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Initial Orders...');
    await Order.insertMany(seedOrders);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Coupons...');
    await Coupon.insertMany(seedCoupons);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Customer CRM Records...');
    await Customer.insertMany(seedCustomers);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Datasheets & Manuals...');
    await Datasheet.insertMany(seedDatasheets);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Store Settings...');
    await StoreSettings.create(seedSettings);

    console.log('\x1b[36m%s\x1b[0m', '🌱 Seeding Robot Builder Config...');
    await RobotBuilderConfig.create({
      presets: seedRobotBuilderPresets,
      slots: seedRobotBuilderSlots,
      settings: seedRobotBuilderSettings
    });

    console.log('\x1b[32m%s\x1b[0m', '=========================================================');
    console.log('\x1b[32m%s\x1b[0m', '🎉 CREOTEX DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('\x1b[32m%s\x1b[0m', `   - ${seedProducts.length} Products Catalog items`);
    console.log('\x1b[32m%s\x1b[0m', `   - ${seedUsers.length} Admin & Maker Users`);
    console.log('\x1b[32m%s\x1b[0m', `   - ${seedOrders.length} Demo Orders`);
    console.log('\x1b[32m%s\x1b[0m', `   - ${seedCoupons.length} Active Coupon Codes`);
    console.log('\x1b[32m%s\x1b[0m', `   - ${seedDatasheets.length} Engineering Datasheets`);
    console.log('\x1b[32m%s\x1b[0m', `   - Competition Robot Builder Config`);
    console.log('\x1b[32m%s\x1b[0m', '=========================================================');

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Wipe all data from collections
 */
const destroyData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('\x1b[31m%s\x1b[0m', 'Cannot connect to database.');
      process.exit(1);
    }

    console.log('\x1b[31m%s\x1b[0m', '⚠️  Wiping all Creotex database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Coupon.deleteMany();
    await Customer.deleteMany();
    await Datasheet.deleteMany();
    await StoreSettings.deleteMany();
    await RobotBuilderConfig.deleteMany();

    console.log('\x1b[32m%s\x1b[0m', '✅ All Creotex database data destroyed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
