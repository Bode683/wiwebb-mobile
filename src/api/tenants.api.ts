import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { Tenant, DashboardStats } from './types';

/**
 * Tenant Management API module
 * Handles tenant operations and dashboard data
 */

export const tenantsApi = {
  /**
   * List all tenants (admin only)
   * GET /tenants/
   */
  async listTenants(http: AxiosInstance): Promise<Tenant[]> {
    try {
      const { data } = await http.get<Tenant[]>('/tenants/');
      return data.map(tenant => schemas.tenantSchema.parse(tenant));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get single tenant by ID
   * GET /tenants/:id/
   */
  async getTenant(http: AxiosInstance, id: number): Promise<Tenant> {
    try {
      const { data } = await http.get<Tenant>(`/tenants/${id}/`);
      return schemas.tenantSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get current user's tenant
   * GET /tenants/me/
   */
  async getMyTenant(http: AxiosInstance): Promise<Tenant> {
    try {
      const { data } = await http.get<Tenant>('/tenants/me/');
      return schemas.tenantSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Create new tenant (admin only)
   * POST /tenants/
   */
  async createTenant(
    http: AxiosInstance,
    request: { name: string; description?: string; email?: string }
  ): Promise<Tenant> {
    try {
      const { data } = await http.post<Tenant>('/tenants/', request);
      return schemas.tenantSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Update tenant
   * PUT /tenants/:id/
   */
  async updateTenant(
    http: AxiosInstance,
    id: number,
    updates: Partial<{ name: string; description?: string; email?: string }>
  ): Promise<Tenant> {
    try {
      const { data } = await http.put<Tenant>(`/tenants/${id}/`, updates);
      return schemas.tenantSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Delete tenant (admin only)
   * DELETE /tenants/:id/
   */
  async deleteTenant(http: AxiosInstance, id: number): Promise<void> {
    try {
      await http.delete(`/tenants/${id}/`);
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get dashboard statistics
   * GET /dashboard/stats/
   */
  async getDashboardStats(http: AxiosInstance): Promise<DashboardStats> {
    try {
      const { data } = await http.get<DashboardStats>('/dashboard/stats/');
      return schemas.dashboardStatsSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },
};
