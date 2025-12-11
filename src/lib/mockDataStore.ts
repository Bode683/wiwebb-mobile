/**
 * Mock Data Store - In-memory data store for development/testing
 *
 * This module provides an in-memory data store that simulates API operations
 * without requiring a backend server. All data is loaded from JSON files and
 * modifications persist only during the current session.
 */

import dashboardStatsData from '../json_data/dashboard_stats.json';
import hotspotsData from '../json_data/hotspots.json';
import radiusUsersData from '../json_data/radius_users.json';
import radiusActiveSessionsData from '../json_data/radius_active_sessions.json';
import radiusAccountingData from '../json_data/radius_accounting.json';
import radiusGroupsData from '../json_data/radius_groups.json';
import radiusPostAuthData from '../json_data/radius_post_auth.json';
import plansData from '../json_data/plans.json';
import subscriptionsData from '../json_data/subscriptions.json';
import paymentGatewaysData from '../json_data/payment_gateways.json';
import paymentsData from '../json_data/payments.json';
import tenantsData from '../json_data/tenants.json';
import usersData from '../json_data/users.json';
import hotspotStatsData from '../json_data/hotspot_stats.json';

// Type definitions for our mock data
type JSONData = any;

interface MockDataStore {
  dashboardStats: JSONData;
  hotspots: JSONData[];
  radiusUsers: JSONData[];
  radiusActiveSessions: JSONData[];
  radiusAccounting: JSONData[];
  radiusGroups: JSONData[];
  radiusPostAuth: JSONData[];
  plans: JSONData[];
  subscriptions: JSONData[];
  paymentGateways: JSONData[];
  payments: JSONData[];
  tenants: JSONData[];
  users: JSONData[];
  hotspotStats: Record<string, JSONData>;
}

// Initialize the in-memory data store
const store: MockDataStore = {
  dashboardStats: dashboardStatsData,
  hotspots: [...hotspotsData],
  radiusUsers: [...radiusUsersData],
  radiusActiveSessions: [...radiusActiveSessionsData],
  radiusAccounting: [...radiusAccountingData],
  radiusGroups: [...radiusGroupsData],
  radiusPostAuth: [...radiusPostAuthData],
  plans: [...plansData],
  subscriptions: [...subscriptionsData],
  paymentGateways: [...paymentGatewaysData],
  payments: [...paymentsData],
  tenants: [...tenantsData],
  users: [...usersData],
  hotspotStats: { ...hotspotStatsData },
};

/**
 * Simulates network delay (200-500ms) for realistic API behavior
 */
const simulateNetworkDelay = async (): Promise<void> => {
  const delay = Math.floor(Math.random() * 300) + 200; // 200-500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generates a new ID for a resource type
 */
const generateId = (collection: JSONData[]): number => {
  if (collection.length === 0) return 1;
  const maxId = Math.max(...collection.map(item => item.id || 0));
  return maxId + 1;
};

/**
 * Generic CRUD operations
 */
export const mockDataStore = {
  // ========== Dashboard ==========
  async getDashboardStats(): Promise<JSONData> {
    await simulateNetworkDelay();
    return store.dashboardStats;
  },

  // ========== Hotspots ==========
  async listHotspots(tenantId?: number): Promise<JSONData[]> {
    await simulateNetworkDelay();
    if (tenantId) {
      return store.hotspots.filter(h => h.tenant_id === tenantId);
    }
    return [...store.hotspots];
  },

  async getHotspot(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.hotspots.find(h => h.id === id) || null;
  },

  async createHotspot(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newHotspot = {
      ...data,
      id: generateId(store.hotspots),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.hotspots.push(newHotspot);
    return newHotspot;
  },

  async updateHotspot(id: number, data: Partial<JSONData>): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.hotspots.findIndex(h => h.id === id);
    if (index === -1) return null;

    store.hotspots[index] = {
      ...store.hotspots[index],
      ...data,
      id, // Preserve ID
      updated_at: new Date().toISOString(),
    };
    return store.hotspots[index];
  },

  async deleteHotspot(id: number): Promise<boolean> {
    await simulateNetworkDelay();
    const index = store.hotspots.findIndex(h => h.id === id);
    if (index === -1) return false;

    store.hotspots.splice(index, 1);
    return true;
  },

  async getHotspotStats(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.hotspotStats[id.toString()] || null;
  },

  // ========== RADIUS Users ==========
  async listRadiusUsers(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.radiusUsers];
  },

  async getRadiusUser(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.radiusUsers.find(u => u.id === id) || null;
  },

  async createRadiusUser(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newUser = {
      ...data,
      id: generateId(store.radiusUsers),
      created_at: new Date().toISOString(),
    };
    store.radiusUsers.push(newUser);
    return newUser;
  },

  async updateRadiusUser(id: number, data: Partial<JSONData>): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.radiusUsers.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.radiusUsers[index] = {
      ...store.radiusUsers[index],
      ...data,
      id,
    };
    return store.radiusUsers[index];
  },

  async deleteRadiusUser(id: number): Promise<boolean> {
    await simulateNetworkDelay();
    const index = store.radiusUsers.findIndex(u => u.id === id);
    if (index === -1) return false;

    store.radiusUsers.splice(index, 1);
    return true;
  },

  // ========== RADIUS Groups ==========
  async listRadiusGroups(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.radiusGroups];
  },

  // ========== RADIUS Active Sessions ==========
  async listActiveSessions(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.radiusActiveSessions];
  },

  // ========== RADIUS Accounting ==========
  async getAccounting(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.radiusAccounting];
  },

  // ========== RADIUS Post-Auth Logs ==========
  async getPostAuthLog(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.radiusPostAuth];
  },

  // ========== Plans ==========
  async listPlans(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.plans];
  },

  async getPlan(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.plans.find(p => p.id === id) || null;
  },

  // ========== Subscriptions ==========
  async subscribe(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newSubscription = {
      ...data,
      id: generateId(store.subscriptions),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.subscriptions.push(newSubscription);
    return newSubscription;
  },

  async cancelSubscription(subscriptionId: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) return null;

    store.subscriptions[index] = {
      ...store.subscriptions[index],
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    };
    return store.subscriptions[index];
  },

  async getSubscriptionStatus(userId: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.subscriptions.find(s => s.user === userId && s.status === 'active') || null;
  },

  async getUserLimits(userId: number): Promise<JSONData> {
    await simulateNetworkDelay();
    const subscription = await this.getSubscriptionStatus(userId);
    if (!subscription) {
      // Return default free plan limits
      return {
        daily_time_minutes: 60,
        daily_data_mb: 500,
      };
    }

    const plan = await this.getPlan(subscription.plan);
    return {
      daily_time_minutes: plan?.daily_time_minutes || null,
      daily_data_mb: plan?.daily_data_mb || null,
    };
  },

  // ========== Payment Gateways ==========
  async listPaymentGateways(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.paymentGateways];
  },

  // ========== Payments ==========
  async listPayments(filters?: { status?: string; variant?: string }): Promise<JSONData[]> {
    await simulateNetworkDelay();
    let results = [...store.payments];

    if (filters?.status) {
      results = results.filter(p => p.status === filters.status);
    }
    if (filters?.variant) {
      results = results.filter(p => p.variant === filters.variant);
    }

    return results;
  },

  async getPayment(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.payments.find(p => p.id === id) || null;
  },

  async createPayment(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newPayment = {
      ...data,
      id: generateId(store.payments),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    store.payments.push(newPayment);
    return newPayment;
  },

  async capturePayment(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.payments.findIndex(p => p.id === id);
    if (index === -1) return null;

    store.payments[index] = {
      ...store.payments[index],
      status: 'completed',
      modified: new Date().toISOString(),
    };
    return store.payments[index];
  },

  async refundPayment(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.payments.findIndex(p => p.id === id);
    if (index === -1) return null;

    store.payments[index] = {
      ...store.payments[index],
      status: 'refunded',
      modified: new Date().toISOString(),
    };
    return store.payments[index];
  },

  async getPaymentLogs(id: number): Promise<JSONData[]> {
    await simulateNetworkDelay();
    // Mock payment logs
    return [
      {
        id: 1,
        payment_id: id,
        action: 'created',
        timestamp: new Date().toISOString(),
        message: 'Payment created',
      },
    ];
  },

  // ========== Tenants ==========
  async listTenants(): Promise<JSONData[]> {
    await simulateNetworkDelay();
    return [...store.tenants];
  },

  async getTenant(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.tenants.find(t => t.id === id) || null;
  },

  async getCurrentTenant(): Promise<JSONData | null> {
    await simulateNetworkDelay();
    // Return the first active tenant (mock current user's tenant)
    return store.tenants.find(t => t.is_active) || store.tenants[0] || null;
  },

  async createTenant(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newTenant = {
      ...data,
      id: generateId(store.tenants),
      uuid: `${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.tenants.push(newTenant);
    return newTenant;
  },

  async updateTenant(id: number, data: Partial<JSONData>): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.tenants.findIndex(t => t.id === id);
    if (index === -1) return null;

    store.tenants[index] = {
      ...store.tenants[index],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    };
    return store.tenants[index];
  },

  async deleteTenant(id: number): Promise<boolean> {
    await simulateNetworkDelay();
    const index = store.tenants.findIndex(t => t.id === id);
    if (index === -1) return false;

    store.tenants.splice(index, 1);
    return true;
  },

  // ========== Users ==========
  async listUsers(page: number = 1, pageSize: number = 20): Promise<{ results: JSONData[]; count: number }> {
    await simulateNetworkDelay();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      results: store.users.slice(start, end),
      count: store.users.length,
    };
  },

  async getUser(id: number): Promise<JSONData | null> {
    await simulateNetworkDelay();
    return store.users.find(u => u.id === id) || null;
  },

  async createUser(data: JSONData): Promise<JSONData> {
    await simulateNetworkDelay();
    const newUser = {
      ...data,
      id: generateId(store.users),
      pk: generateId(store.users),
      date_joined: new Date().toISOString(),
      password_updated: new Date().toISOString(),
    };
    store.users.push(newUser);
    return newUser;
  },

  async updateUser(id: number, data: Partial<JSONData>): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      ...data,
      id,
    };
    return store.users[index];
  },

  async activateUser(id: number, isActive: boolean): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      is_active: isActive,
    };
    return store.users[index];
  },

  async assignRole(id: number, role: string): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      role,
    };
    return store.users[index];
  },

  async setPassword(id: number, password: string): Promise<JSONData | null> {
    await simulateNetworkDelay();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      password_updated: new Date().toISOString(),
    };
    return store.users[index];
  },

  async deleteUser(id: number): Promise<boolean> {
    await simulateNetworkDelay();
    const index = store.users.findIndex(u => u.id === id);
    if (index === -1) return false;

    store.users.splice(index, 1);
    return true;
  },
};

/**
 * Helper to check if mock mode is enabled
 */
export const isMockMode = (): boolean => {
  return process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';
};
