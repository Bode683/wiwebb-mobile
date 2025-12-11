import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { RadiusUser, RadiusGroup, RadiusSession, CreateRadiusUserRequest } from './types';
import { mockDataStore, isMockMode } from '../lib/mockDataStore';

/**
 * RADIUS Management API module
 * Handles RADIUS user, group, and session management
 */

export const radiusApi = {
  // ============================================================================
  // RADIUS Users
  // ============================================================================

  /**
   * List all RADIUS users
   * GET /radius/users/
   */
  async listUsers(http: AxiosInstance): Promise<RadiusUser[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.listRadiusUsers();
        return data.map(user => schemas.radiusUserSchema.parse(user));
      }

      const { data } = await http.get<RadiusUser[]>('/radius/users/');
      return data.map(user => schemas.radiusUserSchema.parse(user));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get single RADIUS user
   * GET /radius/users/:id/
   */
  async getUser(http: AxiosInstance, id: number): Promise<RadiusUser> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.getRadiusUser(id);
        if (!data) throw new Error('RADIUS user not found');
        return schemas.radiusUserSchema.parse(data);
      }

      const { data } = await http.get<RadiusUser>(`/radius/users/${id}/`);
      return schemas.radiusUserSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Create new RADIUS user
   * POST /radius/users/
   */
  async createUser(
    http: AxiosInstance,
    request: CreateRadiusUserRequest
  ): Promise<RadiusUser> {
    try {
      const validated = schemas.createRadiusUserSchema.parse(request);

      if (isMockMode()) {
        const data = await mockDataStore.createRadiusUser(validated);
        return schemas.radiusUserSchema.parse(data);
      }

      const { data } = await http.post<RadiusUser>('/radius/users/', validated);
      return schemas.radiusUserSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Update RADIUS user
   * PUT /radius/users/:id/
   */
  async updateUser(
    http: AxiosInstance,
    id: number,
    updates: Partial<CreateRadiusUserRequest>
  ): Promise<RadiusUser> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.updateRadiusUser(id, updates);
        if (!data) throw new Error('RADIUS user not found');
        return schemas.radiusUserSchema.parse(data);
      }

      const { data } = await http.put<RadiusUser>(`/radius/users/${id}/`, updates);
      return schemas.radiusUserSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Delete RADIUS user
   * DELETE /radius/users/:id/
   */
  async deleteUser(http: AxiosInstance, id: number): Promise<void> {
    try {
      if (isMockMode()) {
        const success = await mockDataStore.deleteRadiusUser(id);
        if (!success) throw new Error('RADIUS user not found');
        return;
      }

      await http.delete(`/radius/users/${id}/`);
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },

  // ============================================================================
  // RADIUS Groups
  // ============================================================================

  /**
   * List all RADIUS groups
   * GET /radius/groups/
   */
  async listGroups(http: AxiosInstance): Promise<RadiusGroup[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.listRadiusGroups();
        return data.map(group => schemas.radiusGroupSchema.parse(group));
      }

      const { data } = await http.get<RadiusGroup[]>('/radius/groups/');
      return data.map(group => schemas.radiusGroupSchema.parse(group));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  // ============================================================================
  // RADIUS Sessions & Accounting
  // ============================================================================

  /**
   * List active RADIUS sessions
   * GET /radius/active-sessions/
   */
  async listActiveSessions(http: AxiosInstance): Promise<RadiusSession[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.listActiveSessions();
        return data.map(session => schemas.radiusSessionSchema.parse(session));
      }

      const { data } = await http.get<RadiusSession[]>('/radius/active-sessions/');
      return data.map(session => schemas.radiusSessionSchema.parse(session));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get RADIUS accounting data
   * GET /radius/accounting/
   */
  async getAccounting(http: AxiosInstance, params?: any): Promise<RadiusSession[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.getAccounting();
        return data.map(session => schemas.radiusSessionSchema.parse(session));
      }

      const { data } = await http.get<RadiusSession[]>('/radius/accounting/', { params });
      return data.map(session => schemas.radiusSessionSchema.parse(session));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get post-auth logs
   * GET /radius/post-auth-log/
   */
  async getPostAuthLogs(http: AxiosInstance, params?: any): Promise<any[]> {
    try {
      if (isMockMode()) {
        return await mockDataStore.getPostAuthLog();
      }

      const { data } = await http.get('/radius/post-auth-log/', { params });
      return data;
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
