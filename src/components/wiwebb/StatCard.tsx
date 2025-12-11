import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const theme = useTheme();
  const primaryColor = color || theme.colors.primary;

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}15` }]}>
            <MaterialCommunityIcons name={icon} size={24} color={primaryColor} />
          </View>
          {trend && (
            <View style={styles.trend}>
              <MaterialCommunityIcons
                name={trend.isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={trend.isPositive ? theme.colors.primary : theme.colors.error}
              />
              <Text
                variant="bodySmall"
                style={{
                  color: trend.isPositive ? theme.colors.primary : theme.colors.error,
                  marginLeft: 2,
                }}
              >
                {Math.abs(trend.value)}%
              </Text>
            </View>
          )}
        </View>
        <Text variant="headlineMedium" style={styles.value}>
          {value}
        </Text>
        <Text variant="bodyMedium" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    margin: 6,
  },
  content: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    opacity: 0.7,
  },
});
