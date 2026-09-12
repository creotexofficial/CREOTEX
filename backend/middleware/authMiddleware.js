import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

/**
 * Protect routes: Verify JWT token in Authorization header
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'creotex_super_secret_jwt_key_994812_2026'
      );

      // Fetch user from DB (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user account no longer exists');
      }

      if (req.user.status === 'Suspended') {
        res.status(403);
        throw new Error('Your account has been suspended. Please contact Creotex Support.');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error(error.message || 'Not authorized, token validation failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no bearer token provided');
  }
});

/**
 * Grant access to specific roles
 * Example: authorize('super_admin', 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route`
      );
    }
    next();
  };
};

/**
 * Helper for Admin/Super Admin only routes
 */
export const adminOnly = authorize('super_admin', 'admin');

/**
 * Helper for Super Admin only routes
 */
export const superAdminOnly = authorize('super_admin');
