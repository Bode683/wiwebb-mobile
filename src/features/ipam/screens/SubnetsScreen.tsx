import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function SubnetsScreen() {
  return (
    <FeatureScreen
      title="Subnets"
      subtitle="Manage network subnets and CIDR blocks"
      icon="source-branch"
      showAddButton
      onAddPress={() => console.log('Add subnet')}
    />
  );
}
