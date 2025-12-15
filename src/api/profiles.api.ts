import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { User, UpdateUserRequest } from './types';

/**
 * Profile API module
 * Handles user profile operations (update profile, avatar management)
 *
 * Note: Profile data comes from the User model in Django.
 * There's no separate profile endpoint - we use the users endpoint.
 */

export const profilesApi = {
  /**
   * Update current user's profile
   * PATCH /auth/user/
   * Updates the authenticated user's profile information
   */
  async updateProfile(
    http: AxiosInstance,
    updates: UpdateUserRequest
  ): Promise<User> {
    try {
      // Validate input
      const validated = schemas.updateUserSchema.parse(updates);

      const { data } = await http.patch<User>('/auth/user/', validated);

      // Validate response
      return schemas.userSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Upload avatar for current user
   * PATCH /auth/user/
   * Uploads avatar image using FormData
   */
  async uploadAvatar(
    http: AxiosInstance,
    file: File | Blob,
    options?: { fileName?: string; contentType?: string }
  ): Promise<User> {
    try {
      const formData = new FormData();

      // Append the file with proper naming
      if (file instanceof File) {
        formData.append('avatar', file);
      } else {
        // For Blob, we need to specify filename
        const fileName = options?.fileName || 'avatar.jpg';
        const contentType = options?.contentType || 'image/jpeg';
        formData.append('avatar', file, fileName);
      }

      const { data } = await http.patch<User>('/auth/user/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Validate response
      return schemas.userSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Delete avatar for current user
   * PATCH /auth/user/
   * Sets avatar to null
   */
  async deleteAvatar(http: AxiosInstance): Promise<User> {
    try {
      const { data } = await http.patch<User>('/auth/user/', {
        avatar: null,
      });

      // Validate response
      return schemas.userSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },
};
