import { useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useConnectivityConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { LowConnectivityBanner } from './components/LowConnectivityBanner';
import { ConnectivityBottomSheet } from './components/ConnectivityBottomSheet';
import { HomeScreen } from './screens/HomeScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import type { ConnectionQuality } from './hooks/useNetworkSpeed';

type Screen = 'home' | 'job';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [demoQuality, setDemoQuality] = useState<ConnectionQuality | null>('slow');
  const [sheetOpen, setSheetOpen] = useState(false);

  const isLowConnectivity = demoQuality === 'slow' || demoQuality === 'very-slow';

  const handleQualityChange = (q: ConnectionQuality | null) => {
    setDemoQuality(q);
    setScreen('home');
    setSheetOpen(false);
  };

  const configuratorConfig = useConnectivityConfiguratorConfig({
    screen,
    demoQuality,
    onScreenChange: setScreen,
    onQualityChange: handleQualityChange,
  });

  const banner = (
    <LowConnectivityBanner
      onPress={() => isLowConnectivity && setSheetOpen(true)}
      overrideQuality={demoQuality}
    />
  );

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen banner={banner} onItemPress={() => setScreen('job')} />;
      case 'job':
        return <JobDetailScreen onBack={() => setScreen('home')} banner={banner} />;
    }
  };

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      <MobileFrame>
        {renderScreen()}
        {isLowConnectivity && (
          <ConnectivityBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
        )}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
