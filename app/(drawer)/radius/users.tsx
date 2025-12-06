import React, { useState } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Text, FAB, ActivityIndicator, useTheme, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRadiusUsers, useDeleteRadiusUser } from "@/hooks/useRadiusUsers";
import { RadiusUserCard } from "@/components/wiwebb/RadiusUserCard";
import Toast from "react-native-toast-message";

/**
 * RADIUS Users Screen
 *
 * Manages WiFi authentication users
 */
export default function RadiusUsersScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: users, isLoading, error, refetch, isRefetching } = useRadiusUsers();
  const deleteUser = useDeleteRadiusUser();

  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number, username: string) => {
    try {
      await deleteUser.mutateAsync(id);
      Toast.show({
        type: 'success',
        text1: 'User Deleted',
        text2: `${username} has been removed`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading RADIUS users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>
            Failed to load RADIUS users
          </Text>
          <Text variant="bodyMedium" style={[styles.errorText, { opacity: 0.7 }]}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            RADIUS Users
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {filteredUsers?.length || 0} user{filteredUsers?.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        {/* Users List */}
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <RadiusUserCard
              key={user.id}
              user={user}
              onDelete={() => handleDelete(user.id, user.username)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              No users found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add User FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          Toast.show({
            type: 'info',
            text1: 'Coming Soon',
            text2: 'Add user functionality will be implemented',
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
