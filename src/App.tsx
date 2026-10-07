/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MobileNav } from './components/layout/MobileNav.tsx';
import { HomeView } from './components/home/HomeView.tsx';
import { BibleReader } from './components/bible/BibleReader.tsx';
import { BibleAiChat } from './components/ai/BibleAiChat.tsx';
import { GlobalSearch } from './components/search/GlobalSearch.tsx';
import { DictionaryView } from './components/dictionary/DictionaryView.tsx';
import { CharactersView } from './components/characters/CharactersView.tsx';
import { StoriesView } from './components/stories/StoriesView.tsx';
import { StudiesView } from './components/studies/StudiesView.tsx';
import { DevotionalView } from './components/devotionals/DevotionalView.tsx';
import { ReadingPlansView } from './components/plans/ReadingPlansView.tsx';
import { QuizView } from './components/quiz/QuizView.tsx';
import { ContentStudioView } from './components/studios/ContentStudioView.tsx';
import { LibraryView } from './components/library/LibraryView.tsx';
import { ProfileView } from './components/profile/ProfileView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

function MainApp() {
  const { isWhite } = useTheme();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [translation, setTranslation] = useState<'LSG' | 'KJV'>('LSG');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [initialAiPrompt, setInitialAiPrompt] = useState<string>('');

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAskAiAboutConcept = (concept: string) => {
    setInitialAiPrompt(`Explique en profondeur le concept théologique de « ${concept} » dans la Bible.`);
    setCurrentTab('ai_chat');
  };

  const handleAskAiAboutCharacter = (charName: string) => {
    setInitialAiPrompt(`Qui est ${charName} dans la Bible et quelles leçons spirituelles tirer de sa vie ?`);
    setCurrentTab('ai_chat');
  };

  const handleAskAiAboutStory = (storyTitle: string) => {
    setInitialAiPrompt(`Raconte et analyse spirituellement le récit biblique de « ${storyTitle} » avec ses enseignements chrétiens.`);
    setCurrentTab('ai_chat');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isWhite
        ? 'bg-white text-black selection:bg-black selection:text-white'
        : 'bg-black text-white selection:bg-white selection:text-black'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        translation={translation}
        setTranslation={setTranslation}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Desktop Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-5xl overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'bible' && (
            <BibleReader
              translation={translation}
              setTranslation={setTranslation}
              onNavigateToAiExplanation={verse => {
                setInitialAiPrompt(`Explique en détail ${verse.bookName} ${verse.chapter}:${verse.verse} : « ${verse.text} »`);
                setCurrentTab('ai_chat');
              }}
            />
          )}

          {currentTab === 'ai_chat' && (
            <BibleAiChat
              translation={translation}
              initialPrompt={initialAiPrompt}
            />
          )}

          {currentTab === 'search' && (
            <div className="space-y-4">
              <div className={`p-8 rounded-3xl border text-center space-y-3 transition-colors ${
                isWhite
                  ? 'bg-neutral-50 border-neutral-200'
                  : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <h2 className={`text-xl font-bold ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                  Recherche Biblique Globale
                </h2>
                <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Tapez Ctrl+K ou ouvrez la fenêtre de recherche instantanée pour trouver des versets, personnages et thèmes.
                </p>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    isWhite
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950'
                  }`}
                >
                  Ouvrir la recherche globale
                </button>
              </div>
            </div>
          )}

          {currentTab === 'stories' && (
            <StoriesView onAskAiStory={handleAskAiAboutStory} />
          )}

          {currentTab === 'characters' && (
            <CharactersView onAskAiCharacter={handleAskAiAboutCharacter} />
          )}

          {currentTab === 'dictionary' && (
            <DictionaryView onAskAiConcept={handleAskAiAboutConcept} />
          )}

          {currentTab === 'studies' && (
            <StudiesView translation={translation} />
          )}

          {currentTab === 'devotionals' && (
            <DevotionalView translation={translation} />
          )}

          {currentTab === 'plans' && (
            <ReadingPlansView
              onReadPassage={_passage => {
                setCurrentTab('bible');
              }}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView />
          )}

          {currentTab === 'studio' && (
            <ContentStudioView translation={translation} />
          )}

          {currentTab === 'library' && (
            <LibraryView />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              translation={translation}
              setTranslation={setTranslation}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Global Search Dialog */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        translation={translation}
        onSelectTab={tab => {
          setCurrentTab(tab);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
