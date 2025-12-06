import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { Hotspot, CreateHotspotRequest } from './types';

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
      const { data } = await http.get(`/hotspots/${id}/stats/`);
      return data;
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
