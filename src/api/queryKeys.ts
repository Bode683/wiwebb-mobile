/**
 * Query key factory for TanStack Query
 * Provides hierarchical, type-safe query keys for cache management
 * 
 * Pattern:
 * - Use arrays for keys: ['resource', 'action', ...params]
 * - Hierarchical structure allows partial invalidation
 * - Example: invalidating ['trips'] invalidates all trip queries
 */

export const queryKeys = {
  // ============================================================================
  // Auth Keys
  // ============================================================================
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // ============================================================================
  // Profile Keys
  // ============================================================================
  profiles: {
    all: ['profiles'] as const,
    detail: (userId: string) => [...queryKeys.profiles.all, userId] as const,
    current: () => [...queryKeys.profiles.all, 'current'] as const,
  },

  // ============================================================================
  // Payment Keys
  // ============================================================================
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.payments.lists(), userId] as const,
    detail: (paymentId: string) => 
      [...queryKeys.payments.all, paymentId] as const,
    methods: (userId: string) => 
      [...queryKeys.payments.all, 'methods', userId] as const,
  },

  // ============================================================================
  // Notification Keys
  // ============================================================================
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (userId: string, filters?: { unreadOnly?: boolean }) =>
      [...queryKeys.notifications.lists(), userId, filters] as const,
    unreadCount: (userId: string) =>
      [...queryKeys.notifications.all, 'unread-count', userId] as const,
  },

  // ============================================================================
  // User Management Keys (Admin)
  // ============================================================================
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.users.lists(), filters] as const,
    detail: (userId: number) => [...queryKeys.users.all, userId] as const,
  },

  // ============================================================================
  // Tenant Keys
  // ============================================================================
  tenants: {
    all: ['tenants'] as const,
    lists: () => [...queryKeys.tenants.all, 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.tenants.lists(), filters] as const,
    detail: (tenantId: number) => [...queryKeys.tenants.all, tenantId] as const,
    current: () => [...queryKeys.tenants.all, 'me'] as const,
    stats: () => [...queryKeys.tenants.all, 'stats'] as const,
  },

  // ============================================================================
  // Hotspot Keys
  // ============================================================================
  hotspots: {
    all: ['hotspots'] as const,
    lists: () => [...queryKeys.hotspots.all, 'list'] as const,
    list: (tenantId?: number) =>
      [...queryKeys.hotspots.lists(), tenantId] as const,
    detail: (hotspotId: number) =>
      [...queryKeys.hotspots.all, hotspotId] as const,
  },

  // ============================================================================
  // RADIUS Keys
  // ============================================================================
  radius: {
    all: ['radius'] as const,
    users: {
      all: () => [...queryKeys.radius.all, 'users'] as const,
      lists: () => [...queryKeys.radius.users.all(), 'list'] as const,
      list: (filters?: Record<string, any>) =>
        [...queryKeys.radius.users.lists(), filters] as const,
      detail: (userId: number) =>
        [...queryKeys.radius.users.all(), userId] as const,
    },
    groups: {
      all: () => [...queryKeys.radius.all, 'groups'] as const,
      lists: () => [...queryKeys.radius.groups.all(), 'list'] as const,
      list: () => [...queryKeys.radius.groups.lists()] as const,
    },
    sessions: {
      all: () => [...queryKeys.radius.all, 'sessions'] as const,
      lists: () => [...queryKeys.radius.sessions.all(), 'list'] as const,
      list: (filters?: Record<string, any>) =>
        [...queryKeys.radius.sessions.lists(), filters] as const,
      active: () => [...queryKeys.radius.sessions.all(), 'active'] as const,
    },
  },

  // ============================================================================
  // Subscription Keys
  // ============================================================================
  subscriptions: {
    all: ['subscriptions'] as const,
    lists: () => [...queryKeys.subscriptions.all, 'list'] as const,
    list: (userId?: number) =>
      [...queryKeys.subscriptions.lists(), userId] as const,
    detail: (subscriptionId: number) =>
      [...queryKeys.subscriptions.all, subscriptionId] as const,
    plans: {
      all: () => [...queryKeys.subscriptions.all, 'plans'] as const,
      lists: () => [...queryKeys.subscriptions.plans.all(), 'list'] as const,
      list: () => [...queryKeys.subscriptions.plans.lists()] as const,
      detail: (planId: number) =>
        [...queryKeys.subscriptions.plans.all(), planId] as const,
    },
    current: () => [...queryKeys.subscriptions.all, 'current'] as const,
  },

  // ============================================================================
  // Payment Gateway Keys
  // ============================================================================
  paymentGateways: {
    all: ['payment-gateways'] as const,
    lists: () => [...queryKeys.paymentGateways.all, 'list'] as const,
    list: () => [...queryKeys.paymentGateways.lists()] as const,
  },

  // ============================================================================
  // Dashboard Keys
  // ============================================================================
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
} as const;

/**
 * Helper to invalidate all queries for a specific user
 * Useful on logout or user switch
 */
export function getUserQueryKeys(userId: string) {
  return [
    queryKeys.profiles.detail(userId),
    queryKeys.payments.list(userId),
    queryKeys.notifications.list(userId),
  ];
}

/**
 * Helper to invalidate all tenant-related queries
 * Useful when switching tenants or on tenant updates
 */
export function getTenantQueryKeys(tenantId?: number) {
  return [
    queryKeys.tenants.detail(tenantId!),
    queryKeys.hotspots.list(tenantId),
    queryKeys.users.all,
  ];
}
