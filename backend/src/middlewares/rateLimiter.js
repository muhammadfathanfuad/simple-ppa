const rateLimit = require('express-rate-limit');
const { app: appConfig } = require('../config');

// Public API Rate Limiter
// Default: 60-100 requests per minute
const publicLimiter = rateLimit({
    windowMs: appConfig.rateLimit.public.windowMs,
    max: appConfig.rateLimit.public.max,
    message: {
        status: 'fail',
        message: 'Too many requests from this IP to the public API, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth API Rate Limiter (Login, Register, etc.)
// Default: 5-10 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: appConfig.rateLimit.auth.windowMs,
    max: appConfig.rateLimit.auth.max,
    message: {
        status: 'fail',
        message: 'Too many login attempts from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Search API Rate Limiter
// Default: 20-30 requests per minute
const searchLimiter = rateLimit({
    windowMs: appConfig.rateLimit.search.windowMs,
    max: appConfig.rateLimit.search.max,
    message: {
        status: 'fail',
        message: 'Too many search requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    publicLimiter,
    authLimiter,
    searchLimiter
};
