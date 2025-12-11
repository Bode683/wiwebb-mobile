import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ActivateUserRequest,
  AssignRoleRequest,
  SetPasswordRequest,
  PaginatedResponse,
  ListOptions,
} from './types';

/**
 * Django User Management API module
 * Admin-only endpoints for managing users
 */

export const usersApi = {
  /**
   * List all users
   * GET /users/
   * Admin only - supports pagination and filtering
   */
  async listUsers(
    http: AxiosInstance,
    options?: ListOptions
  ): Promise<PaginatedResponse<User>> {
    try {
      const params: any = {};

      if (options?.page) params.page = options.page;
      if (options?.pageSize) params.page_size = options.pageSize;
      if (options?.sortBy) params.ordering = options.sortOrder === 'desc' ? `-${options.sortBy}` : options.sortBy;

      const { data } = await http.get('/users/', { params });

      // Django REST Framework pagination format
      // Expected: { count, next, previous, results }
      const users = Array.isArray(data.results)
        ? data.results.map((user: any) => schemas.userSchema.parse(user))
        : [];

      return {
        data: users,
        total: data.count || 0,
        page: options?.page || 1,
        pageSize: options?.pageSize || users.length,
        hasMore: !!data.next,
      };
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Create a new user
   * POST /users/
   * Admin only
   */
  async createUser(
    http: AxiosInstance,
    userData: CreateUserRequest
  ): Promise<User> {
    try {
      // Validate input
      const validated = schemas.createUserSchema.parse(userData);

      const { data } = await http.post<User>('/users/', validated);

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
   * Get user details by ID
   * GET /users/{id}/
   * Admin only
   */
  async getUserById(
    http: AxiosInstance,
    userId: number
  ): Promise<User> {
    try {
      const { data } = await http.get<User>(`/users/${userId}/`);

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
   * Update user details
   * PATCH /users/{id}/
   * Admin only
   */
  async updateUser(
    http: AxiosInstance,
    userId: number,
    updates: UpdateUserRequest
  ): Promise<User> {
    try {
      // Validate input (partial validation)
      const validated = schemas.updateUserSchema.parse(updates);

      const { data } = await http.patch<User>(`/users/${userId}/`, validated);

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
   * Activate or deactivate a user
   * POST /users/{id}/activate/
   * Admin only
   */
  async activateUser(
    http: AxiosInstance,
    userId: number,
    activate: boolean
  ): Promise<User> {
    try {
      // Validate input
      const validated = schemas.activateUserSchema.parse({ is_active: activate });

      const { data } = await http.post<User>(`/users/${userId}/activate/`, validated);

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
   * Assign role to a user
   * POST /users/{id}/assign-role/
   * Admin only
   */
  async assignRole(
    http: AxiosInstance,
    userId: number,
    roleData: AssignRoleRequest
  ): Promise<User> {
    try {
      // Validate input
      const validated = schemas.assignRoleSchema.parse(roleData);

      const { data } = await http.post<User>(`/users/${userId}/assign-role/`, validated);

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
   * Set password for a user
   * POST /users/{id}/set-password/
   * Admin only
   */
  async setPassword(
    http: AxiosInstance,
    userId: number,
    password: string
  ): Promise<void> {
    try {
      // Validate input
      const validated = schemas.setPasswordSchema.parse({ password });

      await http.post(`/users/${userId}/set-password/`, validated);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Delete a user
   * DELETE /users/{id}/
   * Admin only
   */
  async deleteUser(
    http: AxiosInstance,
    userId: number
  ): Promise<void> {
    try {
      await http.delete(`/users/${userId}/`);
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
