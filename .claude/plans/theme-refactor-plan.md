Complete Theme System Refactor

 Phase 1: Extend Theme Configuration (src/constants/theme.ts)

 1. Add missing color properties:
   - disabled, buttonText, buttonTextDisabled
   - info semantic color
   - backdrop for modals
   - Component-specific colors as needed
 2. Add missing spacing values (2px, 6px, 48px, 64px)
 3. Add shadow utility function that returns platform-specific shadow styles
 4. Ensure all opacity values are documented

 Phase 2: Integrate React Native Paper Theme (app/_layout.tsx)

 1. Create custom Paper themes (light + dark) that merge:
   - Paper's MD3 color system with your brand colors
   - Map custom theme colors to Paper's color slots
 2. Replace default MD3DarkTheme/MD3LightTheme with custom themes
 3. Ensure Paper components automatically use brand colors

 Phase 3: Fix ThemedText Component (src/components/themed-text.tsx)

 1. Replace hardcoded typography with theme.typography values
 2. Map component variants to theme typography (title→h1, subtitle→h3, etc.)
 3. Remove duplicate typography definitions

 Phase 4: Fix ThemedButton Component (src/components/ui/ThemedButton.tsx)

 1. Update to use new theme properties (disabled, buttonText)
 2. Remove references to non-existent theme properties
 3. Ensure proper theme integration for all variants

 Phase 5: Fix Critical Files (Zero theme usage)

 1. ErrorBoundary.tsx - Replace 8+ hardcoded colors with theme
 2. splash.tsx - Add theme support, handle dark mode
 3. Both files currently have NO theme integration

 Phase 6: Fix High-Impact Screens (10+ violations each)

 1. onboarding.tsx - Replace 10+ hardcoded colors
 2. home.tsx - Fix stat card colors, use theme
 3. support.tsx - Replace alert hardcoded colors
 4. safety.tsx - Replace button and text hardcoded colors

 Phase 7: Fix Medium-Impact Files (1-5 violations)

 1. HotspotCard.tsx - Use theme.colors.success instead of hardcoded
 2. NotificationModal.tsx - Remove hardcoded fallbacks and shadows
 3. payment-methods.tsx - Replace border colors
 4. radius/sessions.tsx - Fix hardcoded colors
 5. Avatar.tsx - Fix 3 hardcoded colors
 6. drawer.tsx - Fix rgba values
 7. OnboardingResetButton.tsx - Fix 2 colors
 8. ClearAsyncStorageButton.tsx - Fix 2 colors
 9. src/features/payments/ files - Fix borders/overlays

 Phase 8: Fix Remaining Hardcoded Values

 1. Replace all hardcoded opacity values with theme.opacity
 2. Replace all shadowColor: '#000' with theme-based shadows
 3. Search and replace common hardcoded colors:
   - #10b981 → theme.colors.success (15+ occurrences)
   - #f59e0b → theme.colors.warning (10+ occurrences)
   - rgba(0,0,0,0.5) → theme.colors.backdrop

 Phase 9: Create Theme Utilities

 1. Create getShadow() utility for theme-aware shadows
 2. Create getOverlay() utility for modal backdrops
 3. Create color manipulation utilities (lighten, darken, alpha)

 Phase 10: Testing & Validation

 1. Test light mode rendering
 2. Test dark mode rendering
 3. Verify all Paper components use brand colors
 4. Check for remaining hardcoded values
 5. Test on iOS and Android

 Files to modify: ~25 files
 Estimated time: 18-26 hours
 Result: Fully consistent theme system with zero hardcoded colors
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌