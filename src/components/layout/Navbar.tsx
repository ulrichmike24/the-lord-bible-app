import React from 'react';
import { BookOpen, Sparkles, Search, User as UserIcon, ShieldAlert, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  translation: 'LSG' | 'KJV';
  setTranslation: (t: 'LSG' | 'KJV') => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  translation,
  setTranslation,
  onOpenSearch,
}) => {
  const { user, isAdmin, login, logout } = useAuth();
  const { isWhite, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors border-b ${
      isWhite
        ? 'bg-white/95 border-neutral-200 text-black shadow-xs'
        : 'bg-black/95 border-neutral-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform ${
            isWhite
              ? 'bg-neutral-900 text-white shadow-neutral-900/10'
              : 'bg-white text-neutral-950 shadow-white/10'
          }`}>
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-xl tracking-tight ${
                isWhite ? 'text-neutral-950' : 'text-white'
              }`}>
                BIBLE AI
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border ${
                isWhite
                  ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-800 text-neutral-200 border-neutral-700'
              }`}>
                PRO
              </span>
            </div>
            <p className={`text-[11px] hidden sm:block ${
              isWhite ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              La Bible, la connaissance et l'intelligence
            </p>
          </div>
        </div>

        {/* Global Search Button & Quick Nav */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all border ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Search className={`w-4 h-4 ${isWhite ? 'text-neutral-800' : 'text-neutral-300'}`} />
              <span>Rechercher un verset, personnage, mot-clé...</span>
            </span>
            <kbd className={`px-1.5 py-0.5 text-[10px] rounded border ${
              isWhite
                ? 'bg-white border-neutral-300 text-neutral-600'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}>
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Translation Switcher, Theme Toggle & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className={`md:hidden p-2 rounded-xl border transition-all ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
            }`}
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button (White & Black) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
            }`}
            title={isWhite ? 'Passer en mode Noir (Fond noir)' : 'Passer en mode Blanc (Fond blanc)'}
          >
            {isWhite ? (
              <>
                <Moon className="w-3.5 h-3.5 text-neutral-800" />
                <span className="hidden md:inline text-[11px]">Noir</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden md:inline text-[11px]">Blanc</span>
              </>
            )}
          </button>

          {/* Translation selector */}
          <div className={`flex items-center p-0.5 rounded-xl border text-xs ${
            isWhite
              ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300'
          }`}>
            <button
              onClick={() => setTranslation('LSG')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                translation === 'LSG'
                  ? isWhite
                    ? 'bg-neutral-950 text-white font-bold shadow-xs'
                    : 'bg-white text-neutral-950 font-bold shadow-xs'
                  : isWhite
                  ? 'text-neutral-600 hover:text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Louis Segond 1910 (Français)"
            >
              LSG
            </button>
            <button
              onClick={() => setTranslation('KJV')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                translation === 'KJV'
                  ? isWhite
                    ? 'bg-neutral-950 text-white font-bold shadow-xs'
                    : 'bg-white text-neutral-950 font-bold shadow-xs'
                  : isWhite
                  ? 'text-neutral-600 hover:text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="King James Version (English)"
            >
              KJV
            </button>
          </div>

          {/* Quick AI Trigger */}
          <button
            onClick={() => setCurrentTab('ai_chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentTab === 'ai_chat'
                ? isWhite
                  ? 'bg-neutral-900 text-white border-neutral-950 shadow-sm'
                  : 'bg-white text-neutral-950 border-white shadow-sm'
                : isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isWhite ? 'text-neutral-800' : 'text-neutral-200'}`} />
            <span className="hidden sm:inline">Bible AI</span>
          </button>

          {/* Admin badge if admin */}
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                currentTab === 'admin'
                  ? 'bg-red-600 text-white border-red-700'
                  : isWhite
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-red-950/40 text-red-300 border-red-900/50 hover:bg-red-900/50'
              }`}
              title="Panneau Administrateur"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('profile')}
                className={`flex items-center gap-2 p-1 rounded-full border transition-colors ${
                  isWhite
                    ? 'border-neutral-300 hover:border-neutral-900'
                    : 'border-neutral-800 hover:border-neutral-400'
                }`}
                title={user.email || 'Profil'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Utilisateur'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isWhite
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-950'
                  }`}>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              <button
                onClick={logout}
                className={`text-[11px] hidden sm:inline ${
                  isWhite ? 'text-neutral-500 hover:text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
