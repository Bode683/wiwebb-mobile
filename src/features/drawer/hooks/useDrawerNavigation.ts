import { usePathname } from 'expo-router';
import { useState, useEffect } from 'react';

export function useDrawerNavigation() {
  const pathname = usePathname();

  // State for each expandable section
  const [vpnExpanded, setVpnExpanded] = useState(false);
  const [organizationsExpanded, setOrganizationsExpanded] = useState(false);
  const [monitoringExpanded, setMonitoringExpanded] = useState(false);
  const [radiusExpanded, setRadiusExpanded] = useState(false);
  const [subscriptionsExpanded, setSubscriptionsExpanded] = useState(false);
  const [certificatesExpanded, setCertificatesExpanded] = useState(false);
  const [ipamExpanded, setIpamExpanded] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);

  // Initialize expanded states based on current route
  useEffect(() => {
    setVpnExpanded(pathname.startsWith('/(drawer)/vpn'));
    setOrganizationsExpanded(
      pathname.startsWith('/(drawer)/organizations') ||
      pathname === '/(drawer)/users' ||
      pathname === '/(drawer)/tenants'
    );
    setMonitoringExpanded(pathname.startsWith('/(drawer)/monitoring'));
    setRadiusExpanded(pathname.startsWith('/(drawer)/radius'));
    setSubscriptionsExpanded(
      pathname.startsWith('/(drawer)/subscriptions') ||
      pathname === '/(drawer)/billing'
    );
    setCertificatesExpanded(pathname.startsWith('/(drawer)/certs'));
    setIpamExpanded(pathname.startsWith('/(drawer)/ipam'));
    setHelpExpanded(pathname.startsWith('/(drawer)/help'));
  }, [pathname]);

  // Helper to check if a route is active
  const isActive = (path: string) => pathname === path;

  // Helper to check if a section is active
  const isVpnActive = () => pathname.startsWith('/(drawer)/vpn');
  const isOrganizationsActive = () =>
    pathname.startsWith('/(drawer)/organizations') ||
    pathname === '/(drawer)/users' ||
    pathname === '/(drawer)/tenants';
  const isMonitoringActive = () => pathname.startsWith('/(drawer)/monitoring');
  const isRadiusActive = () => pathname.startsWith('/(drawer)/radius');
  const isSubscriptionsActive = () =>
    pathname.startsWith('/(drawer)/subscriptions') ||
    pathname === '/(drawer)/billing';
  const isCertificatesActive = () => pathname.startsWith('/(drawer)/certs');
  const isIpamActive = () => pathname.startsWith('/(drawer)/ipam');
  const isHelpActive = () => pathname.startsWith('/(drawer)/help');

  return {
    // Expanded states
    vpnExpanded,
    organizationsExpanded,
    monitoringExpanded,
    radiusExpanded,
    subscriptionsExpanded,
    certificatesExpanded,
    ipamExpanded,
    helpExpanded,

    // Toggle functions
    toggleVpn: () => setVpnExpanded(!vpnExpanded),
    toggleOrganizations: () => setOrganizationsExpanded(!organizationsExpanded),
    toggleMonitoring: () => setMonitoringExpanded(!monitoringExpanded),
    toggleRadius: () => setRadiusExpanded(!radiusExpanded),
    toggleSubscriptions: () => setSubscriptionsExpanded(!subscriptionsExpanded),
    toggleCertificates: () => setCertificatesExpanded(!certificatesExpanded),
    toggleIpam: () => setIpamExpanded(!ipamExpanded),
    toggleHelp: () => setHelpExpanded(!helpExpanded),

    // Active state helpers
    isActive,
    isVpnActive,
    isOrganizationsActive,
    isMonitoringActive,
    isRadiusActive,
    isSubscriptionsActive,
    isCertificatesActive,
    isIpamActive,
    isHelpActive,
  };
}
