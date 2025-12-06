import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import httpClient from '@/lib/httpClient';
import { authStorage } from '@/lib/authStorage';
import { queryClient, clearAllQueries } from '@/lib/queryClient';
import { djangoAuthApi } from '@/api/django-auth.api';
import { usersApi } from '@/api/users.api';
import { tenantsApi } from '@/api/tenants.api';
import { hotspotsApi } from '@/api/hotspots.api';
import { radiusApi } from '@/api/radius.api';
import { subscriptionsApi } from '@/api/subscriptions.api';
import { paymentsApi } from '@/api/payments.api';
import type { User } from '@/api/types';

/**
 * API Context Value
 *
 * Architecture Decision: Auth State Management
 * ==========================================
 *
 * CONTEXT manages:
 * - Current user (from Django authentication)
 * - Auth token (stored in AsyncStorage)
 * - Auth loading state
 * - API client instances (http)
 * - API module references
 *
 * TANSTACK QUERY manages:
 * - Data fetching (hotspots, radius users, subscriptions, etc.)
 * - Caching and invalidation
 * - Loading/error states for data operations
 * - Mutations (create, update, delete)
 *
 * Why this split?
 * - Auth state is global, singleton, and persisted
 * - Data is request-driven, cacheable, and can be stale
 * - Context provides stable references; Query handles data lifecycle
 * - Avoids prop drilling while keeping data fetching declarative
 */

interface ApiContextValue {
  // Client instances
  http: AxiosInstance;

  // API modules
  api: {
    auth: typeof djangoAuthApi;
    users: typeof usersApi;
    tenants: typeof tenantsApi;
    hotspots: typeof hotspotsApi;
    radius: typeof radiusApi;
    subscriptions: typeof subscriptionsApi;
    payments: typeof paymentsApi;
  };

  // Auth state (managed by context)
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Auth helpers
  refreshAuth: () => Promise<void>;
}

const ApiContext = createContext<ApiContextValue | null>(null);

interface ApiProviderProps {
  children: React.ReactNode;
}

/**
 * API Provider Component
 *
 * Responsibilities:
 * 1. Initialize HTTP client
 * 2. Load user from storage on mount
 * 3. Provide API surface via context
 * 4. Wrap with QueryClientProvider for TanStack Query
 * 5. Clear query cache on logout
 */
export function ApiProvider({ children }: ApiProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a stored token
        const token = await authStorage.getAuthToken();

        if (token) {
          // Try to fetch current user from backend
          try {
            const currentUser = await djangoAuthApi.getCurrentUser(httpClient);
            setUser(currentUser);
          } catch (error) {
            // Token is invalid, clear storage
            console.warn('Stored token is invalid, clearing auth data');
            await authStorage.clearAll();
            setUser(null);
          }
        } else {
          // No stored token, check for stored user data (offline mode)
          const storedUser = await authStorage.getUserData();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Manually refresh auth state from backend
   */
  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await djangoAuthApi.getCurrentUser(httpClient);
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      // Clear auth data if refresh fails
      await authStorage.clearAll();
      setUser(null);
    }
  }, []);

  /**
   * Listen for manual auth updates (from login/logout)
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await authStorage.getAuthToken();
      const storedUser = await authStorage.getUserData();

      // If token was removed, clear user
      if (!token && user) {
        setUser(null);
        clearAllQueries();
      }

      // If user was updated in storage, update state
      if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
        setUser(storedUser);
      }
    };

    // Check auth status periodically
    const interval = setInterval(checkAuthStatus, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const value: ApiContextValue = {
    http: httpClient,
    api: {
      auth: djangoAuthApi,
      users: usersApi,
      tenants: tenantsApi,
      hotspots: hotspotsApi,
      radius: radiusApi,
      subscriptions: subscriptionsApi,
      payments: paymentsApi,
    },
    user,
    isAuthenticated: !!user,
    isAuthLoading,
    refreshAuth,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={value}>
        {children}
      </ApiContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * Hook to access API context
 * @throws {Error} if used outside ApiProvider
 */
export function useApi() {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  
  return context;
}

/**
 * Hook to access auth state only
 * Convenience hook for components that only need auth info
 */
export function useAuthState() {
  const { user, isAuthenticated, isAuthLoading, refreshAuth } = useApi();

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    refreshAuth,
  };
}

/**
 * Hook to access API clients only
 * Convenience hook for components that need to make API calls
 */
export function useApiClients() {
  const { http, api } = useApi();

  return {
    http,
    api,
  };
}
