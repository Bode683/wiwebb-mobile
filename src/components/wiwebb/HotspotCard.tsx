import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Badge, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Hotspot } from '@/api/types';

interface HotspotCardProps {
  hotspot: Hotspot;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HotspotCard({ hotspot, onPress, onEdit, onDelete }: HotspotCardProps) {
  const theme = useTheme();
  const isOnline = hotspot.status === 'Online';

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="wifi"
              size={24}
              color={isOnline ? '#10b981' : theme.colors.onSurfaceVariant}
            />
            <View style={styles.titleText}>
              <Text variant="titleMedium" style={styles.name}>
                {hotspot.name}
              </Text>
              {hotspot.tenant_name && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {hotspot.tenant_name}
                </Text>
              )}
            </View>
          </View>
          <Badge
            style={[
              styles.badge,
              {
                backgroundColor: isOnline ? '#10b98120' : theme.colors.errorContainer,
              },
            ]}
          >
            <Text
              variant="labelSmall"
              style={{
                color: isOnline ? '#10b981' : theme.colors.error,
                fontWeight: 'bold',
              }}
            >
              {hotspot.status}
            </Text>
          </Badge>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={styles.statText}>
              {hotspot.clients} clients
            </Text>
          </View>
          {hotspot.bandwidth && (
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="speedometer"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={styles.statText}>
                {hotspot.bandwidth}
              </Text>
            </View>
          )}
          {hotspot.uptime && (
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodySmall" style={styles.statText}>
                {hotspot.uptime}
              </Text>
            </View>
          )}
        </View>

        {hotspot.mac_address && (
          <Text variant="bodySmall" style={[styles.macAddress, { color: theme.colors.onSurfaceVariant }]}>
            MAC: {hotspot.mac_address}
          </Text>
        )}
      </Card.Content>

      {(onEdit || onDelete) && (
        <Card.Actions>
          {onEdit && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={onEdit}
            />
          )}
          {onDelete && (
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={onDelete}
            />
          )}
        </Card.Actions>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  statText: {
    marginLeft: 4,
  },
  macAddress: {
    marginTop: 8,
    fontFamily: 'monospace',
  },
});
