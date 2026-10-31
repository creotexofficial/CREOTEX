import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import datasheetRoutes from './routes/datasheetRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import robotBuilderRoutes from './routes/robotBuilderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Initialize environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Security and Performance Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
    if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev mode
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check / Root Status Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'CreotexShop API',
    version: '1.0.0',
    description: 'Robotics, Electronics & Prototyping Hardware E-Commerce API',
    status: 'ONLINE',
    database: process.env.MONGO_URI ? 'CONFIGURED' : 'WAITING_FOR_URI',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      coupons: '/api/coupons',
      customers: '/api/customers',
      datasheets: '/api/datasheets',
      settings: '/api/settings',
      robotBuilder: '/api/robot-builder',
      stats: '/api/stats/dashboard'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: process.env.MONGO_URI ? 'URI Set' : 'URI Missing (Standby)',
    env: process.env.NODE_ENV || 'development'
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/datasheets', datasheetRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/robot-builder', robotBuilderRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  const databaseConnected = await connectDB();
  if (!databaseConnected) {
    console.error('Backend startup stopped because MongoDB is unavailable.');
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', '=========================================================');
    console.log('\x1b[36m%s\x1b[0m', `🚀 CreotexShop Backend Server Running on Port: ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log('\x1b[36m%s\x1b[0m', `⚡ Healthcheck: http://localhost:${PORT}/api/health`);
    console.log('\x1b[36m%s\x1b[0m', `🛠️  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log('\x1b[36m%s\x1b[0m', '=========================================================');
  });
};

startServer();

export default app;
