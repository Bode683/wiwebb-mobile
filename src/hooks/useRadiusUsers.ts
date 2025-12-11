import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClients } from '@/context/ApiContext';
import type { RadiusUser, RadiusSession, CreateRadiusUserRequest } from '@/api/types';

/**
 * Hook to fetch all RADIUS users
 */
export function useRadiusUsers() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['radius', 'users'],
    queryFn: () => api.radius.listUsers(http),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch single RADIUS user
 */
export function useRadiusUser(id: number) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['radius', 'users', id],
    queryFn: () => api.radius.getUser(http, id),
    enabled: !!id,
  });
}

/**
 * Hook to create RADIUS user
 */
export function useCreateRadiusUser() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRadiusUserRequest) =>
      api.radius.createUser(http, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radius', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to update RADIUS user
 */
export function useUpdateRadiusUser() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<CreateRadiusUserRequest> }) =>
      api.radius.updateUser(http, id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['radius', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['radius', 'users', variables.id] });
    },
  });
}

/**
 * Hook to delete RADIUS user
 */
export function useDeleteRadiusUser() {
  const { http, api } = useApiClients();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.radius.deleteUser(http, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radius', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Hook to fetch active RADIUS sessions
 */
export function useActiveSessions() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['radius', 'sessions', 'active'],
    queryFn: () => api.radius.listActiveSessions(http),
    staleTime: 1000 * 15, // 15 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
}

/**
 * Hook to fetch RADIUS accounting data
 */
export function useRadiusAccounting(params?: any) {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['radius', 'accounting', params],
    queryFn: () => api.radius.getAccounting(http, params),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch RADIUS groups
 */
export function useRadiusGroups() {
  const { http, api } = useApiClients();

  return useQuery({
    queryKey: ['radius', 'groups'],
    queryFn: () => api.radius.listGroups(http),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
