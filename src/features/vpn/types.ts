export interface VpnClient {
  id: string;
  name: string;
  email: string;
  ipAddress: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastConnected?: string;
}

export interface VpnSiteToSite {
  id: string;
  name: string;
  localSubnet: string;
  remoteSubnet: string;
  remoteGateway: string;
  status: 'connected' | 'disconnected' | 'error';
  uptime?: string;
  bytesReceived?: number;
  bytesSent?: number;
}
