// Export authentication utilities
export { getServerAuth, requireServerAuth, getUserFromRequest, getTokenFromRequest } from './auth-utils';
export { useAuth, useAuthStatus, useUser, useAuthError, useProtectedRoute } from './client-auth';
export { ProtectedRoute, withAuth } from '../../components/ProtectedRoute';

// Export validation utilities
export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateSignupForm,
  validateLoginForm,
  validateEventForm,
} from './validation';

// Export constants and configuration
export * from './constants';
export { env, isProduction, isDevelopment, isTest, getApiUrl, getBackendUrl } from './env';

// Export utility functions
export {
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatNumber,
  debounce,
  throttle,
  isMobile,
  isIOS,
  isAndroid,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  sleep,
  retry,
} from './utils';

// Export API utilities
export { withApiAuth, successResponse, errorResponse, requireAuth } from './api-utils';

// Export session and cookie utilities
export { getSession, isAuthenticated, getCurrentUser } from './actions/session';
export { setAuthToken, getAuthToken, clearAuthToken, setUserData, getUserData, clearUserData } from './cookie-setter';

// Export server actions