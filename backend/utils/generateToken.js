import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token for a user
 * @param {string} id - User MongoDB ID
 * @param {string} role - User Role (super_admin, admin, staff, customer)
 * @returns {string} Signed JWT Token
 */
export const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'creotex_super_secret_jwt_key_994812_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    }
  );
};

export default generateToken;
