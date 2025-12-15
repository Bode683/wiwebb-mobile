import React from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Text, ActivityIndicator, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlans, useSubscriptionStatus, useSubscribe } from "@/hooks/useSubscriptions";
import { PlanCard } from "@/components/wiwebb/PlanCard";
import { toast } from "@/components/ToastProvider";

/**
 * Subscription Plans Screen
 *
 * Lists all available subscription plans
 */
export default function PlansScreen() {
  const theme = useTheme();
  const { data: plans, isLoading, error, refetch, isRefetching } = usePlans();
  const { data: currentSubscription } = useSubscriptionStatus();
  const subscribe = useSubscribe();

  const handleSubscribe = async (planId: number, planName: string) => {
    try {
      await subscribe.mutateAsync({ planId });
      toast.success('Subscription Successful', `You are now subscribed to ${planName}`);
    } catch (error) {
      toast.error('Subscription Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={styles.errorText}>
            Failed to load plans
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
            Subscription Plans
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Choose the plan that fits your needs
          </Text>
        </View>

        {/* Current Subscription Info */}
        {currentSubscription && (
          <View style={[styles.currentPlanBanner, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
              Current Plan
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              Status: {currentSubscription.status}
            </Text>
            {currentSubscription.current_period_end && (
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                Renews: {new Date(currentSubscription.current_period_end).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* Plans List */}
        {plans && plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={currentSubscription?.plan === plan.id}
              onSubscribe={() => handleSubscribe(plan.id, plan.name)}
              disabled={subscribe.isPending}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              No plans available
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
  currentPlanBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
