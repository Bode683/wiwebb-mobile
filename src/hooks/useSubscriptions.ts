import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClients } from '@/context/ApiContext';
import type { Plan, Subscription, PaymentGateway, WiwebbPayment, CreatePaymentRequest } from '@/api/types';

/**
 * Hook to fetch all subscription plans
 */
export function usePlans() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: () => api.subscriptions.listPlans(http),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch single plan
 */
export function usePlan(id: number) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['subscriptions', 'plans', id],
    queryFn: () => api.subscriptions.getPlan(http, id),
    enabled: !!id,
  });
}

/**
 * Hook to get current user's subscription status
 */
export function useSubscriptionStatus() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['subscriptions', 'status'],
    queryFn: () => api.subscriptions.getSubscriptionStatus(http),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to subscribe to a plan
 */
export function useSubscribe() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, pricingId }: { planId: number; pricingId?: number }) =>
      api.subscriptions.subscribe(http, planId, pricingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: number) =>
      api.subscriptions.cancelSubscription(http, subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'status'] });
    },
  });
}

/**
 * Hook to fetch payment gateways
 */
export function usePaymentGateways() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['payments', 'gateways'],
    queryFn: () => api.payments.listGateways(http),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch payment history
 */
export function usePaymentHistory(filters?: { status?: string; variant?: string }) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['payments', 'history', filters],
    queryFn: () => api.payments.listPayments(http, filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to create payment
 */
export function useCreatePayment() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePaymentRequest) =>
      api.payments.createPayment(http, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'history'] });
    },
  });
}
