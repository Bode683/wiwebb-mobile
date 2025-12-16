import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { VpnSiteToSite } from '../types';

export function VpnSiteToSiteScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const [connections] = useState<VpnSiteToSite[]>([
    {
      id: '1',
      name: 'Branch Office NYC',
      localSubnet: '192.168.1.0/24',
      remoteSubnet: '192.168.2.0/24',
      remoteGateway: '203.0.113.1',
      status: 'connected',
      uptime: '15d 4h 23m',
      bytesReceived: 1024000000,
      bytesSent: 512000000,
    },
    {
      id: '2',
      name: 'Branch Office LA',
      localSubnet: '192.168.1.0/24',
      remoteSubnet: '192.168.3.0/24',
      remoteGateway: '198.51.100.1',
      status: 'disconnected',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: VpnSiteToSite['status']) => {
    switch (status) {
      case 'connected':
        return theme.colors.success;
      case 'disconnected':
        return theme.colors.textMuted;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.textMuted;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  function renderConnection({ item }: { item: VpnSiteToSite }) {
    return (
      <TouchableOpacity
        style={[
          styles.connectionCard,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          },
        ]}
        activeOpacity={0.7}>
        <View style={styles.connectionHeader}>
          <View style={styles.connectionInfo}>
            <ThemedText
              style={[
                styles.connectionName,
                { color: theme.colors.text, marginBottom: 4 },
              ]}>
              {item.name}
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(item.status) + '20',
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radii.md,
                  alignSelf: 'flex-start',
                },
              ]}>
              <View
                style={[
                  styles.statusDot,
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getStatusColor(item.status),
                    marginRight: 6,
                  },
                ]}
              />
              <ThemedText
                style={[
                  styles.statusText,
                  {
                    color: getStatusColor(item.status),
                    textTransform: 'capitalize',
                  },
                ]}>
                {item.status}
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.connectionDetails,
            {
              marginTop: theme.spacing.md,
              paddingTop: theme.spacing.md,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="access-point-network"
              size={16}
              color={theme.colors.textMuted}
            />
            <ThemedText
              style={[
                styles.detailLabel,
                { color: theme.colors.textMuted, marginLeft: 8, flex: 1 },
              ]}>
              Local:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.localSubnet}
            </ThemedText>
          </View>

          <View style={[styles.detailRow, { marginTop: 8 }]}>
            <MaterialCommunityIcons
              name="wan"
              size={16}
              color={theme.colors.textMuted}
            />
            <ThemedText
              style={[
                styles.detailLabel,
                { color: theme.colors.textMuted, marginLeft: 8, flex: 1 },
              ]}>
              Remote:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.remoteSubnet}
            </ThemedText>
          </View>

          <View style={[styles.detailRow, { marginTop: 8 }]}>
            <MaterialCommunityIcons
              name="router-network"
              size={16}
              color={theme.colors.textMuted}
            />
            <ThemedText
              style={[
                styles.detailLabel,
                { color: theme.colors.textMuted, marginLeft: 8, flex: 1 },
              ]}>
              Gateway:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: theme.colors.text }]}>
              {item.remoteGateway}
            </ThemedText>
          </View>

          {item.uptime && (
            <View style={[styles.detailRow, { marginTop: 8 }]}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={theme.colors.textMuted}
              />
              <ThemedText
                style={[
                  styles.detailLabel,
                  { color: theme.colors.textMuted, marginLeft: 8, flex: 1 },
                ]}>
                Uptime:
              </ThemedText>
              <ThemedText style={[styles.detailValue, { color: theme.colors.text }]}>
                {item.uptime}
              </ThemedText>
            </View>
          )}

          {item.bytesReceived !== undefined && item.bytesSent !== undefined && (
            <View
              style={[
                styles.trafficContainer,
                {
                  marginTop: theme.spacing.md,
                  paddingTop: theme.spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border,
                },
              ]}>
              <View style={styles.trafficRow}>
                <MaterialCommunityIcons
                  name="download"
                  size={16}
                  color={theme.colors.success}
                />
                <ThemedText
                  style={[
                    styles.trafficText,
                    { color: theme.colors.textMuted, marginLeft: 6 },
                  ]}>
                  {formatBytes(item.bytesReceived)}
                </ThemedText>
              </View>
              <View style={styles.trafficRow}>
                <MaterialCommunityIcons
                  name="upload"
                  size={16}
                  color={theme.colors.primary}
                />
                <ThemedText
                  style={[
                    styles.trafficText,
                    { color: theme.colors.textMuted, marginLeft: 6 },
                  ]}>
                  {formatBytes(item.bytesSent)}
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={[styles.header, { padding: theme.spacing.lg }]}>
          <ThemedText
            style={[
              styles.title,
              { color: theme.colors.text, marginBottom: theme.spacing.sm },
            ]}>
            Site-to-Site VPN
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Manage VPN tunnels between sites
          </ThemedText>
        </View>

        {/* Stats Cards */}
        <View
          style={[
            styles.statsContainer,
            { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md },
          ]}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.success + '15',
                padding: theme.spacing.md,
                borderRadius: theme.radii.lg,
                flex: 1,
                marginRight: theme.spacing.sm,
              },
            ]}>
            <ThemedText
              style={[
                styles.statNumber,
                { color: theme.colors.success, fontSize: 24, fontWeight: '700' },
              ]}>
              {connections.filter((c) => c.status === 'connected').length}
            </ThemedText>
            <ThemedText
              style={[
                styles.statLabel,
                { color: theme.colors.success, fontSize: 12 },
              ]}>
              Connected
            </ThemedText>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.textMuted + '15',
                padding: theme.spacing.md,
                borderRadius: theme.radii.lg,
                flex: 1,
                marginLeft: theme.spacing.sm,
              },
            ]}>
            <ThemedText
              style={[
                styles.statNumber,
                { color: theme.colors.text, fontSize: 24, fontWeight: '700' },
              ]}>
              {connections.length}
            </ThemedText>
            <ThemedText
              style={[
                styles.statLabel,
                { color: theme.colors.textMuted, fontSize: 12 },
              ]}>
              Total
            </ThemedText>
          </View>
        </View>

        {/* Connection List */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <FlatList
            data={connections}
            renderItem={renderConnection}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="lan-disconnect"
                  size={48}
                  color={theme.colors.textMuted}
                />
                <ThemedText
                  style={[
                    styles.emptyText,
                    {
                      color: theme.colors.textMuted,
                      marginTop: theme.spacing.md,
                    },
                  ]}>
                  No VPN connections found
                </ThemedText>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            position: 'absolute',
            bottom: theme.spacing.xl,
            right: theme.spacing.lg,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
        ]}>
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {},
  statLabel: {},
  connectionCard: {},
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {},
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  connectionDetails: {},
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  trafficContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficText: {
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  fab: {},
});
