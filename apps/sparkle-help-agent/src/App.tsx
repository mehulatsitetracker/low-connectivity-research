import { useState } from 'react';
import { ConfiguratorLayout } from 'configurator-ui';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { Fab } from './components/Fab';
import { QuickActionsOverlay } from './components/QuickActionsOverlay';
import { SparkleChatSheet } from './components/SparkleChatSheet';
import { HomeScreen } from './screens/HomeScreen';
import { JobScreen } from './screens/JobScreen';
import { SiteScreen } from './screens/SiteScreen';
import { FormsScreen } from './screens/FormsScreen';
import { FormDetailScreen } from './screens/FormDetailScreen';
import { ProjectScreen } from './screens/ProjectScreen';
import { useSparkleConfig } from './hooks/useConfiguratorConfig';
import { HelpAgentButtonContext } from './help-agent-context';
import { HelpAgentToggle } from './components/HelpAgentToggle';
import type { ChatMode, Overlay, ScreenId } from './types';

function App() {
  const [screenId, setScreenId] = useState<ScreenId>('home');
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [chatContext, setChatContext] = useState('Help Agent');
  const [chatMode, setChatMode] = useState<ChatMode>('greeting');
  const [showHelpButton, setShowHelpButton] = useState(false);

  const goToScreen = (id: ScreenId) => {
    setScreenId(id);
    setOverlay('none');
  };

  const openHelpChat = () => {
    setChatContext('Screen help');
    setChatMode('help');
    setOverlay('chat');
  };

  const handleAction = (action: string) => {
    if (action === 'back') goToScreen('home');
    if (action === 'go-job') goToScreen('job');
    if (action === 'go-site') goToScreen('site');
    if (action === 'go-forms') goToScreen('forms');
    if (action === 'go-form-detail') goToScreen('form-detail');
    if (action === 'go-project') goToScreen('project');
    if (action === 'ask-help') openHelpChat();
  };

  const handleQuickAction = (action: string) => {
    setChatContext(action);
    setChatMode('greeting');
    setOverlay('chat');
  };

  const config = useSparkleConfig({
    screenId,
    overlay,
    chatContext,
    chatMode,
    onScreenChange: goToScreen,
    onOverlayChange: setOverlay,
    onChatModeChange: setChatMode,
    developerSettings: (
      <HelpAgentToggle checked={showHelpButton} onChange={setShowHelpButton} />
    ),
  });

  const renderScreen = () => {
    switch (screenId) {
      case 'home': return <HomeScreen onAction={handleAction} />;
      case 'job': return <JobScreen onAction={handleAction} />;
      case 'site': return <SiteScreen onAction={handleAction} />;
      case 'forms': return <FormsScreen onAction={handleAction} />;
      case 'form-detail': return <FormDetailScreen onAction={handleAction} />;
      case 'project': return <ProjectScreen onAction={handleAction} />;
    }
  };

  return (
    <ConfiguratorLayout config={config}>
      <HelpAgentButtonContext.Provider value={showHelpButton}>
      <MobileFrame>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderScreen()}
          </div>
          <BottomNav activeTab="home" onTabChange={() => goToScreen('home')} />

          {overlay === 'none' && <Fab onClick={() => setOverlay('quick-actions')} />}
          {overlay === 'quick-actions' && (
            <QuickActionsOverlay onSelect={handleQuickAction} onClose={() => setOverlay('none')} />
          )}
          {overlay === 'chat' && (
            <SparkleChatSheet key={`${chatMode}-${screenId}`} context={chatContext} mode={chatMode} screenId={screenId} onClose={() => setOverlay('none')} />
          )}
        </div>
      </MobileFrame>
      </HelpAgentButtonContext.Provider>
    </ConfiguratorLayout>
  );
}

export default App;
