import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function IpAddressesScreen() {
  return (
    <FeatureScreen
      title="IP Addresses"
      subtitle="Manage IP address allocation and assignments"
      icon="ip-network"
      showAddButton
      onAddPress={() => console.log('Add IP address')}
    />
  );
}
