import React, { useState } from 'react';
import { Home, BookOpen, Sparkles, GraduationCap, Menu, X, Users, Bookmark, BookMarked, Heart, CalendarCheck2, HelpCircle, FolderHeart, Video, ShieldAlert, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { isWhite } = useTheme();

  const primaryMobileTabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'bible', label: 'Bible', icon: BookOpen },
    { id: 'ai_chat', label: 'Bible AI', icon: Sparkles, highlight: true },
    { id: 'studies', label: 'Études', icon: GraduationCap },
  ];

  const allDrawerItems = [
    { id: 'stories', label: 'Histoires bibliques', icon: BookMarked },
    { id: 'characters', label: 'Personnages bibliques', icon: Users },
    { id: 'dictionary', label: 'Dictionnaire théologique', icon: Bookmark },
    { id: 'devotionals', label: 'Méditation du jour', icon: Heart },
    { id: 'plans', label: 'Plans de lecture', icon: CalendarCheck2 },
    { id: 'quiz', label: 'Quiz bibliques', icon: HelpCircle },
    { id: 'studio', label: 'Studio Vidéo & Contenu', icon: Video },
    { id: 'library', label: 'Ma Bibliothèque', icon: FolderHeart },
    { id: 'profile', label: 'Mon Profil', icon: User },
  ];

  if (isAdmin) {
    allDrawerItems.push({ id: 'admin', label: 'Administration', icon: ShieldAlert });
  }

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* Drawer panel */}
      {drawerOpen && (
        <div className={`fixed bottom-0 inset-x-0 max-h-[80vh] border-t rounded-t-3xl z-50 lg:hidden p-5 overflow-y-auto shadow-2xl flex flex-col transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-black'
            : 'bg-black border-neutral-800 text-white'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b mb-4 ${
            isWhite ? 'border-neutral-200' : 'border-neutral-800'
          }`}>
            <span className={`font-bold text-sm ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Toutes les fonctionnalités
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              className={`p-1.5 rounded-full ${
                isWhite
                  ? 'bg-neutral-100 text-neutral-600 hover:text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pb-6">
            {allDrawerItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? isWhite
                        ? 'bg-neutral-950 text-white font-bold shadow-xs'
                        : 'bg-white text-neutral-950 font-bold shadow-xs'
                      : isWhite
                      ? 'bg-neutral-50 text-neutral-800 hover:bg-neutral-100 border border-neutral-200'
                      : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fixed bottom bar */}
      <nav className={`fixed bottom-0 inset-x-0 backdrop-blur-md border-t z-40 lg:hidden px-3 py-1.5 flex items-center justify-around transition-colors ${
        isWhite
          ? 'bg-white/95 border-neutral-200 text-black shadow-md'
          : 'bg-black/95 border-neutral-800 text-white'
      }`}>
        {primaryMobileTabs.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? isWhite
                    ? 'text-neutral-950 font-bold'
                    : 'text-white font-bold'
                  : isWhite
                  ? 'text-neutral-500 hover:text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive
                    ? isWhite
                      ? 'bg-neutral-100'
                      : 'bg-neutral-800'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Menu drawer button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center py-1 px-3 ${
            isWhite ? 'text-neutral-500 hover:text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <div className="p-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Plus</span>
        </button>
      </nav>
    </>
  );
};
