
import React, { useState, useCallback, useEffect } from 'react';
import { ViewState } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ChatWindow from './components/ChatWindow';
import MoodTracker from './components/MoodChart';
import ExerciseList from './components/ExerciseCard';
import CrisisResources from './components/CrisisResources';
import LandingPage from './components/LandingPage';
import ClinicsView from './components/ClinicsView';
import AboutUs from './components/AboutUs';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('minda_user_name'));
  const [currentView, setCurrentView] = useState<ViewState>(userName ? ViewState.CHAT : ViewState.LANDING);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
  }, []);

  const handleStart = async (name: string) => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      if (!selected) {
        await window.aistudio.openSelectKey();
      }
    }
    
    setUserName(name);
    localStorage.setItem('minda_user_name', name);
    setCurrentView(ViewState.CHAT);
  };

  const triggerAIAction = useCallback((message: string) => {
    setPendingMessage(message);
    setCurrentView(ViewState.CHAT);
  }, []);

  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewState.CHAT:
        return <ChatWindow initialPrompt={pendingMessage} onPromptConsumed={clearPendingMessage} />;
      case ViewState.TRACKER:
        return <MoodTracker onDiscussMood={triggerAIAction} />;
      case ViewState.EXERCISES:
        return <ExerciseList onStartWithAI={triggerAIAction} />;
      case ViewState.RESOURCES:
        return <CrisisResources />;
      case ViewState.CLINICS:
        return <ClinicsView onContactPro={triggerAIAction} />;
      case ViewState.ABOUT:
        return <AboutUs />;
      default:
        return <ChatWindow initialPrompt={null} onPromptConsumed={() => {}} />;
    }
  };

  if (!userName || currentView === ViewState.LANDING) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main 
        id="main-content"
        role="main" 
        className="flex-1 h-full overflow-hidden relative pb-[72px] md:pb-0 focus:outline-none"
        tabIndex={-1}
      >
        {renderView()}

        {currentView !== ViewState.RESOURCES && (
          <button
            onClick={() => setCurrentView(ViewState.RESOURCES)}
            className="fixed bottom-[84px] right-4 md:bottom-8 md:right-8 bg-red-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all z-40 animate-pulse border-4 border-white focus:ring-4 focus:ring-red-200 outline-none"
            title="Crisis Help"
            aria-label="Get Immediate Crisis Support"
          >
            <span className="text-xl md:text-2xl font-bold" aria-hidden="true">!</span>
          </button>
        )}
      </main>

      <BottomNav currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
