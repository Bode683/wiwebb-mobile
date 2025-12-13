import { z } from 'zod';

/**
 * Zod schemas for API request/response validation
 * These ensure type safety and runtime validation
 */

// ============================================================================
// Auth Schemas
// ============================================================================

// Django login accepts either username or email
// We'll accept both for flexibility - the API will determine which to use
export const signInSchema = z.object({
  email: z.string().min(1, 'Email or username is required').optional(),
  username: z.string().min(1, 'Username is required').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.email || data.username, {
  message: 'Either email or username must be provided',
  path: ['email'],
});

export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

export const signInWithOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  options: z
    .object({
      emailRedirectTo: z.string().url().optional(),
      shouldCreateUser: z.boolean().optional(),
    })
    .optional(),
});

// Tenant detail object (as returned in user API)
export const userTenantSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
}).nullable();

// Django User Model Schema
export const userSchema = z.object({
  id: z.number(), // User ID (Django returns both 'id' and 'pk', we use 'id' as standard)
  pk: z.number().optional(), // Django also sends 'pk', but we'll use 'id' as primary
  username: z.string(),
  email: z.string().email(),
  first_name: z.string().default(''),
  last_name: z.string().default(''),
  role: z.enum(['superadmin', 'admin', 'tenant_owner', 'subscriber']).default('subscriber'),
  is_staff: z.boolean().default(false),
  is_superuser: z.boolean().default(false),
  is_active: z.boolean().default(true),
  tenant: userTenantSchema.optional(), // Tenant object with id, uuid, name, slug
  avatar: z.string().nullable().optional(), // Avatar URL or null
  phone_number: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  date_joined: z.string().datetime().optional(),
  last_login: z.string().datetime().nullable().optional(),
  password_updated: z.string().datetime().nullable().optional(), // Password update timestamp
  deleted_at: z.string().datetime().nullable().optional(), // Soft delete timestamp
});

// Django Login Response Schema (returns only auth key)
export const loginResponseSchema = z.object({
  key: z.string(), // DRF Token key
});

// Django Auth Response Schema (combined token + user for internal use)
export const authResponseSchema = z.object({
  token: z.string(), // DRF Token (we'll normalize 'key' to 'token' internally)
  user: userSchema,
});

// User update request schema
export const updateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  url: z.string().optional(),
  birth_date: z.string().optional(),
  avatar: z.any().optional(), // File upload handled by FormData
});

// User create request schema (admin only)
export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.enum(['superadmin', 'admin', 'tenant_owner', 'subscriber']),
  tenant: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
});

// User activation request schema
export const activateUserSchema = z.object({
  is_active: z.boolean(),
});

// Assign role request schema
export const assignRoleSchema = z.object({
  role: z.enum(['superadmin', 'admin', 'tenant_owner', 'subscriber']),
  tenant: z.number().nullable().optional(),
});

// Set password request schema (admin only)
export const setPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ============================================================================
// Profile Schemas
// ============================================================================

export const profileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(), // Can be file path or full URL
  phone: z.string().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  updated_at: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      if (typeof val === 'string') {
        const d = new Date(val.replace(' ', 'T'));
        if (!isNaN(d.getTime())) return d.toISOString();
      }
      return val;
    },
    z.string().datetime().nullable().optional()
  ),
});

export const updateProfileSchema = z.object({
  username: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().min(1).optional()
  ),
  full_name: z.preprocess(
    (val) => val === '' ? undefined : val,
    z.string().min(1).optional()
  ),
  avatar_url: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
});

// ============================================================================
// Payment Schemas
// ============================================================================

export const paymentMethodSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.enum(['card', 'bank_account', 'wallet']),
  last_four: z.string().length(4).optional(),
  brand: z.string().optional(),
  is_default: z.boolean(),
  created_at: z.string().datetime(),
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']),
  payment_method_id: z.string().uuid(),
  created_at: z.string().datetime(),
  completed_at: z.string().datetime().nullable().optional(),
});

// ============================================================================
// Notification Schemas
// ============================================================================

export const notificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  is_read: z.boolean().default(false),
  data: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
});

// ============================================================================
// Wiwebb Schemas - Hotspot Management
// ============================================================================

export const tenantSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  url: z.string().nullable().optional(),
  uuid: z.string().uuid(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const hotspotSchema = z.object({
  id: z.number(),
  name: z.string(),
  tenant_id: z.number(),
  tenant_name: z.string().optional(),
  status: z.enum(['Online', 'Offline']).default('Offline'),
  clients: z.number().default(0),
  bandwidth: z.string().optional(),
  uptime: z.string().optional(),
  mac_address: z.string().optional(),
  bandwidth_limit: z.number().optional(),
  security_type: z.string().default('Captive Portal'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const createHotspotSchema = z.object({
  name: z.string().min(1, 'Hotspot name is required'),
  tenant_id: z.number().optional(),
  mac_address: z.string().optional(),
  bandwidth_limit: z.number().optional(),
  security_type: z.string().optional(),
});

// ============================================================================
// RADIUS Schemas
// ============================================================================

export const radiusUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  attribute: z.string().optional(),
  op: z.string().optional(),
  value: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export const radiusGroupSchema = z.object({
  id: z.number(),
  groupname: z.string(),
  attribute: z.string(),
  op: z.string(),
  value: z.string(),
});

export const radiusSessionSchema = z.object({
  radacctid: z.number(),
  acctsessionid: z.string(),
  username: z.string(),
  nasipaddress: z.string(),
  acctstarttime: z.string().datetime(),
  acctstoptime: z.string().datetime().nullable().optional(),
  acctsessiontime: z.number().nullable().optional(),
  acctinputoctets: z.number().nullable().optional(),
  acctoutputoctets: z.number().nullable().optional(),
});

export const createRadiusUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  groupname: z.string().optional(),
});

// ============================================================================
// Subscription & Billing Schemas
// ============================================================================

export const planSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  default: z.boolean().default(false),
  available: z.boolean().default(true),
  requires_payment: z.boolean().default(false),
  daily_time_minutes: z.number().nullable().optional(),
  daily_data_mb: z.number().nullable().optional(),
  stripe_product_id: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const planPricingSchema = z.object({
  id: z.number(),
  plan: z.number(),
  amount: z.number(),
  currency: z.string().default('USD'),
  interval: z.enum(['day', 'week', 'month', 'year']),
  trial_period_days: z.number().nullable().optional(),
  stripe_price_id: z.string().nullable().optional(),
});

export const subscriptionSchema = z.object({
  id: z.number(),
  user: z.number(),
  plan: z.number(),
  status: z.string(),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  cancel_at_period_end: z.boolean().default(false),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const paymentGatewaySchema = z.object({
  variant: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export const wiwebbPaymentSchema = z.object({
  id: z.number(),
  user: z.number(),
  status: z.string(),
  variant: z.string(),
  currency: z.string(),
  total: z.number(),
  order_id: z.string().nullable().optional(),
  payment_gateway: z.string().nullable().optional(),
  created: z.string().datetime(),
  modified: z.string().datetime(),
});

export const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  payment_gateway: z.string(),
  description: z.string().optional(),
});

// ============================================================================
// Dashboard Schemas
// ============================================================================

export const dashboardStatsSchema = z.object({
  total_tenants: z.number().default(0),
  active_hotspots: z.number().default(0),
  total_users: z.number().default(0),
  monthly_revenue: z.number().default(0),
});

// ============================================================================
// Helper function to validate data against schema
// ============================================================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function validateSchemaAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parseAsync(data);
}
