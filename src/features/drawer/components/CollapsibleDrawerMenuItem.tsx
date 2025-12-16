import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface CollapsibleDrawerMenuItemProps {
  icon: string;
  title: string;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleDrawerMenuItem({
  icon,
  title,
  isActive,
  isExpanded,
  onToggle,
  children,
}: CollapsibleDrawerMenuItemProps) {
  const theme = useTheme();
  const heightValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: isExpanded ? 'auto' : 0,
    opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
    overflow: 'hidden',
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isExpanded ? '90deg' : '0deg', { duration: 200 }),
      },
    ],
  }));

  return (
    <View>
      {/* Parent Menu Item */}
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: isActive
              ? theme.colors.primary + '15'
              : theme.colors.background,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            marginHorizontal: theme.spacing.lg,
            marginVertical: theme.spacing.xs,
            borderRadius: theme.radii.lg,
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.7}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isActive
                  ? theme.colors.primary + '25'
                  : theme.colors.muted,
                padding: theme.spacing.sm,
                borderRadius: theme.radii.md,
              },
            ]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={isActive ? theme.colors.primary : theme.colors.text}
            />
          </View>

          <View style={styles.textContainer}>
            <ThemedText
              style={[
                styles.title,
                {
                  color: isActive ? theme.colors.primary : theme.colors.text,
                  fontWeight: isActive ? '600' : '500',
                },
              ]}>
              {title}
            </ThemedText>
          </View>
        </View>

        {/* Chevron Icon */}
        <Animated.View style={rotationStyle}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={isActive ? theme.colors.primary : theme.colors.textMuted}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Submenu Items */}
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
});
