Wiwebb Mobile App Migration Plan

     Overview

     Transform the current mobile app into the Wiwebb WiFi Hotspot Manager mobile app by 
     migrating from Supabase to Django backend and implementing WiFi management features.

     Phase 1: Backend Migration (Django Integration)

     1. Replace Supabase with Django Authentication
       - Update /src/lib/httpClient.ts to point to Django API (http://127.0.0.1:8000/api/v1)
       - Replace Supabase client with Django REST API client
       - Update /src/api/auth.api.ts to use Django auth endpoints (/auth/login/, 
     /auth/registration/)
       - Update token storage to use Django token format
       - Remove Supabase dependencies
     2. Update API Layer
       - Create new API modules for wiwebb features:
           - /src/api/tenants.api.ts - Tenant management
         - /src/api/hotspots.api.ts - WiFi hotspot operations
         - /src/api/radius.api.ts - RADIUS user management
         - /src/api/subscriptions.api.ts - Plans and subscriptions
         - /src/api/payments.api.ts - Payment processing
       - Update schemas in /src/api/schemas.ts for Django models
       - Update query keys in /src/api/queryKeys.ts
     3. Update Authentication Context
       - Modify /src/context/ApiContext.tsx to work with Django sessions
       - Update auth state management to handle Django user model (role, tenant, etc.)
       - Implement role-based access control

     Phase 2: Theme & Branding Updates

     1. Update Theme Colors
       - Modify /src/constants/theme.ts to match wiwebb webapp color scheme
       - Extract colors from webapp's Tailwind config/CSS variables
       - Keep current assets (logo, splash screen) unchanged

     Phase 3: Core Feature Implementation

     3.1 Dashboard Screen (Replace Home)

     - Replace /app/(drawer)/home.tsx with wiwebb dashboard
     - Implement statistics cards: Total Tenants, Active Hotspots, Total Users, Revenue
     - Add system health monitoring widget
     - Create charts using a React Native chart library (react-native-chart-kit)
     - Add recent activity list

     3.2 Hotspot Management

     - Create /app/(drawer)/hotspots/index.tsx - Hotspot list screen
     - Create /app/(drawer)/hotspots/[id].tsx - Hotspot detail screen
     - Create /app/(drawer)/hotspots/add.tsx - Add hotspot screen
     - Implement features:
       - View all hotspots with status indicators
       - Monitor connected clients
       - Track bandwidth usage
       - View uptime statistics
       - Add/edit/delete hotspots
       - Filter by tenant (for admins)

     3.3 RADIUS User Management

     - Create /app/(drawer)/radius/users.tsx - RADIUS users list
     - Create /app/(drawer)/radius/users/add.tsx - Add user screen
     - Create /app/(drawer)/radius/sessions.tsx - Active sessions screen
     - Create /app/(drawer)/radius/accounting.tsx - Accounting/usage data
     - Implement features:
       - Create WiFi users with credentials
       - View active sessions
       - Track data usage
       - Manage user groups

     3.4 Subscriptions & Billing

     - Create /app/(drawer)/subscriptions/plans.tsx - View plans
     - Create /app/(drawer)/subscriptions/billing.tsx - Billing dashboard
     - Create /app/(drawer)/subscriptions/payments.tsx - Payment history
     - Integrate payment gateway (Stripe/Flutterwave/Paystack)
     - Implement WebView for payment checkout
     - Handle payment success/failure redirects

     3.5 Organizations & Tenants (Admin Only)

     - Create /app/(drawer)/organizations/index.tsx - Organization list
     - Create /app/(drawer)/organizations/tenants.tsx - Tenant management
     - Create /app/(drawer)/organizations/users.tsx - User management
     - Role-based visibility (SuperAdmin/Admin only)

     Phase 4: Navigation Updates

     1. Update Drawer Navigation
       - Modify /src/components/drawer.tsx with new menu structure:
           - Dashboard
         - Hotspots
         - RADIUS (submenu: Users, Sessions, Accounting)
         - Subscriptions (submenu: Plans, Billing, Payments)
         - Organizations (admin only)
         - Profile
         - Settings
       - Add role-based menu visibility
       - Remove ride-booking related items
     2. Update AppBar
       - Modify /src/components/app-bar.tsx to show tenant context
       - Add role indicator badge
       - Add notifications icon (for alerts)

     Phase 5: Shared Components

     1. Create Wiwebb-Specific Components
       - StatCard.tsx - Dashboard statistic card
       - HotspotCard.tsx - Hotspot status display
       - StatusBadge.tsx - Status indicators (Online/Offline)
       - UsageChart.tsx - Data usage visualization
       - PlanCard.tsx - Subscription plan display
       - RoleBasedView.tsx - Conditional rendering based on role

     Phase 6: State Management Updates

     1. Update Contexts
       - Modify ApiContext to include tenant information
       - Add TenantContext for multi-tenancy support
       - Remove PaymentContext (replace with Django API calls)
     2. Add Custom Hooks
       - useHotspots.ts - Hotspot data fetching
       - useRadiusUsers.ts - RADIUS user management
       - useSubscription.ts - Subscription state
       - useTenant.ts - Current tenant information
       - useRole.ts - User role utilities

     Phase 7: Configuration Updates

     1. Update Environment Variables
       - Add EXPO_PUBLIC_API_BASE_URL for Django backend
       - Remove Supabase variables
       - Add payment gateway keys (if needed)
     2. Update App Configuration
       - Modify app.config.js: Update app name to "Wiwebb"
       - Keep current bundle IDs unchanged
       - Update app description

     Phase 8: Testing & Refinement

     1. Test authentication flow end-to-end
     2. Verify role-based access control
     3. Test all CRUD operations
     4. Verify payment flow with test cards
     5. Test on both iOS and Android
     6. Handle offline scenarios
     7. Add loading states and error handling

     Implementation Order

     1. Backend migration (Phase 1) - CRITICAL PATH
     2. Theme updates (Phase 2) - Quick win
     3. Dashboard (Phase 3.1) - User-facing priority
     4. Hotspot management (Phase 3.2) - Core feature
     5. RADIUS users (Phase 3.3) - Core feature
     6. Subscriptions (Phase 3.4) - Revenue feature
     7. Organizations (Phase 3.5) - Admin feature
     8. Navigation updates (Phase 4)
     9. Components & hooks (Phases 5-6)
     10. Configuration (Phase 7)
     11. Testing (Phase 8)

     Estimated Complexity

     - Backend Migration: High complexity (authentication critical)
     - Feature Implementation: Medium-high (4 major feature sets)
     - UI Components: Medium (can leverage React Native Paper)
     - Testing: Medium (comprehensive but straightforward)

     Key Risks & Mitigations

     - Risk: Django CORS issues with mobile app
       - Mitigation: Configure django-cors-headers properly
     - Risk: Token refresh handling
       - Mitigation: Implement interceptor with token refresh logic
     - Risk: Payment gateway mobile integration
       - Mitigation: Use WebView for checkout, handle deep links
     - Risk: Role-based features not tested
       - Mitigation: Create test users for each role

     Dependencies to Add

     - react-native-chart-kit or react-native-svg-charts for charts
     - Remove @supabase/supabase-js

     Dependencies to Remove

     - @supabase/supabase-js
     - Related Supabase types/utils
