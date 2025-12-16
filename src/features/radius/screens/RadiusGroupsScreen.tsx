import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function RadiusGroupsScreen() {
  return (
    <FeatureScreen
      title="RADIUS Groups"
      subtitle="Manage RADIUS user groups and policies"
      icon="shield-account"
      showAddButton
      onAddPress={() => console.log('Add RADIUS group')}
    />
  );
}
