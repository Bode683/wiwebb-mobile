import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { ReactNode, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface FeatureScreenProps {
  title: string;
  subtitle: string;
  icon: string;
  children?: ReactNode;
  showAddButton?: boolean;
  onAddPress?: () => void;
  onRefresh?: () => Promise<void>;
}

export function FeatureScreen({
  title,
  subtitle,
  icon,
  children,
  showAddButton = false,
  onAddPress,
  onRefresh,
}: FeatureScreenProps) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          ) : undefined
        }>
        {/* Header */}
        <View style={[styles.header, { padding: theme.spacing.lg }]}>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.colors.primary + '15',
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.lg,
                  marginBottom: theme.spacing.md,
                },
              ]}>
              <MaterialCommunityIcons
                name={icon as any}
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <ThemedText
              style={[
                styles.title,
                { color: theme.colors.text, marginBottom: theme.spacing.sm },
              ]}>
              {title}
            </ThemedText>
            <ThemedText
              style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              {subtitle}
            </ThemedText>
          </View>
        </View>

        {/* Content */}
        {children ? (
          <View style={{ paddingHorizontal: theme.spacing.lg }}>
            {children}
          </View>
        ) : (
          <View style={[styles.emptyContainer, { paddingVertical: 48 }]}>
            <MaterialCommunityIcons
              name="information-outline"
              size={64}
              color={theme.colors.textMuted}
            />
            <ThemedText
              style={[
                styles.emptyText,
                {
                  color: theme.colors.textMuted,
                  marginTop: theme.spacing.lg,
                  textAlign: 'center',
                },
              ]}>
              This feature is coming soon.{'\n'}Check back later for updates.
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      {showAddButton && onAddPress && (
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
          ]}
          onPress={onAddPress}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
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
  headerContent: {
    alignItems: 'flex-start',
  },
  iconContainer: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  fab: {},
});
