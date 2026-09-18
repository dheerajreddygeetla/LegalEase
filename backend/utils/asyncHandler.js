// utils/asyncHandler.js
// Wraps an async route/controller function so any rejected promise is
// forwarded to Express's error-handling middleware instead of needing a
// try/catch in every single controller.

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
