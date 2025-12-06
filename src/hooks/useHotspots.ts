import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClients } from '@/context/ApiContext';
import type { Hotspot, CreateHotspotRequest } from '@/api/types';

/**
 * Hook to fetch all hotspots
 */
export function useHotspots(tenantId?: number) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['hotspots', tenantId],
    queryFn: () => api.hotspots.listHotspots(http, tenantId),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch single hotspot
 */
export function useHotspot(id: number) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['hotspots', id],
    queryFn: () => api.hotspots.getHotspot(http, id),
    enabled: !!id,
  });
}

/**
 * Hook to create hotspot
 */
export function useCreateHotspot() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateHotspotRequest) =>
      api.hotspots.createHotspot(http, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotspots'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to update hotspot
 */
export function useUpdateHotspot() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<CreateHotspotRequest> }) =>
      api.hotspots.updateHotspot(http, id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotspots'] });
      queryClient.invalidateQueries({ queryKey: ['hotspots', variables.id] });
    },
  });
}

/**
 * Hook to delete hotspot
 */
export function useDeleteHotspot() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.hotspots.deleteHotspot(http, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotspots'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
