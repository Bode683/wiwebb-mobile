import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function BatchUserCreationScreen() {
  return (
    <FeatureScreen
      title="Batch User Creation"
      subtitle="Create multiple RADIUS users at once"
      icon="account-multiple-plus"
    />
  );
}
