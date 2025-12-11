import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axiosRetry, { exponentialDelay, isNetworkError } from 'axios-retry';
import { authStorage } from './authStorage';
import { normalizeAxiosError } from '@/api/errors';

/**
 * Axios HTTP client with interceptors for auth and error handling
 *
 * Django Backend Integration:
 * - Uses Token-based authentication (DRF Token Auth)
 * - Token format: "Token <token>"
 * - Tokens stored in AsyncStorage
 * - CSRF tokens handled via Django middleware
 */

const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Include cookies for CSRF
});

/**
 * Request interceptor: Inject Django auth token
 * Token format: "Token <token>" (DRF standard)
 */
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from AsyncStorage
      const token = await authStorage.getAuthToken();

      if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        // Django REST Framework uses "Token" prefix
        config.headers.Authorization = `Token ${token}`;
      }

      return config;
    } catch (error) {
      // If token fetch fails, proceed without auth header
      // This allows public endpoints to work
      console.warn('Failed to fetch access token for request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(normalizeAxiosError(error));
  }
);

/**
 * Response interceptor: Normalize all errors to ApiError
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeAxiosError(error);
    
    // Log errors in development
    if (__DEV__) {
      console.error('HTTP Error:', {
        message: normalizedError.message,
        status: normalizedError.status,
        code: normalizedError.code,
        url: error.config?.url,
      });
    }
    
    return Promise.reject(normalizedError);
  }
);

/**
 * Configure retry logic for transient errors
 * - Retries network errors and 5xx server errors
 * - Uses exponential backoff
 * - Max 3 retries
 */
axiosRetry(httpClient, {
  retries: 3,
  retryDelay: exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors
    if (isNetworkError(error)) {
      return true;
    }
    
    // Retry on 5xx server errors
    if (error.response?.status && error.response.status >= 500) {
      return true;
    }
    
    // Don't retry on 4xx client errors
    return false;
  },
  onRetry: (retryCount, error, requestConfig) => {
    if (__DEV__) {
      console.log(
        `Retrying request (${retryCount}/3):`,
        requestConfig.url
      );
    }
  },
});

export default httpClient;
