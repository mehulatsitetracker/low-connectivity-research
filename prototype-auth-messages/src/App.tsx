import { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { SimulatorControls } from './components/SimulatorControls';
import { SCREENS, type NetworkState, type UserContext, type CopyMode } from './types';

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

function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [networkState, setNetworkState] = useState<NetworkState>('good');
  const [userContext, setUserContext] = useState<UserContext>('returning');
  const [copyMode, setCopyMode] = useState<CopyMode>('proposed');
  const [scenario, setScenario] = useState(SCREENS[0].scenarios[0]);

  const handleScreenChange = (index: number) => {
    setScreenIndex(index);
    setScenario(SCREENS[index].scenarios[0]);
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
        onNetworkChange={setNetworkState}
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
