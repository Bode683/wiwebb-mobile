import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function UsersScreen() {
  return (
    <FeatureScreen
      title="Users"
      subtitle="Manage all system users"
      icon="account-multiple"
      showAddButton
      onAddPress={() => console.log('Add user')}
    />
  );
}
