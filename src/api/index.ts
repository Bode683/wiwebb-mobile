/**
 * Barrel export for API modules
 * Provides centralized access to all API functions
 */

export * from './errors';
export * from './types';
export * from './schemas';
export * from './queryKeys';

// Django Auth
export { djangoAuthApi } from './django-auth.api';

// User Management (Admin)
export { usersApi } from './users.api';

// Profile Management
export { profilesApi } from './profiles.api';

// Wiwebb API Modules
export { tenantsApi } from './tenants.api';
export { hotspotsApi } from './hotspots.api';
export { radiusApi } from './radius.api';
export { subscriptionsApi } from './subscriptions.api';
export { paymentsApi } from './payments.api';
