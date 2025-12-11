import { useQuery } from '@tanstack/react-query';
import { useApiClients } from '@/context/ApiContext';
import type { DashboardStats } from '@/api/types';

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.tenants.getDashboardStats(http),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}
