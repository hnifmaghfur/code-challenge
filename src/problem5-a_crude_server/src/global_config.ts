import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const CONFIG = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // API configuration
  API_PREFIX: process.env.API_PREFIX || '/api',

  // Admin configuration
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'adminpw',
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 24,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Freeze the configuration object to prevent modifications
Object.freeze(CONFIG);
