import React from 'react';
import { StyleSheet } from 'react-native';
import Toast, { ToastShowParams, BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[
          styles.toastBase,
          {
            borderLeftColor: colors.success,
            backgroundColor: colors.card,
          }
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textMuted }]}
        text2NumberOfLines={2}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={[
          styles.toastBase,
          {
            borderLeftColor: colors.error,
            backgroundColor: colors.card,
          }
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textMuted }]}
        text2NumberOfLines={2}
      />
    ),
    info: (props: any) => (
      <InfoToast
        {...props}
        style={[
          styles.toastBase,
          {
            borderLeftColor: colors.primary,
            backgroundColor: colors.card,
          }
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textMuted }]}
        text2NumberOfLines={2}
      />
    ),
    warning: (props: any) => (
      <BaseToast
        {...props}
        style={[
          styles.toastBase,
          {
            borderLeftColor: colors.warning,
            backgroundColor: colors.card,
          }
        ]}
        contentContainerStyle={styles.contentContainer}
        text1Style={[styles.text1, { color: colors.text }]}
        text2Style={[styles.text2, { color: colors.textMuted }]}
        text2NumberOfLines={2}
      />
    ),
  };

  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  toastBase: {
    borderLeftWidth: 5,
    borderRadius: 8,
    height: undefined,
    minHeight: 60,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  text2: {
    fontSize: 13,
    fontWeight: '400',
  },
});

/**
 * Toast notification utility
 * Provides consistent toast messages across the app
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION = 'bottom';

/**
 * Generic toast function
 */
export const showToast = (options: ToastOptions) => {
  Toast.show({
    type: options.type,
    text1: options.title,
    text2: options.message,
    position: options.position || DEFAULT_POSITION,
    visibilityTime: options.duration || DEFAULT_DURATION,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
  });
};

/**
 * Convenience methods for different toast types
 */
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    showToast({ type: 'success', title, message, duration });
  },

  error: (title: string, message?: string, duration?: number) => {
    showToast({ type: 'error', title, message, duration });
  },

  info: (title: string, message?: string, duration?: number) => {
    showToast({ type: 'info', title, message, duration });
  },

  warning: (title: string, message?: string, duration?: number) => {
    showToast({ type: 'warning', title, message, duration });
  },
};

/**
 * Pre-configured toast messages for common scenarios
 */
export const toastMessages = {
  // Auth messages
  auth: {
    signInSuccess: () => toast.success('Welcome back!', 'You have successfully signed in'),
    signUpSuccess: () => toast.success('Account created!', 'Welcome to Wiwebb'),
    signOutSuccess: () => toast.success('Signed out', 'You have been signed out successfully'),
    passwordChanged: () => toast.success('Password updated', 'Your password has been changed successfully'),
    passwordResetSent: () => toast.success('Check your email', 'Password reset instructions have been sent'),
    profileUpdated: () => toast.success('Profile updated', 'Your profile has been updated successfully'),
    avatarUpdated: () => toast.success('Avatar updated', 'Your profile picture has been updated'),

    // Auth errors
    invalidCredentials: () => toast.error('Invalid credentials', 'Please check your username and password'),
    accountDisabled: () => toast.error('Account disabled', 'Your account has been disabled'),
    sessionExpired: () => toast.error('Session expired', 'Please sign in again'),
    signInFailed: (message?: string) => toast.error('Sign in failed', message || 'Unable to sign in. Please try again'),
    signUpFailed: (message?: string) => toast.error('Sign up failed', message || 'Unable to create account. Please try again'),
  },

  // User management (Admin)
  users: {
    created: (username: string) => toast.success('User created', `${username} has been created successfully`),
    updated: (username: string) => toast.success('User updated', `${username} has been updated successfully`),
    deleted: (username: string) => toast.success('User deleted', `${username} has been deleted successfully`),
    activated: (username: string) => toast.success('User activated', `${username} has been activated`),
    deactivated: (username: string) => toast.success('User deactivated', `${username} has been deactivated`),
    roleAssigned: (username: string, role: string) => toast.success('Role assigned', `${username} is now a ${role}`),
    passwordSet: (username: string) => toast.success('Password set', `Password has been set for ${username}`),
  },

  // Tenant messages
  tenants: {
    created: () => toast.success('Tenant created', 'New tenant has been created successfully'),
    updated: () => toast.success('Tenant updated', 'Tenant has been updated successfully'),
    deleted: () => toast.success('Tenant deleted', 'Tenant has been deleted successfully'),
  },

  // Hotspot messages
  hotspots: {
    created: (name: string) => toast.success('Hotspot created', `${name} has been created successfully`),
    updated: (name: string) => toast.success('Hotspot updated', `${name} has been updated successfully`),
    deleted: (name: string) => toast.success('Hotspot deleted', `${name} has been deleted successfully`),
    online: (name: string) => toast.success('Hotspot online', `${name} is now online`),
    offline: (name: string) => toast.warning('Hotspot offline', `${name} is now offline`),
  },

  // RADIUS messages
  radius: {
    userCreated: (username: string) => toast.success('RADIUS user created', `${username} has been created successfully`),
    userUpdated: (username: string) => toast.success('RADIUS user updated', `${username} has been updated successfully`),
    userDeleted: (username: string) => toast.success('RADIUS user deleted', `${username} has been deleted successfully`),
    sessionTerminated: () => toast.success('Session terminated', 'User session has been terminated'),
  },

  // Subscription messages
  subscriptions: {
    created: () => toast.success('Subscription created', 'Subscription has been created successfully'),
    updated: () => toast.success('Subscription updated', 'Subscription has been updated successfully'),
    cancelled: () => toast.success('Subscription cancelled', 'Your subscription has been cancelled'),
    renewed: () => toast.success('Subscription renewed', 'Your subscription has been renewed'),
    expired: () => toast.warning('Subscription expired', 'Your subscription has expired'),
  },

  // Payment messages
  payments: {
    success: () => toast.success('Payment successful', 'Your payment has been processed'),
    failed: () => toast.error('Payment failed', 'Unable to process payment. Please try again'),
    pending: () => toast.info('Payment pending', 'Your payment is being processed'),
    refunded: () => toast.success('Payment refunded', 'Your payment has been refunded'),
  },

  // Generic CRUD messages
  crud: {
    created: (resource: string) => toast.success('Created', `${resource} created successfully`),
    updated: (resource: string) => toast.success('Updated', `${resource} updated successfully`),
    deleted: (resource: string) => toast.success('Deleted', `${resource} deleted successfully`),
    saved: (resource: string) => toast.success('Saved', `${resource} saved successfully`),
  },

  // Network and error messages
  errors: {
    network: () => toast.error('Network error', 'Please check your internet connection'),
    server: () => toast.error('Server error', 'Something went wrong. Please try again later'),
    notFound: () => toast.error('Not found', 'The requested resource was not found'),
    unauthorized: () => toast.error('Unauthorized', 'You do not have permission to perform this action'),
    validation: (message: string) => toast.error('Validation error', message),
    unknown: () => toast.error('Error', 'An unexpected error occurred'),
  },

  // General info messages
  info: {
    loading: () => toast.info('Loading', 'Please wait...'),
    noData: () => toast.info('No data', 'No data available'),
    comingSoon: () => toast.info('Coming soon', 'This feature is coming soon'),
    copied: () => toast.success('Copied', 'Copied to clipboard'),
  },
};