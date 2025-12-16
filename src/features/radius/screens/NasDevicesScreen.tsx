import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function NasDevicesScreen() {
  return (
    <FeatureScreen
      title="NAS Devices"
      subtitle="Manage Network Access Server devices"
      icon="server"
      showAddButton
      onAddPress={() => console.log('Add NAS device')}
    />
  );
}
