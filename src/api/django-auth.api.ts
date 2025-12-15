import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { SignInRequest, SignUpRequest, User, AuthResponse, LoginResponse, UpdateUserRequest } from './types';
import { authStorage } from '@/lib/authStorage';

/**
 * Django Authentication API module
 * Handles token-based authentication with Django REST Framework
 */

export const djangoAuthApi = {
  /**
   * Sign in with email and password
   * POST /auth/login/ - Returns {key: "token"}
   * Then GET /auth/user/ - Returns user object
   */
  async signIn(
    http: AxiosInstance,
    request: SignInRequest
  ): Promise<AuthResponse> {
    try {
      // Validate input
      const validated = schemas.signInSchema.parse(request);

      // Step 1: Login to get auth token
      // Django login can accept username or email depending on backend configuration
      // If username is provided, use it; otherwise try to use email as username
      const loginPayload: any = {
        password: validated.password,
      };

      if (validated.username) {
        // Username provided directly
        loginPayload.username = validated.username;
      } else if (validated.email) {
        // Email provided - try using it as username
        // Some Django configs allow email as username
        loginPayload.username = validated.email;
      }

      const { data: loginData } = await http.post<LoginResponse>('/auth/login/', loginPayload);

      // Validate login response
      const validatedLogin = schemas.loginResponseSchema.parse(loginData);
      const token = validatedLogin.key;

      // Store token immediately so next request is authenticated
      await authStorage.saveAuthToken(token);

      // Step 2: Fetch user data with the token
      // Create a new http instance with the token for this request
      const { data: userData } = await http.get<User>('/auth/user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Debug: Log the raw user data in development
      if (__DEV__) {
        console.log('Raw user data from backend:', JSON.stringify(userData, null, 2));
      }

      // Validate user response
      const validatedUser = schemas.userSchema.parse(userData);

      // Store user data
      await authStorage.saveUserData(validatedUser);

      // Return combined response
      return {
        token,
        user: validatedUser,
      };
    } catch (error: any) {
      // Clear auth data on error
      await authStorage.clearAll();

      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Sign up with email and password
   * POST /auth/registration/ - Returns {key: "token"}
   * Then GET /auth/user/ - Returns user object
   */
  async signUp(
    http: AxiosInstance,
    request: SignUpRequest
  ): Promise<AuthResponse> {
    try {
      // Validate input
      const validated = schemas.signUpSchema.parse(request);

      // Step 1: Register to get auth token
      const registrationData: any = {
        username: validated.username,
        email: validated.email,
        password1: validated.password,
        password2: validated.password,
        first_name: validated.first_name,
        last_name: validated.last_name,
      };

      // Add phone if provided
      if (validated.phone) {
        registrationData.phone = validated.phone;
      }

      const { data: loginData } = await http.post<LoginResponse>('/auth/registration/', registrationData);

      // Validate login response
      const validatedLogin = schemas.loginResponseSchema.parse(loginData);
      const token = validatedLogin.key;

      // Store token immediately so next request is authenticated
      await authStorage.saveAuthToken(token);

      // Step 2: Fetch user data with the token
      const { data: userData } = await http.get<User>('/auth/user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Debug: Log the raw user data in development
      if (__DEV__) {
        console.log('Raw user data from backend (signup):', JSON.stringify(userData, null, 2));
      }

      // Validate user response
      const validatedUser = schemas.userSchema.parse(userData);

      // Store user data
      await authStorage.saveUserData(validatedUser);

      // Return combined response
      return {
        token,
        user: validatedUser,
      };
    } catch (error: any) {
      // Clear auth data on error
      await authStorage.clearAll();

      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Sign out current user
   * POST /auth/logout/
   */
  async signOut(http: AxiosInstance): Promise<void> {
    try {
      // Call Django logout endpoint
      await http.post('/auth/logout/');
    } catch (error: any) {
      // Log error but don't throw - always clear local storage
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      await authStorage.clearAll();
    }
  },

  /**
   * Get current user
   * GET /auth/user/
   */
  async getCurrentUser(http: AxiosInstance): Promise<User> {
    try {
      const { data } = await http.get<User>('/auth/user/');

      // Validate response
      const validatedUser = schemas.userSchema.parse(data);

      // Update stored user data
      await authStorage.saveUserData(validatedUser);

      return validatedUser;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Update current user profile
   * PATCH /auth/user/
   * Supports both JSON data and FormData (for avatar uploads)
   */
  async updateUser(
    http: AxiosInstance,
    updates: UpdateUserRequest
  ): Promise<User> {
    try {
      // If avatar is present, use FormData, otherwise use JSON
      const hasAvatar = updates.avatar !== undefined;

      let requestData: any;
      let headers: any = {};

      if (hasAvatar) {
        // Use FormData for file upload
        const formData = new FormData();
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        requestData = formData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // Use JSON for regular updates
        requestData = updates;
      }

      const { data } = await http.patch<User>('/auth/user/', requestData, {
        headers,
      });

      // Validate response
      const validatedUser = schemas.userSchema.parse(data);

      // Update stored user data
      await authStorage.saveUserData(validatedUser);

      return validatedUser;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Reset password (send reset email)
   * POST /auth/password/reset/
   */
  async resetPassword(
    http: AxiosInstance,
    email: string
  ): Promise<void> {
    try {
      // Validate email
      const validated = schemas.signInSchema.pick({ email: true }).parse({ email });

      await http.post('/auth/password/reset/', {
        email: validated.email,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Change password
   * POST /auth/password/change/
   */
  async changePassword(
    http: AxiosInstance,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Validate passwords
      const validated = schemas.signInSchema.parse({
        email: 'dummy@example.com', // Email not used, just for validation
        password: newPassword
      });

      await http.post('/auth/password/change/', {
        old_password: oldPassword,
        new_password: validated.password,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },
};
