import React, { useState } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Text, FAB, ActivityIndicator, useTheme, Searchbar, Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useHotspots, useDeleteHotspot } from "@/hooks/useHotspots";
import { useAuthState } from "@/context/ApiContext";
import { HotspotCard } from "@/components/wiwebb/HotspotCard";
import Toast from "react-native-toast-message";

/**
 * Hotspots Screen
 *
 * Lists all WiFi hotspots with filtering and management options
 */
export default function HotspotsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Online' | 'Offline'>('all');

  const tenantId = user?.role === 'tenant_owner' ? user.tenant || undefined : undefined;
  const { data: hotspots, isLoading, error, refetch, isRefetching } = useHotspots(tenantId);
  const deleteHotspot = useDeleteHotspot();

  const filteredHotspots = hotspots?.filter(hotspot => {
    const matchesSearch = hotspot.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hotspot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number, name: string) => {
    try {
      await deleteHotspot.mutateAsync(id);
      Toast.show({
        type: 'success',
        text1: 'Hotspot Deleted',
        text2: `${name} has been removed`,
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
          <Text style={styles.loadingText}>Loading hotspots...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>
            Failed to load hotspots
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
            WiFi Hotspots
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {filteredHotspots?.length || 0} hotspot{filteredHotspots?.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search hotspots..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <View style={styles.filtersContainer}>
            <Chip
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.chip}
            >
              All
            </Chip>
            <Chip
              selected={statusFilter === 'Online'}
              onPress={() => setStatusFilter('Online')}
              style={styles.chip}
            >
              Online
            </Chip>
            <Chip
              selected={statusFilter === 'Offline'}
              onPress={() => setStatusFilter('Offline')}
              style={styles.chip}
            >
              Offline
            </Chip>
          </View>
        </View>

        {/* Hotspots List */}
        {filteredHotspots && filteredHotspots.length > 0 ? (
          filteredHotspots.map((hotspot) => (
            <HotspotCard
              key={hotspot.id}
              hotspot={hotspot}
              onPress={() => router.push(`/hotspots/${hotspot.id}` as any)}
              onDelete={() => handleDelete(hotspot.id, hotspot.name)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              No hotspots found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Hotspot FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          Toast.show({
            type: 'info',
            text1: 'Coming Soon',
            text2: 'Add hotspot functionality will be implemented',
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
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
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
