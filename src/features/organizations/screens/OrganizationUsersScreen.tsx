import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function OrganizationUsersScreen() {
  return (
    <FeatureScreen
      title="Organization Users"
      subtitle="Manage users within your organization"
      icon="account-group"
      showAddButton
      onAddPress={() => console.log('Add organization user')}
    />
  );
}
