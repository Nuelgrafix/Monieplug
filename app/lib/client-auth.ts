import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState, AppDispatch } from '@/redux/store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout as logoutAction,
  clearError
} from '@/redux/slices/authSlice';
import { useLoginMutation, useSignupMutation } from '@/redux/slices/apiSlice';

// Client-side authentication utilities
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();

  const login = async (email: string, password: string) => {
    dispatch(loginStart());

    try {
      const result = await loginMutation({ email, password }).unwrap();
      dispatch(loginSuccess(result));
      return { success: true };
    } catch (error: any) {
      dispatch(loginFailure(error?.data?.message || 'Login failed'));
      return { success: false, error: error?.data?.message || 'Login failed' };
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }) => {
    dispatch(signupStart());

    try {
      const result = await signupMutation(userData).unwrap();
      dispatch(signupSuccess(result));
      return { success: true };
    } catch (error: any) {
      dispatch(signupFailure(error?.data?.message || 'Signup failed'));
      return { success: false, error: error?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    router.push('/signin');
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    clearAuthError,
  };
}

// Utility for checking authentication status
export function useProtectedRoute(redirectTo: string = '/signin') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // This should be used in a React component with useEffect
  const checkAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  };

  return {
    isAuthenticated,
    loading,
    shouldRender: !loading && isAuthenticated,
    checkAuth
  };
}

// Hook for checking authentication status
export function useAuthStatus() {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    isAuthenticated,
    loading,
    isLoading: loading,
  };
}

// Hook for user data
export function useUser() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    isAuthenticated,
  };
}

// Hook for authentication errors
export function useAuthError() {
  const { error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const clearAuthError = (): void => {
    dispatch(clearError());
  };

  return {
    error,
    clearError: clearAuthError,
  };
}