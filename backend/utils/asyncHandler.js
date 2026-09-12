/**
 * Async handler wrapper to eliminate try-catch boilerplate in route controllers
 * Automatically passes any caught errors to Express error handling middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
