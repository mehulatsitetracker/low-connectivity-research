import { useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useAuthConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { SCREENS, type NetworkState, type UserContext, type CopyMode, type ScreenId } from './types';

// Screen imports
import { ResetScreen } from './screens/ResetScreen';
import { DomainSelectScreen } from './screens/DomainSelectScreen';
import { SalesforceLoginScreen } from './screens/SalesforceLoginScreen';
import { VaultModalScreen } from './screens/VaultModalScreen';
import { LoginSuccessScreen } from './screens/LoginSuccessScreen';
import { AuthLoadingScreen } from './screens/AuthLoadingScreen';
import { OfflineSyncScreen } from './screens/OfflineSyncScreen';
import { AccessModalScreen } from './screens/AccessModalScreen';
import { BiometricScreen } from './screens/BiometricScreen';
import { LogoutScreen } from './screens/LogoutScreen';
import { DeepLinkScreen } from './screens/DeepLinkScreen';

const SCREEN_COMPONENTS = [
  ResetScreen,
  DomainSelectScreen,
  SalesforceLoginScreen,
  VaultModalScreen,
  LoginSuccessScreen,
  AuthLoadingScreen,
  OfflineSyncScreen,
  AccessModalScreen,
  BiometricScreen,
  LogoutScreen,
  DeepLinkScreen,
] as const;

const NETWORK_SCENARIO_MAP: Partial<Record<ScreenId, Partial<Record<NetworkState, string>>>> = {
  'reset':             {                                slow: 'slow-device',       good: 'happy' },
  'domain-select':     { offline: 'offline',                                       good: 'happy' },
  'salesforce-login':  { offline: 'network-drops',      slow: 'slow-loading',      good: 'happy' },
  'login-success':     {                                slow: 'validation-hangs',  good: 'happy' },
  'auth-loading':      { offline: 'connection-drops',   slow: 'slow-3g',           good: 'happy' },
  'offline-sync':      { offline: 'network-lost',       slow: 'phase-fails',       good: 'happy' },
  'access-modal':      { offline: 'network-error',      slow: 'server-error',      good: 'permission-error' },
  'biometric':         {                                slow: 'slow-network',      good: 'auto-login' },
  'logout':            { offline: 'session-expired',                               good: 'voluntary' },
  'deep-link':         { offline: 'auth-fails',                                    good: 'happy' },
};

function inferNetworkFromScenario(screenId: ScreenId, selectedScenario: string): NetworkState | null {
  const screenMap = NETWORK_SCENARIO_MAP[screenId];
  if (!screenMap) return null;
  for (const [net, scen] of Object.entries(screenMap) as [NetworkState, string][]) {
    if (scen === selectedScenario) return net;
  }
  return null;
}

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [networkState, setNetworkState] = useState<NetworkState>('good');
  const [userContext, setUserContext] = useState<UserContext>('returning');
  const [copyMode, setCopyMode] = useState<CopyMode>('proposed');
  const [scenario, setScenario] = useState(SCREENS[0].scenarios[0]);

  const handleScreenChange = (index: number) => {
    setScreenIndex(index);
    const screen = SCREENS[index];
    const mapped = NETWORK_SCENARIO_MAP[screen.id]?.[networkState];
    setScenario(mapped && screen.scenarios.includes(mapped) ? mapped : screen.scenarios[0]);
  };

  const handleNetworkChange = (net: NetworkState) => {
    setNetworkState(net);
    const screen = SCREENS[screenIndex];
    const mapped = NETWORK_SCENARIO_MAP[screen.id]?.[net];
    if (mapped && screen.scenarios.includes(mapped)) {
      setScenario(mapped);
    }
  };

  const handleScenarioChange = (newScenario: string) => {
    setScenario(newScenario);
    const screen = SCREENS[screenIndex];
    const inferred = inferNetworkFromScenario(screen.id, newScenario);
    if (inferred) {
      setNetworkState(inferred);
    }
  };

  const configuratorConfig = useAuthConfiguratorConfig({
    screenIndex,
    networkState,
    userContext,
    copyMode,
    scenario,
    onScreenChange: handleScreenChange,
    onNetworkChange: handleNetworkChange,
    onUserContextChange: setUserContext,
    onCopyModeChange: setCopyMode,
    onScenarioChange: handleScenarioChange,
  });

  const ScreenComponent = SCREEN_COMPONENTS[screenIndex];

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      <MobileFrame>
        <ScreenComponent
          key={`${screenIndex}-${scenario}-${copyMode}-${userContext}`}
          scenario={scenario}
          networkState={networkState}
          userContext={userContext}
          copyMode={copyMode}
        />
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
