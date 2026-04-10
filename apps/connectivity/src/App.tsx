import { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { LowConnectivityBanner } from './components/LowConnectivityBanner';
import { ConnectivityBottomSheet } from './components/ConnectivityBottomSheet';
import { HomeScreen } from './screens/HomeScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import type { ConnectionQuality } from './hooks/useNetworkSpeed';

type Screen = 'home' | 'job';

const STATES: { quality: ConnectionQuality; icon: string; label: string }[] = [
  { quality: 'good', icon: '\ud83d\udfe2', label: 'good' },
  { quality: 'slow', icon: '\ud83d\udfe1', label: 'slow network' },
  { quality: 'offline', icon: '\ud83d\udd34', label: 'offline' },
];

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [demoQuality, setDemoQuality] = useState<ConnectionQuality | null>('slow');
  const [sheetOpen, setSheetOpen] = useState(false);

  const isLowConnectivity = demoQuality === 'slow' || demoQuality === 'very-slow';

  const banner = (
    <LowConnectivityBanner
      onPress={() => isLowConnectivity && setSheetOpen(true)}
      overrideQuality={demoQuality}
    />
  );

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            banner={banner}
            onItemPress={() => setScreen('job')}
          />
        );
      case 'job':
        return (
          <JobDetailScreen
            onBack={() => setScreen('home')}
            banner={banner}
          />
        );
    }
  };

  return (
    <>
      {/* Simulator controls — outside phone frame */}
      <div style={{
        position: 'fixed', top: 16, left: 16, zIndex: 100,
        background: '#1a1a1a', borderRadius: 12, padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 200
      }}>
        <span style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'system-ui' }}>
          Simulate Network
        </span>
        {STATES.map(s => (
          <button key={s.quality} onClick={() => { setDemoQuality(demoQuality === s.quality ? null : s.quality); setScreen('home'); setSheetOpen(false); }} style={{
            padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
            background: demoQuality === s.quality ? '#333' : 'transparent',
            color: demoQuality === s.quality ? '#fff' : '#888',
            fontSize: 13, fontWeight: 500, fontFamily: 'system-ui'
          }}>{s.icon} {s.label}</button>
        ))}
      </div>

      <MobileFrame>
        {renderScreen()}
        {/* Bottom sheet — overlays current screen */}
        {isLowConnectivity && (
          <ConnectivityBottomSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
          />
        )}
      </MobileFrame>
    </>
  );
}

export default App;
