import { AxiosInstance } from 'axios';
import { normalizeAxiosError, normalizeZodError } from './errors';
import * as schemas from './schemas';
import type { PaymentGateway, WiwebbPayment, CreatePaymentRequest } from './types';
import { mockDataStore, isMockMode } from '../lib/mockDataStore';

/**
 * Payment Management API module
 * Handles payment processing with multiple gateways
 */

export const paymentsApi = {
  /**
   * List available payment gateways
   * GET /gateways/
   */
  async listGateways(http: AxiosInstance): Promise<PaymentGateway[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.listPaymentGateways();
        return data.map(gateway => schemas.paymentGatewaySchema.parse(gateway));
      }

      const { data } = await http.get<PaymentGateway[]>('/gateways/');
      return data.map(gateway => schemas.paymentGatewaySchema.parse(gateway));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * List all payments for current user
   * GET /payments/
   */
  async listPayments(http: AxiosInstance, filters?: {
    status?: string;
    variant?: string;
  }): Promise<WiwebbPayment[]> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.listPayments(filters);
        return data.map(payment => schemas.wiwebbPaymentSchema.parse(payment));
      }

      const { data } = await http.get<WiwebbPayment[]>('/payments/', {
        params: filters,
      });
      return data.map(payment => schemas.wiwebbPaymentSchema.parse(payment));
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get single payment by ID
   * GET /payments/:id/
   */
  async getPayment(http: AxiosInstance, id: number): Promise<WiwebbPayment> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.getPayment(id);
        if (!data) throw new Error('Payment not found');
        return schemas.wiwebbPaymentSchema.parse(data);
      }

      const { data } = await http.get<WiwebbPayment>(`/payments/${id}/`);
      return schemas.wiwebbPaymentSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Create new payment
   * POST /payments/create_payment/
   */
  async createPayment(
    http: AxiosInstance,
    request: CreatePaymentRequest
  ): Promise<{ payment: WiwebbPayment; redirect_url?: string }> {
    try {
      const validated = schemas.createPaymentSchema.parse(request);

      if (isMockMode()) {
        const payment = await mockDataStore.createPayment({
          user: 1, // Mock user ID
          status: 'pending',
          ...validated,
        });
        return {
          payment: schemas.wiwebbPaymentSchema.parse(payment),
          redirect_url: 'https://mock-payment-gateway.com/checkout/mock123',
        };
      }

      const { data } = await http.post('/payments/create_payment/', validated);
      return data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Capture payment (for authorized payments)
   * POST /payments/:id/capture_payment/
   */
  async capturePayment(http: AxiosInstance, id: number): Promise<WiwebbPayment> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.capturePayment(id);
        if (!data) throw new Error('Payment not found');
        return schemas.wiwebbPaymentSchema.parse(data);
      }

      const { data } = await http.post<WiwebbPayment>(`/payments/${id}/capture_payment/`);
      return schemas.wiwebbPaymentSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Refund payment
   * POST /payments/:id/refund_payment/
   */
  async refundPayment(http: AxiosInstance, id: number, amount?: number): Promise<WiwebbPayment> {
    try {
      if (isMockMode()) {
        const data = await mockDataStore.refundPayment(id);
        if (!data) throw new Error('Payment not found');
        return schemas.wiwebbPaymentSchema.parse(data);
      }

      const { data } = await http.post<WiwebbPayment>(`/payments/${id}/refund_payment/`, {
        amount,
      });
      return schemas.wiwebbPaymentSchema.parse(data);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw normalizeZodError(error);
      }
      throw normalizeAxiosError(error);
    }
  },

  /**
   * Get payment logs
   * GET /payments/:id/logs/
   */
  async getPaymentLogs(http: AxiosInstance, id: number): Promise<any[]> {
    try {
      if (isMockMode()) {
        return await mockDataStore.getPaymentLogs(id);
      }

      const { data } = await http.get(`/payments/${id}/logs/`);
      return data;
    } catch (error: any) {
      throw normalizeAxiosError(error);
    }
  },
};
