import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function OrganizationsScreen() {
  return (
    <FeatureScreen
      title="Organizations"
      subtitle="Manage organizations and their settings"
      icon="office-building"
      showAddButton
      onAddPress={() => console.log('Add organization')}
    />
  );
}
