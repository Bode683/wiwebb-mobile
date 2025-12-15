import type { UpdateUserRequest } from '@/api/types';
import { useApi } from '@/context/ApiContext';
import { useMutation } from '@tanstack/react-query';

/**
 * Profile hook with TanStack Query
 *
 * Provides:
 * - Profile data from ApiContext (no separate API call needed)
 * - Mutations for updating profile and managing avatar
 *
 * Usage:
 * const { profile, isLoading, updateProfile } = useCurrentProfile();
 */
export function useCurrentProfile() {
  const { user, isAuthLoading, api, http, refreshAuth } = useApi();

  /**
   * Update profile mutation
   * Updates the current user's profile and refreshes auth state
   */
  const updateMutation = useMutation({
    mutationFn: (updates: UpdateUserRequest) =>
      api.profiles.updateProfile(http, updates),
    onSuccess: async () => {
      // Refresh auth state to get updated user data
      await refreshAuth();
    },
  });

  /**
   * Upload avatar mutation
   * Uploads avatar image and refreshes auth state
   */
  const uploadAvatarMutation = useMutation({
    mutationFn: ({
      file,
      fileName,
      contentType
    }: {
      file: File | Blob;
      fileName?: string;
      contentType?: string;
    }) =>
      api.profiles.uploadAvatar(http, file, { fileName, contentType }),
    onSuccess: async () => {
      // Refresh auth state to get updated user data with new avatar
      await refreshAuth();
    },
  });

  /**
   * Delete avatar mutation
   * Removes avatar and refreshes auth state
   */
  const deleteAvatarMutation = useMutation({
    mutationFn: () =>
      api.profiles.deleteAvatar(http),
    onSuccess: async () => {
      // Refresh auth state to get updated user data
      await refreshAuth();
    },
  });

  return {
    // Profile data (from auth context)
    profile: user,
    isLoading: isAuthLoading,
    isError: false,
    error: null,

    // Mutations
    updateProfile: updateMutation.mutateAsync,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    deleteAvatar: deleteAvatarMutation.mutateAsync,

    // Mutation states
    isUpdating: updateMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isDeletingAvatar: deleteAvatarMutation.isPending,

    // Mutation errors
    updateError: updateMutation.error,
    uploadAvatarError: uploadAvatarMutation.error,
    deleteAvatarError: deleteAvatarMutation.error,
  };
}
