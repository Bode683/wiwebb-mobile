import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function TenantsScreen() {
  return (
    <FeatureScreen
      title="Tenants"
      subtitle="Manage tenant accounts and configurations"
      icon="domain"
      showAddButton
      onAddPress={() => console.log('Add tenant')}
    />
  );
}
