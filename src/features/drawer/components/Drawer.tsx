import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CollapsibleDrawerMenuItem } from "./CollapsibleDrawerMenuItem";
import { DrawerMenuItem } from "./DrawerMenuItem";
import { DrawerProfileSection } from "./DrawerProfileSection";
import { useDrawerNavigation } from "../hooks/useDrawerNavigation";

const DRAWER_WIDTH = Dimensions.get("window").width;

export interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string;
  userPhone?: string;
  userAvatarUrl?: string;
}

export function Drawer({
  visible,
  onClose,
  userEmail,
  userPhone,
  userAvatarUrl,
}: DrawerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const translateX = useSharedValue(-DRAWER_WIDTH);

  const {
    vpnExpanded,
    organizationsExpanded,
    monitoringExpanded,
    radiusExpanded,
    subscriptionsExpanded,
    certificatesExpanded,
    ipamExpanded,
    helpExpanded,
    toggleVpn,
    toggleOrganizations,
    toggleMonitoring,
    toggleRadius,
    toggleSubscriptions,
    toggleCertificates,
    toggleIpam,
    toggleHelp,
    isActive,
    isVpnActive,
    isOrganizationsActive,
    isMonitoringActive,
    isRadiusActive,
    isSubscriptionsActive,
    isCertificatesActive,
    isIpamActive,
    isHelpActive,
  } = useDrawerNavigation();

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(-DRAWER_WIDTH, { duration: 300 });
    }
  }, [visible, translateX]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateX = event.translationX;
      if (newTranslateX <= 0) {
        translateX.value = newTranslateX;
      }
    })
    .onEnd((event) => {
      const shouldClose = event.translationX < -100 || event.velocityX < -500;
      if (shouldClose) {
        translateX.value = withTiming(-DRAWER_WIDTH, { duration: 300 });
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleSignOut = () => {
    onClose();
    setTimeout(async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Sign out error:", error);
      }
    }, 300);
  };

  if (!visible && Platform.OS !== "web") {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.drawer,
            {
              shadowColor: theme.colors.shadow,
              width: DRAWER_WIDTH,
              backgroundColor: theme.colors.background,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            drawerAnimatedStyle,
          ]}
        >
          {/* Close Button */}
          <View
            style={[
              styles.closeButtonContainer,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.md,
              },
            ]}
          >
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close menu"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Section */}
            <DrawerProfileSection
              userPhone={userPhone}
              userEmail={userEmail}
              userAvatarUrl={userAvatarUrl}
              onClose={onClose}
            />

            {/* Dashboard */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.md }]}>
              <DrawerMenuItem
                icon="view-dashboard"
                title="Dashboard"
                onPress={() => handleNavigation("/(drawer)/home")}
                isActive={isActive("/(drawer)/home")}
              />
            </View>

            {/* VPN Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="shield-check"
                title="VPN"
                isActive={isVpnActive()}
                isExpanded={vpnExpanded}
                onToggle={toggleVpn}
              >
                <DrawerMenuItem
                  icon="account-plus"
                  title="Client"
                  onPress={() => handleNavigation("/(drawer)/vpn/client")}
                  isChild
                  isActive={isActive("/(drawer)/vpn/client")}
                />
                <DrawerMenuItem
                  icon="source-branch"
                  title="Site-to-site"
                  onPress={() => handleNavigation("/(drawer)/vpn/site-to-site")}
                  isChild
                  isActive={isActive("/(drawer)/vpn/site-to-site")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Organizations Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="office-building"
                title="Groups & Organizations"
                isActive={isOrganizationsActive()}
                isExpanded={organizationsExpanded}
                onToggle={toggleOrganizations}
              >
                <DrawerMenuItem
                  icon="office-building"
                  title="Organizations"
                  onPress={() => handleNavigation("/(drawer)/organizations")}
                  isChild
                  isActive={isActive("/(drawer)/organizations")}
                />
                <DrawerMenuItem
                  icon="shield-account"
                  title="Groups & Permissions"
                  onPress={() => handleNavigation("/(drawer)/organizations/groups-permissions")}
                  isChild
                  isActive={isActive("/(drawer)/organizations/groups-permissions")}
                />
                <DrawerMenuItem
                  icon="account-group"
                  title="Organization Users"
                  onPress={() => handleNavigation("/(drawer)/organizations/users")}
                  isChild
                  isActive={isActive("/(drawer)/organizations/users")}
                />
                <DrawerMenuItem
                  icon="account-multiple"
                  title="Users"
                  onPress={() => handleNavigation("/(drawer)/users")}
                  isChild
                  isActive={isActive("/(drawer)/users")}
                />
                <DrawerMenuItem
                  icon="domain"
                  title="Tenants"
                  onPress={() => handleNavigation("/(drawer)/tenants")}
                  isChild
                  isActive={isActive("/(drawer)/tenants")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Monitoring Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="chart-line"
                title="Monitoring"
                isActive={isMonitoringActive()}
                isExpanded={monitoringExpanded}
                onToggle={toggleMonitoring}
              >
                <DrawerMenuItem
                  icon="wifi"
                  title="Hotspots"
                  onPress={() => handleNavigation("/(drawer)/monitoring/hotspots")}
                  isChild
                  isActive={isActive("/(drawer)/monitoring/hotspots")}
                />
                <DrawerMenuItem
                  icon="chart-bar"
                  title="Reports"
                  onPress={() => handleNavigation("/(drawer)/monitoring/reports")}
                  isChild
                  isActive={isActive("/(drawer)/monitoring/reports")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Subscriptions Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="wallet"
                title="Subscriptions"
                isActive={isSubscriptionsActive()}
                isExpanded={subscriptionsExpanded}
                onToggle={toggleSubscriptions}
              >
                <DrawerMenuItem
                  icon="layers"
                  title="Plans"
                  onPress={() => handleNavigation("/(drawer)/subscriptions/plans")}
                  isChild
                  isActive={isActive("/(drawer)/subscriptions/plans")}
                />
                <DrawerMenuItem
                  icon="credit-card"
                  title="Billing"
                  onPress={() => handleNavigation("/(drawer)/billing")}
                  isChild
                  isActive={isActive("/(drawer)/billing")}
                />
                <DrawerMenuItem
                  icon="cash-multiple"
                  title="Payments"
                  onPress={() => handleNavigation("/(drawer)/subscriptions/payments")}
                  isChild
                  isActive={isActive("/(drawer)/subscriptions/payments")}
                />
                <DrawerMenuItem
                  icon="credit-card-outline"
                  title="Payment Methods"
                  onPress={() => handleNavigation("/(drawer)/payment-methods")}
                  isChild
                  isActive={isActive("/(drawer)/payment-methods")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* RADIUS Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="wifi"
                title="RADIUS"
                isActive={isRadiusActive()}
                isExpanded={radiusExpanded}
                onToggle={toggleRadius}
              >
                <DrawerMenuItem
                  icon="account-multiple"
                  title="Users"
                  onPress={() => handleNavigation("/(drawer)/radius/users")}
                  isChild
                  isActive={isActive("/(drawer)/radius/users")}
                />
                <DrawerMenuItem
                  icon="shield-account"
                  title="Groups"
                  onPress={() => handleNavigation("/(drawer)/radius/groups")}
                  isChild
                  isActive={isActive("/(drawer)/radius/groups")}
                />
                <DrawerMenuItem
                  icon="file-document"
                  title="Accounting"
                  onPress={() => handleNavigation("/(drawer)/radius/accounting")}
                  isChild
                  isActive={isActive("/(drawer)/radius/accounting")}
                />
                <DrawerMenuItem
                  icon="chart-line"
                  title="Active Sessions"
                  onPress={() => handleNavigation("/(drawer)/radius/sessions")}
                  isChild
                  isActive={isActive("/(drawer)/radius/sessions")}
                />
                <DrawerMenuItem
                  icon="server"
                  title="NAS Devices"
                  onPress={() => handleNavigation("/(drawer)/radius/nas-devices")}
                  isChild
                  isActive={isActive("/(drawer)/radius/nas-devices")}
                />
                <DrawerMenuItem
                  icon="account-multiple-plus"
                  title="Batch User Creation"
                  onPress={() => handleNavigation("/(drawer)/radius/batch-user-creation")}
                  isChild
                  isActive={isActive("/(drawer)/radius/batch-user-creation")}
                />
                <DrawerMenuItem
                  icon="text-box"
                  title="Post Auth Log"
                  onPress={() => handleNavigation("/(drawer)/radius/post-auth-log")}
                  isChild
                  isActive={isActive("/(drawer)/radius/post-auth-log")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Certificates Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="certificate"
                title="CAs & Certificates"
                isActive={isCertificatesActive()}
                isExpanded={certificatesExpanded}
                onToggle={toggleCertificates}
              >
                <DrawerMenuItem
                  icon="shield-check"
                  title="Certification Authorities"
                  onPress={() => handleNavigation("/(drawer)/certs/authorities")}
                  isChild
                  isActive={isActive("/(drawer)/certs/authorities")}
                />
                <DrawerMenuItem
                  icon="certificate-outline"
                  title="Certificates"
                  onPress={() => handleNavigation("/(drawer)/certs/certificates")}
                  isChild
                  isActive={isActive("/(drawer)/certs/certificates")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* IPAM Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="web"
                title="IPAM"
                isActive={isIpamActive()}
                isExpanded={ipamExpanded}
                onToggle={toggleIpam}
              >
                <DrawerMenuItem
                  icon="ip-network"
                  title="IP Addresses"
                  onPress={() => handleNavigation("/(drawer)/ipam/ip-addresses")}
                  isChild
                  isActive={isActive("/(drawer)/ipam/ip-addresses")}
                />
                <DrawerMenuItem
                  icon="source-branch"
                  title="Subnets"
                  onPress={() => handleNavigation("/(drawer)/ipam/subnets")}
                  isChild
                  isActive={isActive("/(drawer)/ipam/subnets")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Security */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <DrawerMenuItem
                icon="shield"
                title="Security"
                onPress={() => handleNavigation("/(drawer)/security")}
                isActive={isActive("/(drawer)/security")}
              />
            </View>

            {/* Help Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.xs }]}>
              <CollapsibleDrawerMenuItem
                icon="lifebuoy"
                title="Help"
                isActive={isHelpActive()}
                isExpanded={helpExpanded}
                onToggle={toggleHelp}
              >
                <DrawerMenuItem
                  icon="headset"
                  title="Contact Support"
                  onPress={() => handleNavigation("/(drawer)/help/contact-support")}
                  isChild
                  isActive={isActive("/(drawer)/help/contact-support")}
                />
                <DrawerMenuItem
                  icon="book-open-variant"
                  title="Documentation"
                  onPress={() => handleNavigation("/(drawer)/help/documentation")}
                  isChild
                  isActive={isActive("/(drawer)/help/documentation")}
                />
                <DrawerMenuItem
                  icon="information"
                  title="System Info"
                  onPress={() => handleNavigation("/(drawer)/help/system-info")}
                  isChild
                  isActive={isActive("/(drawer)/help/system-info")}
                />
              </CollapsibleDrawerMenuItem>
            </View>

            {/* Account Section */}
            <View style={[styles.menuSection, { marginTop: theme.spacing.md }]}>
              <ThemedText style={[styles.sectionTitle, { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.xs, opacity: 0.6 }]}>
                Account
              </ThemedText>
              <DrawerMenuItem
                icon="account"
                title="Profile"
                onPress={() => handleNavigation("/(drawer)/profile")}
                isActive={isActive("/(drawer)/profile")}
              />
              <DrawerMenuItem
                icon="cog"
                title="Settings"
                onPress={() => handleNavigation("/(drawer)/settings")}
                isActive={isActive("/(drawer)/settings")}
              />
              <DrawerMenuItem
                icon="information-outline"
                title="Information"
                onPress={() => handleNavigation("/(drawer)/information")}
                isActive={isActive("/(drawer)/information")}
              />
            </View>

            {/* Sign Out */}
            <View
              style={[
                styles.signOutSection,
                {
                  marginTop: theme.spacing.xl,
                  marginBottom: theme.spacing.xl,
                  paddingHorizontal: theme.spacing.lg,
                  paddingBottom: theme.spacing.sm,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.signOutButton,
                  {
                    paddingVertical: theme.spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                  },
                ]}
                onPress={handleSignOut}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={theme.colors.error}
                />
                <View style={styles.signOutTextContainer}>
                  <ThemedText
                    style={[styles.signOutText, { color: theme.colors.error }]}
                  >
                    Sign Out
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2000,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 12,
  },
  closeButtonContainer: {
    alignItems: "flex-start",
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  menuSection: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  signOutSection: {
    // Sign out section styling
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  signOutTextContainer: {
    marginLeft: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
