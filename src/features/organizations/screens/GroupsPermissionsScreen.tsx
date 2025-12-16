import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function GroupsPermissionsScreen() {
  return (
    <FeatureScreen
      title="Groups & Permissions"
      subtitle="Manage user groups and access permissions"
      icon="shield-account"
      showAddButton
      onAddPress={() => console.log('Add group')}
    />
  );
}
