import { FeatureScreen } from '@/components/FeatureScreen';
import React from 'react';

export function CertificationAuthoritiesScreen() {
  return (
    <FeatureScreen
      title="Certification Authorities"
      subtitle="Manage certificate authorities and root certificates"
      icon="shield-check"
      showAddButton
      onAddPress={() => console.log('Add CA')}
    />
  );
}
