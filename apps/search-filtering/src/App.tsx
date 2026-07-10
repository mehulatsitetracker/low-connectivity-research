import { useState, useCallback } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { useConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { AllJobsScreen } from './screens/AllJobsScreen';
import { AllSitesScreen } from './screens/AllSitesScreen';
import { AllProjectsScreen } from './screens/AllProjectsScreen';
import { SCREENS } from './types';
import type { AppState, ScreenId, ActiveTab } from './types';

const INITIAL_STATE: AppState = {
  screen: 'home',
  activeTab: 'home',
  screenHistory: [],
};

function screenToIndex(screen: ScreenId): number {
  const idx = SCREENS.findIndex(s => s.id === screen);
  return idx >= 0 ? idx : 0;
}

function indexToScreen(index: number): ScreenId {
  return SCREENS[index]?.id ?? 'home';
}

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const navigateTo = useCallback((screen: ScreenId) => {
    setState(prev => ({
      ...prev,
      screen,
      screenHistory: [...prev.screenHistory, prev.screen],
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.screenHistory];
      const prevScreen = history.pop() || 'home';
      return { ...prev, screen: prevScreen, screenHistory: history };
    });
  }, []);

  const handleAction = useCallback((action: string) => {
    if (action === 'back') { goBack(); return; }
    if (action === 'go-all-jobs') { navigateTo('all-jobs'); return; }
    if (action === 'go-all-sites') { navigateTo('all-sites'); return; }
    if (action === 'go-all-projects') { navigateTo('all-projects'); return; }

    if (action.startsWith('tab-')) {
      const tab = action.replace('tab-', '') as ActiveTab;
      if (tab === 'home') {
        setState(prev => ({ ...prev, screen: 'home', activeTab: 'home', screenHistory: [] }));
      } else if (tab === 'menu') {
        setState(prev => ({ ...prev, screen: 'menu', activeTab: 'menu', screenHistory: [] }));
      } else {
        setState(prev => ({ ...prev, activeTab: tab }));
      }
      return;
    }
  }, [goBack, navigateTo]);

  const handleScreenChange = useCallback((index: number) => {
    const screen = indexToScreen(index);
    setState(prev => ({
      ...prev,
      screen,
      activeTab: screen === 'home' ? 'home' : screen === 'menu' ? 'menu' : prev.activeTab,
      screenHistory: [],
    }));
  }, []);

  const { configuratorConfig } = useConfiguratorConfig({
    screenIndex: screenToIndex(state.screen === 'menu' ? 'home' : state.screen),
    onScreenChange: handleScreenChange,
  });

  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen activeTab={state.activeTab} onAction={handleAction} />;
      case 'menu':
        return <MenuScreen activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-jobs':
        return <AllJobsScreen activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-sites':
        return <AllSitesScreen activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-projects':
        return <AllProjectsScreen activeTab={state.activeTab} onAction={handleAction} />;
      default:
        return <HomeScreen activeTab={state.activeTab} onAction={handleAction} />;
    }
  };

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      <MobileFrame>
        {renderScreen()}
      </MobileFrame>
    </ConfiguratorLayout>
  );
}

export default App;
