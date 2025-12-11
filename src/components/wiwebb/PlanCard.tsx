import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Plan } from '@/api/types';

interface PlanCardProps {
  plan: Plan;
  isActive?: boolean;
  onSubscribe?: () => void;
  disabled?: boolean;
}

export function PlanCard({ plan, isActive, onSubscribe, disabled }: PlanCardProps) {
  const theme = useTheme();

  return (
    <Card
      style={[
        styles.card,
        isActive && {
          borderWidth: 2,
          borderColor: theme.colors.primary,
        },
      ]}
      mode="elevated"
    >
      <Card.Content>
        {/* Plan Name and Default Badge */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.planName}>
            {plan.name}
          </Text>
          {isActive && (
            <Chip
              mode="flat"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 11 }}
            >
              ACTIVE
            </Chip>
          )}
          {plan.default && !isActive && (
            <Chip
              mode="flat"
              textStyle={{ fontSize: 11 }}
            >
              DEFAULT
            </Chip>
          )}
        </View>

        {/* Description */}
        {plan.description && (
          <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {plan.description}
          </Text>
        )}

        <Divider style={styles.divider} />

        {/* Features */}
        <View style={styles.features}>
          {plan.daily_time_minutes && (
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.featureText}>
                {plan.daily_time_minutes} minutes/day
              </Text>
            </View>
          )}

          {plan.daily_data_mb && (
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="database"
                size={20}
                color={theme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.featureText}>
                {plan.daily_data_mb} MB data/day
              </Text>
            </View>
          )}

          <View style={styles.feature}>
            <MaterialCommunityIcons
              name={plan.requires_payment ? "cash" : "gift"}
              size={20}
              color={plan.requires_payment ? theme.colors.secondary : theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.featureText}>
              {plan.requires_payment ? 'Paid Plan' : 'Free Plan'}
            </Text>
          </View>
        </View>
      </Card.Content>

      {/* Subscribe Button */}
      {!isActive && onSubscribe && (
        <Card.Actions>
          <Button
            mode="contained"
            onPress={onSubscribe}
            disabled={disabled || !plan.available}
            style={styles.button}
          >
            {plan.available ? 'Subscribe' : 'Not Available'}
          </Button>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontWeight: 'bold',
    flex: 1,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  features: {
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
});
