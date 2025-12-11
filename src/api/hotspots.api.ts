import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { Hotspot, CreateHotspotRequest } from './types';
import { mockDataStore, isMockMode } from '../lib/mockDataStore';

/**
 * Hotspot Management API module
 * Handles WiFi hotspot CRUD operations
 */

export const hotspotsApi = {
  /**
   * List all hotspots (filtered by tenant for non-admins)
   * GET /hotspots/
   */
  async listHotspots(http: AxiosInstance, tenantId?: number): Promise<Hotspot[]> {
    try {
      // Use mock data if enabled
      if (isMockMode()) {
        const data = await mockDataStore.listHotspots(tenantId);
        return data.map(hotspot => schemas.hotspotSchema.parse(hotspot));
      }

      const params = tenantId ? { tenant_id: tenantId } : {};
      const { data } = await http.get<Hotspot[]>('/hotspots/', { params });

      // Validate response
      return data.map(hotspot => schemas.hotspotSchema.parse(hotspot));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get single hotspot by ID
   * GET /hotspots/:id/
   */
  async getHotspot(http: AxiosInstance, id: number): Promise<Hotspot> {
    try {
      // Use mock data if enabled
      if (isMockMode()) {
        const data = await mockDataStore.getHotspot(id);
        if (!data) {
          throw new Error('Hotspot not found');
        }
        return schemas.hotspotSchema.parse(data);
      }

      const { data } = await http.get<Hotspot>(`/hotspots/${id}/`);

      // Validate response
      return schemas.hotspotSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Create new hotspot
   * POST /hotspots/
   */
  async createHotspot(
    http: AxiosInstance,
    request: CreateHotspotRequest
  ): Promise<Hotspot> {
    try {
      // Validate input
      const validated = schemas.createHotspotSchema.parse(request);

      // Use mock data if enabled
      if (isMockMode()) {
        const data = await mockDataStore.createHotspot(validated);
        return schemas.hotspotSchema.parse(data);
      }

      const { data } = await http.post<Hotspot>('/hotspots/', validated);

      // Validate response
      return schemas.hotspotSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Update hotspot
   * PUT /hotspots/:id/
   */
  async updateHotspot(
    http: AxiosInstance,
    id: number,
    updates: Partial<CreateHotspotRequest>
  ): Promise<Hotspot> {
    try {
      // Use mock data if enabled
      if (isMockMode()) {
        const data = await mockDataStore.updateHotspot(id, updates);
        if (!data) {
          throw new Error('Hotspot not found');
        }
        return schemas.hotspotSchema.parse(data);
      }

      const { data } = await http.put<Hotspot>(`/hotspots/${id}/`, updates);

      // Validate response
      return schemas.hotspotSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Delete hotspot
   * DELETE /hotspots/:id/
   */
  async deleteHotspot(http: AxiosInstance, id: number): Promise<void> {
    try {
      // Use mock data if enabled
      if (isMockMode()) {
        const success = await mockDataStore.deleteHotspot(id);
        if (!success) {
          throw new Error('Hotspot not found');
        }
        return;
      }

      await http.delete(`/hotspots/${id}/`);
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get hotspot statistics
   * GET /hotspots/:id/stats/
   */
  async getHotspotStats(http: AxiosInstance, id: number): Promise<any> {
    try {
      // Use mock data if enabled
      if (isMockMode()) {
        const data = await mockDataStore.getHotspotStats(id);
        if (!data) {
          throw new Error('Hotspot stats not found');
        }
        return data;
      }

      const { data } = await http.get(`/hotspots/${id}/stats/`);
      return data;
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
