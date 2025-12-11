import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClients } from '../context/ApiContext';
import type { Tenant } from '../api/types';

/**
 * Hook for fetching the current user's tenant
 */
export function useMyTenant() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['tenants', 'me'],
    queryFn: () => api.tenants.getMyTenant(http),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching a specific tenant by ID
 */
export function useTenant(tenantId: number) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['tenants', tenantId],
    queryFn: () => api.tenants.getTenant(http, tenantId),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching all tenants (admin only)
 */
export function useTenants() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['tenants', 'list'],
    queryFn: () => api.tenants.listTenants(http),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for creating a new tenant (admin only)
 */
export function useCreateTenant() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; email?: string }) =>
      api.tenants.createTenant(http, data),
    onSuccess: () => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

/**
 * Hook for updating a tenant
 */
export function useUpdateTenant() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<{ name: string; description?: string; email?: string }>;
    }) => api.tenants.updateTenant(http, id, updates),
    onSuccess: (data) => {
      // Invalidate specific tenant and list
      queryClient.invalidateQueries({ queryKey: ['tenants', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tenants', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['tenants', 'me'] });
    },
  });
}

/**
 * Hook for deleting a tenant (admin only)
 */
export function useDeleteTenant() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.tenants.deleteTenant(http, id),
    onSuccess: () => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
