import React from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator, Card, Divider, Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useActiveSessions } from "@/hooks/useRadiusUsers";
import { useTheme } from "@/hooks/use-theme";

/**
 * Active Sessions Screen
 *
 * Displays currently active WiFi sessions
 */
export default function ActiveSessionsScreen() {
  const theme = useTheme();
  const { data: sessions, isLoading, error, refetch, isRefetching } = useActiveSessions();

  // Format bytes to human readable
  const formatBytes = (bytes: number | null | undefined) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Format duration in seconds to human readable
  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading active sessions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>
            Failed to load sessions
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
            Active Sessions
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {sessions?.length || 0} active session{sessions?.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Sessions List */}
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <Card key={session.radacctid} style={styles.card} mode="elevated">
              <Card.Content>
                {/* Username and Status */}
                <View style={styles.sessionHeader}>
                  <View style={styles.userInfo}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium" style={styles.username}>
                      {session.username}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    style={{ backgroundColor: `${theme.colors.success}20` }}
                    textStyle={{ color: theme.colors.success, fontWeight: 'bold', fontSize: 11 }}
                  >
                    ACTIVE
                  </Chip>
                </View>

                <Divider style={styles.divider} />

                {/* Session Details */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="ip-network"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      NAS IP:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {session.nasipaddress}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Duration:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {formatDuration(session.acctsessiontime)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="download"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Download:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {formatBytes(session.acctinputoctets)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="upload"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Upload:
                    </Text>
                    <Text variant="bodySmall" style={styles.detailValue}>
                      {formatBytes(session.acctoutputoctets)}
                    </Text>
                  </View>
                </View>

                {/* Session ID */}
                <Text variant="bodySmall" style={[styles.sessionId, { color: theme.colors.onSurfaceVariant }]}>
                  Session: {session.acctsessionid}
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="sleep"
              size={64}
              color={theme.colors.onSurfaceVariant}
              style={{ opacity: 0.3 }}
            />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
              No active sessions
            </Text>
          </View>
        )}
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
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginLeft: 12,
  },
  divider: {
    marginVertical: 12,
  },
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    opacity: 0.7,
    minWidth: 70,
  },
  detailValue: {
    fontWeight: '500',
    flex: 1,
  },
  sessionId: {
    marginTop: 12,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
