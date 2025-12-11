import { queryKeys } from '@/api/queryKeys';
import type { SignInRequest, SignUpRequest } from '@/api/types';
import { useApi } from '@/context/ApiContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toastMessages } from '@/components/ToastProvider';
import { isApiError } from '@/api/errors';

/**
 * Auth hook with TanStack Query mutations
 *
 * Note: User state is managed by ApiContext (via Django auth)
 * This hook provides mutations for auth actions (sign in, sign up, sign out)
 *
 * Usage:
 * const { signIn, signUp, signOut, isSigningIn } = useAuth();
 * await signIn({ email, password });
 */
export function useAuth() {
  const { http, api, user, isAuthenticated, isAuthLoading, refreshAuth } = useApi();
  const queryClient = useQueryClient();

  /**
   * Sign in mutation
   */
  const signInMutation = useMutation({
    mutationFn: (request: SignInRequest) => api.auth.signIn(http, request),
    onSuccess: async (data) => {
      // Refresh auth state to update context (wait for it to complete)
      await refreshAuth();
      // Invalidate user-specific queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });

      // Show success toast
      toastMessages.auth.signInSuccess();
    },
    onError: (error) => {
      // Show error toast with specific message
      if (isApiError(error)) {
        if (error.status === 401 || error.status === 400) {
          toastMessages.auth.invalidCredentials();
        } else if (error.status === 403) {
          toastMessages.auth.accountDisabled();
        } else {
          toastMessages.auth.signInFailed(error.message);
        }
      } else {
        toastMessages.auth.signInFailed();
      }
    },
  });

  /**
   * Sign up mutation
   */
  const signUpMutation = useMutation({
    mutationFn: (request: SignUpRequest) => api.auth.signUp(http, request),
    onSuccess: async (data) => {
      // Refresh auth state to update context (wait for it to complete)
      await refreshAuth();
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });

      // Show success toast
      toastMessages.auth.signUpSuccess();
    },
    onError: (error) => {
      // Show error toast with specific message
      if (isApiError(error)) {
        toastMessages.auth.signUpFailed(error.message);
      } else {
        toastMessages.auth.signUpFailed();
      }
    },
  });

  /**
   * Sign out mutation
   */
  const signOutMutation = useMutation({
    mutationFn: () => api.auth.signOut(http),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();

      // Show success toast
      toastMessages.auth.signOutSuccess();
    },
  });

  /**
   * Reset password mutation
   */
  const resetPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => api.auth.resetPassword(http, email),
    onSuccess: () => {
      toastMessages.auth.passwordResetSent();
    },
    onError: (error) => {
      if (isApiError(error)) {
        toastMessages.errors.validation(error.message);
      } else {
        toastMessages.errors.unknown();
      }
    },
  });

  /**
   * Change password mutation
   */
  const changePasswordMutation = useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      api.auth.changePassword(http, oldPassword, newPassword),
    onSuccess: () => {
      toastMessages.auth.passwordChanged();
    },
    onError: (error) => {
      if (isApiError(error)) {
        toastMessages.errors.validation(error.message);
      } else {
        toastMessages.errors.unknown();
      }
    },
  });

  return {
    // Auth state (from context)
    user,
    isAuthenticated,
    isAuthLoading,
    refreshAuth,

    // Mutations
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,

    // Loading states
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,

    // Errors
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    changePasswordError: changePasswordMutation.error,
  };
}
