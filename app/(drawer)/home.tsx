import React from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator, useTheme, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useAuthState } from "@/context/ApiContext";
import { StatCard } from "@/components/wiwebb/StatCard";

/**
 * Dashboard Screen
 *
 * Main entry point for the app after authentication
 * Shows overview statistics and system health
 */
export default function DashboardScreen() {
  const theme = useTheme();
  const { user } = useAuthState();
  const { data: stats, isLoading, error, refetch, isRefetching } = useDashboardStats();

  // Welcome message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>
            Failed to load dashboard
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
          <View>
            <Text variant="headlineMedium" style={styles.greeting}>
              {getGreeting()}, {user?.username || 'User'}!
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Here&apos;s your WiFi network overview
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.row}>
            <StatCard
              title="Total Tenants"
              value={stats?.total_tenants || 0}
              icon="office-building-outline"
              color={theme.colors.primary}
            />
            <StatCard
              title="Active Hotspots"
              value={stats?.active_hotspots || 0}
              icon="wifi"
              color="#10b981"
            />
          </View>
          <View style={styles.row}>
            <StatCard
              title="Total Users"
              value={stats?.total_users || 0}
              icon="account-group"
              color="#f59e0b"
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${stats?.monthly_revenue || 0}`}
              icon="cash-multiple"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* User Role Badge */}
        <View style={styles.roleContainer}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Role: <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {user?.role || 'subscriber'}
            </Text>
          </Text>
          {user?.tenant && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Tenant: <Text style={{ fontWeight: 'bold' }}>{user.tenant.name}</Text>
            </Text>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  divider: {
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
  },
});
