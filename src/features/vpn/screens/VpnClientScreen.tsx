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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { VpnClient } from '../types';

export function VpnClientScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const [clients] = useState<VpnClient[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      ipAddress: '10.8.0.2',
      status: 'active',
      createdAt: '2024-01-15',
      lastConnected: '2024-01-20 10:30 AM',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      ipAddress: '10.8.0.3',
      status: 'inactive',
      createdAt: '2024-01-10',
      lastConnected: '2024-01-18 3:15 PM',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: VpnClient['status']) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.textMuted;
      case 'pending':
        return theme.colors.warning;
      default:
        return theme.colors.textMuted;
    }
  };

  const getStatusIcon = (status: VpnClient['status']) => {
    switch (status) {
      case 'active':
        return 'check-circle';
      case 'inactive':
        return 'close-circle';
      case 'pending':
        return 'clock';
      default:
        return 'help-circle';
    }
  };

  function renderClient({ item }: { item: VpnClient }) {
    return (
      <TouchableOpacity
        style={[
          styles.clientCard,
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
        <View style={styles.clientHeader}>
          <View style={styles.clientInfo}>
            <ThemedText
              style={[
                styles.clientName,
                { color: theme.colors.text, marginBottom: 4 },
              ]}>
              {item.name}
            </ThemedText>
            <ThemedText
              style={[styles.clientEmail, { color: theme.colors.textMuted }]}>
              {item.email}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(item.status) + '20',
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radii.md,
              },
            ]}>
            <MaterialCommunityIcons
              name={getStatusIcon(item.status)}
              size={16}
              color={getStatusColor(item.status)}
              style={{ marginRight: 4 }}
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

        <View
          style={[
            styles.clientDetails,
            {
              marginTop: theme.spacing.md,
              paddingTop: theme.spacing.md,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="ip-network"
              size={16}
              color={theme.colors.textMuted}
            />
            <ThemedText
              style={[
                styles.detailText,
                { color: theme.colors.textMuted, marginLeft: 8 },
              ]}>
              IP: {item.ipAddress}
            </ThemedText>
          </View>
          {item.lastConnected && (
            <View style={[styles.detailRow, { marginTop: 4 }]}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={theme.colors.textMuted}
              />
              <ThemedText
                style={[
                  styles.detailText,
                  { color: theme.colors.textMuted, marginLeft: 8 },
                ]}>
                Last: {item.lastConnected}
              </ThemedText>
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
            VPN Clients
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Manage VPN client connections and access
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { padding: theme.spacing.lg }]}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.colors.input,
                borderRadius: theme.radii.lg,
                paddingHorizontal: theme.spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={theme.colors.textMuted}
            />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.colors.text,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.sm,
                  flex: 1,
                },
              ]}
              placeholder="Search clients..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
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
              {clients.filter((c) => c.status === 'active').length}
            </ThemedText>
            <ThemedText
              style={[
                styles.statLabel,
                { color: theme.colors.success, fontSize: 12 },
              ]}>
              Active
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
              {clients.length}
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

        {/* Client List */}
        <View style={{ paddingHorizontal: theme.spacing.lg }}>
          <FlatList
            data={filteredClients}
            renderItem={renderClient}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="account-off"
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
                  No VPN clients found
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
  searchContainer: {},
  searchBox: {},
  searchInput: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {},
  statLabel: {},
  clientCard: {},
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientEmail: {
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clientDetails: {},
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
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
