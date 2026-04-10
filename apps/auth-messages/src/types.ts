export type NetworkState = 'good' | 'slow' | 'offline';
export type UserContext = 'first-time' | 'returning';
export type CopyMode = 'current' | 'proposed';

export type ScreenId =
  | 'reset'
  | 'domain-select'
  | 'salesforce-login'
  | 'vault-modal'
  | 'login-success'
  | 'auth-loading'
  | 'offline-sync'
  | 'access-modal'
  | 'biometric'
  | 'logout'
  | 'deep-link';

export interface ScreenDef {
  id: ScreenId;
  name: string;
  scenarios: string[];
}

export interface ScreenProps {
  scenario: string;
  networkState: NetworkState;
  userContext: UserContext;
  copyMode: CopyMode;
}

export const SCREENS: ScreenDef[] = [
  { id: 'reset', name: 'ResetScreen', scenarios: ['happy', 'corrupted-session', 'slow-device'] },
  { id: 'domain-select', name: 'DomainSelect', scenarios: ['happy', 'offline', 'offline-no-accounts'] },
  { id: 'salesforce-login', name: 'Salesforce Login', scenarios: ['happy', 'slow-loading', 'network-drops', 'oauth-denied', 'auto-login'] },
  { id: 'vault-modal', name: 'VaultModal', scenarios: ['happy', 'device-not-secure', 'biometric-cancelled', 'biometric-error'] },
  { id: 'login-success', name: 'LoginSuccess', scenarios: ['happy', 'validation-hangs', 'access-denied'] },
  { id: 'auth-loading', name: 'AuthLoadingScreenV2', scenarios: ['happy', 'slow-3g', 'connection-drops', 'session-expired', 'timeout'] },
  { id: 'offline-sync', name: 'OfflineSyncModal', scenarios: ['happy', 'phase-fails', 'all-fail', 'network-lost'] },
  { id: 'access-modal', name: 'AccessModal', scenarios: ['permission-error', 'api-disabled', 'server-error', 'network-error'] },
  { id: 'biometric', name: 'Biometric / Auto-Login', scenarios: ['auto-login', 'not-enrolled', 'cancelled', 'error', 'slow-network'] },
  { id: 'logout', name: 'Logout', scenarios: ['voluntary', 'pending-uploads', 'session-expired', 'pre-expiry-warning'] },
  { id: 'deep-link', name: 'DeepLinkTunnel', scenarios: ['happy', 'needs-login', 'auth-fails', 'expired-session'] },
];
