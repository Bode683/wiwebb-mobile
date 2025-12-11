import { z } from 'zod';
import * as schemas from './schemas';

/**
 * TypeScript types inferred from Zod schemas
 * This ensures single source of truth for validation and types
 */

// ============================================================================
// Auth Types
// ============================================================================

export type SignInRequest = z.infer<typeof schemas.signInSchema>;
export type SignUpRequest = z.infer<typeof schemas.signUpSchema>;
export type SignInWithOtpRequest = z.infer<typeof schemas.signInWithOtpSchema>;
export type User = z.infer<typeof schemas.userSchema>;
export type UserTenant = z.infer<typeof schemas.userTenantSchema>;
export type LoginResponse = z.infer<typeof schemas.loginResponseSchema>;
export type AuthResponse = z.infer<typeof schemas.authResponseSchema>;
export type UpdateUserRequest = z.infer<typeof schemas.updateUserSchema>;
export type CreateUserRequest = z.infer<typeof schemas.createUserSchema>;
export type ActivateUserRequest = z.infer<typeof schemas.activateUserSchema>;
export type AssignRoleRequest = z.infer<typeof schemas.assignRoleSchema>;
export type SetPasswordRequest = z.infer<typeof schemas.setPasswordSchema>;

// ============================================================================
// Profile Types
// ============================================================================

export type Profile = z.infer<typeof schemas.profileSchema>;
export type UpdateProfileRequest = z.infer<typeof schemas.updateProfileSchema>;

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentMethod = z.infer<typeof schemas.paymentMethodSchema>;
export type Payment = z.infer<typeof schemas.paymentSchema>;

// ============================================================================
// Notification Types
// ============================================================================

export type Notification = z.infer<typeof schemas.notificationSchema>;

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ListOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Wiwebb Types
// ============================================================================

export type Tenant = z.infer<typeof schemas.tenantSchema>;
export type Hotspot = z.infer<typeof schemas.hotspotSchema>;
export type CreateHotspotRequest = z.infer<typeof schemas.createHotspotSchema>;

export type RadiusUser = z.infer<typeof schemas.radiusUserSchema>;
export type RadiusGroup = z.infer<typeof schemas.radiusGroupSchema>;
export type RadiusSession = z.infer<typeof schemas.radiusSessionSchema>;
export type CreateRadiusUserRequest = z.infer<typeof schemas.createRadiusUserSchema>;

export type Plan = z.infer<typeof schemas.planSchema>;
export type PlanPricing = z.infer<typeof schemas.planPricingSchema>;
export type Subscription = z.infer<typeof schemas.subscriptionSchema>;
export type PaymentGateway = z.infer<typeof schemas.paymentGatewaySchema>;
export type WiwebbPayment = z.infer<typeof schemas.wiwebbPaymentSchema>;
export type CreatePaymentRequest = z.infer<typeof schemas.createPaymentSchema>;

export type DashboardStats = z.infer<typeof schemas.dashboardStatsSchema>;
