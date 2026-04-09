import { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { SimulatorControls } from './components/SimulatorControls';
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

// Maps network state → best matching scenario per screen.
// If no mapping exists, the current scenario stays unchanged.
const NETWORK_SCENARIO_MAP: Partial<Record<ScreenId, Partial<Record<NetworkState, string>>>> = {
  'domain-select':     { offline: 'offline',          slow: 'happy',         good: 'happy' },
  'salesforce-login':  { offline: 'network-drops',    slow: 'slow-loading',  good: 'happy' },
  'auth-loading':      { offline: 'connection-drops', slow: 'slow-3g',       good: 'happy' },
  'offline-sync':      { offline: 'network-lost',     slow: 'happy',         good: 'happy' },
  'access-modal':      { offline: 'network-error',    slow: 'server-error',  good: 'permission-error' },
  'biometric':         { offline: 'slow-network',     slow: 'slow-network',  good: 'auto-login' },
  'logout':            { offline: 'session-expired',  slow: 'voluntary',     good: 'voluntary' },
  'deep-link':         { offline: 'auth-fails',       slow: 'needs-login',   good: 'happy' },
};

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [networkState, setNetworkState] = useState<NetworkState>('good');
  const [userContext, setUserContext] = useState<UserContext>('returning');
  const [copyMode, setCopyMode] = useState<CopyMode>('proposed');
  const [scenario, setScenario] = useState(SCREENS[0].scenarios[0]);

  const handleScreenChange = (index: number) => {
    setScreenIndex(index);
    const screen = SCREENS[index];
    // When switching screen, pick scenario based on current network state if mapped
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
    // If no mapping, keep current scenario unchanged
  };

  const ScreenComponent = SCREEN_COMPONENTS[screenIndex];

  return (
    <>
      <SimulatorControls
        currentScreenIndex={screenIndex}
        networkState={networkState}
        userContext={userContext}
        copyMode={copyMode}
        scenario={scenario}
        onScreenChange={handleScreenChange}
        onNetworkChange={handleNetworkChange}
        onUserContextChange={setUserContext}
        onCopyModeChange={setCopyMode}
        onScenarioChange={setScenario}
      />

      <MobileFrame>
        <ScreenComponent
          key={`${screenIndex}-${scenario}-${copyMode}-${userContext}`}
          scenario={scenario}
          networkState={networkState}
          userContext={userContext}
          copyMode={copyMode}
        />
      </MobileFrame>
    </>
  );
}

export default App;
