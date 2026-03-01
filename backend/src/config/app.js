require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // File upload configuration
  upload: {
    maxSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB default
    allowedTypes: process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(',')
      : ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'],
    destination: process.env.UPLOAD_DESTINATION || 'uploads/',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },

  // Rate limiting configuration
  rateLimit: {
    public: {
      windowMs: process.env.RATE_LIMIT_PUBLIC_WINDOW_MS
        ? parseInt(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS)
        : 1 * 60 * 1000, // 1 minute
      max: process.env.NODE_ENV === 'development'
        ? 1000
        : (process.env.RATE_LIMIT_PUBLIC_MAX ? parseInt(process.env.RATE_LIMIT_PUBLIC_MAX) : 100),
    },
    auth: {
      windowMs: process.env.RATE_LIMIT_AUTH_WINDOW_MS
        ? parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS)
        : 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === 'development'
        ? 1000
        : (process.env.RATE_LIMIT_AUTH_MAX ? parseInt(process.env.RATE_LIMIT_AUTH_MAX) : 10),
    },
    search: {
      windowMs: process.env.RATE_LIMIT_SEARCH_WINDOW_MS
        ? parseInt(process.env.RATE_LIMIT_SEARCH_WINDOW_MS)
        : 1 * 60 * 1000, // 1 minute
      max: process.env.NODE_ENV === 'development'
        ? 1000
        : (process.env.RATE_LIMIT_SEARCH_MAX ? parseInt(process.env.RATE_LIMIT_SEARCH_MAX) : 30),
    }
  },

  // Email configuration (if needed)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  // Pagination configuration
  pagination: {
    defaultLimit: process.env.DEFAULT_PAGE_LIMIT
      ? parseInt(process.env.DEFAULT_PAGE_LIMIT)
      : 10,
    maxLimit: process.env.MAX_PAGE_LIMIT
      ? parseInt(process.env.MAX_PAGE_LIMIT)
      : 100,
  },
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

module.exports = config;