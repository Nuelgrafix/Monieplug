// Environment configuration and validation

export interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // Authentication
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;

  // OAuth Providers
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;

  // API Configuration
  NEXT_PUBLIC_API_URL: string;
  BACKEND_API: string;

  // Environment
  NODE_ENV: 'development' | 'production' | 'test';

  // App Configuration
  APP_NAME: string;
  APP_VERSION: string;
}

// Environment variable validation
function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'AUTH_GOOGLE_ID',
    'AUTH_GOOGLE_SECRET',
    'NEXT_PUBLIC_API_URL',
    'BACKEND_API',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    BACKEND_API: process.env.BACKEND_API!,
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    APP_NAME: process.env.APP_NAME || 'Monieplug',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
  };
}

// Validate environment on module load
export const env = validateEnv();

// Helper functions for environment checks
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}

// API URL helpers
export function getApiUrl(): string {
  return env.NEXT_PUBLIC_API_URL;
}

export function getBackendUrl(): string {
  return env.BACKEND_API;
}

// Authentication URL helpers
export function getAuthUrl(): string {
  return env.NEXTAUTH_URL;
}

// Database helpers
export function getDatabaseUrl(): string {
  return env.DATABASE_URL;
}

// Logging helpers
export function logEnvInfo() {
  if (isDevelopment()) {
    console.log('Environment Configuration:');
    console.log(`- App: ${env.APP_NAME} v${env.APP_VERSION}`);
    console.log(`- Environment: ${env.NODE_ENV}`);
    console.log(`- API URL: ${env.NEXT_PUBLIC_API_URL}`);
    console.log(`- Backend URL: ${env.BACKEND_API}`);
  }
}

// Initialize logging
logEnvInfo();