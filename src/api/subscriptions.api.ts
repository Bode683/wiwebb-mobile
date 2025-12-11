import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { Plan, Subscription } from './types';

/**
 * Subscription Management API module
 * Handles subscription plans and user subscriptions
 */

export const subscriptionsApi = {
  /**
   * List all available subscription plans
   * GET /subscriptions/plans/
   */
  async listPlans(http: AxiosInstance): Promise<Plan[]> {
    try {
      const { data} = await http.get<Plan[]>('/subscriptions/plans/');
      return data.map(plan => schemas.planSchema.parse(plan));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get single plan by ID
   * GET /subscriptions/plans/:id/
   */
  async getPlan(http: AxiosInstance, id: number): Promise<Plan> {
    try {
      const { data } = await http.get<Plan>(`/subscriptions/plans/${id}/`);
      return schemas.planSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Subscribe to a plan
   * POST /subscriptions/subscribe/
   */
  async subscribe(http: AxiosInstance, planId: number, pricingId?: number): Promise<Subscription> {
    try {
      const { data } = await http.post<Subscription>('/subscriptions/subscribe/', {
        plan_id: planId,
        pricing_id: pricingId,
      });
      return schemas.subscriptionSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Cancel subscription
   * POST /subscriptions/cancel/
   */
  async cancelSubscription(http: AxiosInstance, subscriptionId: number): Promise<void> {
    try {
      await http.post('/subscriptions/cancel/', {
        subscription_id: subscriptionId,
      });
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get current user's subscription status
   * GET /subscriptions/status/
   */
  async getSubscriptionStatus(http: AxiosInstance): Promise<Subscription | null> {
    try {
      const { data } = await http.get<Subscription>('/subscriptions/status/');
      return data ? schemas.subscriptionSchema.parse(data) : null;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get current user's usage limits
   * GET /subscriptions/me/limits/
   */
  async getUserLimits(http: AxiosInstance): Promise<any> {
    try {
      const { data } = await http.get('/subscriptions/me/limits/');
      return data;
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
