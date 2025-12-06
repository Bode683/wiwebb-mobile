import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { RadiusUser } from '@/api/types';

interface RadiusUserCardProps {
  user: RadiusUser;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RadiusUserCard({ user, onPress, onEdit, onDelete }: RadiusUserCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color={theme.colors.primary}
            />
            <View style={styles.titleText}>
              <Text variant="titleMedium" style={styles.name}>
                {user.username}
              </Text>
              {user.attribute && (
                <Chip
                  mode="flat"
                  style={styles.attributeChip}
                  textStyle={styles.attributeText}
                >
                  {user.attribute}
                </Chip>
              )}
            </View>
          </View>
        </View>

        {user.value && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="information"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
              {user.op ? `${user.op}: ` : ''}{user.value}
            </Text>
          </View>
        )}

        {user.created_at && (
          <Text variant="bodySmall" style={[styles.createdAt, { color: theme.colors.onSurfaceVariant }]}>
            Created: {new Date(user.created_at).toLocaleDateString()}
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
    marginBottom: 4,
  },
  attributeChip: {
    alignSelf: 'flex-start',
    height: 24,
  },
  attributeText: {
    fontSize: 11,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 4,
  },
  createdAt: {
    marginTop: 4,
    fontSize: 11,
  },
});
