import { useState, useCallback } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { BrowserFrame } from './components/BrowserFrame';
import { useConfiguratorConfig } from './hooks/useConfiguratorConfig';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { ObjectListScreen } from './screens/ObjectListScreen';
import { AdminSearchIndexingScreen } from './screens/AdminSearchIndexingScreen';
import { JOBS_CONFIG, SITES_CONFIG, PROJECTS_CONFIG } from './config/listConfigs';
import type { AppState, ScreenId, ActiveTab, Variant } from './types';

const INITIAL_STATE: AppState = {
  screen: 'home',
  activeTab: 'home',
  screenHistory: [],
};

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [variant, setVariant] = useState<Variant>('full-page');

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

  // Configurator sidebar / diagram selection: jump straight to a screen and
  // reset the in-app back stack.
  const handleScreenSelect = useCallback((screen: ScreenId) => {
    setState(prev => ({
      ...prev,
      screen,
      activeTab: screen === 'home' ? 'home' : screen === 'menu' ? 'menu' : prev.activeTab,
      screenHistory: [],
    }));
  }, []);

  const { configuratorConfig } = useConfiguratorConfig({
    activeScreen: state.screen,
    variant,
    onScreenSelect: handleScreenSelect,
    onVariantChange: setVariant,
  });

  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen activeTab={state.activeTab} onAction={handleAction} />;
      case 'menu':
        return <MenuScreen activeTab={state.activeTab} onAction={handleAction} />;
      // key forces a remount per object type so per-screen state (filters,
      // search, saved filters) never leaks when switching list screens directly.
      case 'all-jobs':
        return <ObjectListScreen key="all-jobs" config={JOBS_CONFIG} variant={variant} activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-sites':
        return <ObjectListScreen key="all-sites" config={SITES_CONFIG} variant={variant} activeTab={state.activeTab} onAction={handleAction} />;
      case 'all-projects':
        return <ObjectListScreen key="all-projects" config={PROJECTS_CONFIG} variant={variant} activeTab={state.activeTab} onAction={handleAction} />;
      case 'admin-search-indexing':
        return <AdminSearchIndexingScreen />;
      default:
        return <HomeScreen activeTab={state.activeTab} onAction={handleAction} />;
    }
  };

  // Mobile screens render in a phone; the admin / web screen renders in a
  // desktop browser window instead.
  const isAdmin = state.screen === 'admin-search-indexing';

  return (
    <ConfiguratorLayout config={configuratorConfig}>
      {isAdmin ? (
        <BrowserFrame>{renderScreen()}</BrowserFrame>
      ) : (
        <MobileFrame>{renderScreen()}</MobileFrame>
      )}
    </ConfiguratorLayout>
  );
}

export default App;
