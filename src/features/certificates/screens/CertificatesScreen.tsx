import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function CertificatesScreen() {
  return (
    <FeatureScreen
      title="Certificates"
      subtitle="Manage SSL/TLS certificates"
      icon="certificate-outline"
      showAddButton
      onAddPress={() => console.log('Add certificate')}
    />
  );
}
