import React from 'react';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface ProfileViewProps {
  translation: 'LSG' | 'KJV';
  setTranslation: (t: 'LSG' | 'KJV') => void;
  setCurrentTab: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  translation,
  setTranslation,
  setCurrentTab,
}) => {
  const { user, isAdmin, login, logout } = useAuth();
  const { isWhite } = useTheme();

  const favCount = JSON.parse(localStorage.getItem('bible_ai_favorites') || '[]').length;
  const notesCount = Object.keys(JSON.parse(localStorage.getItem('bible_ai_notes') || '{}')).length;
  const progressData = JSON.parse(localStorage.getItem('bible_ai_reading_progress') || '{}');
  const totalDaysCompleted = Object.values(progressData).reduce(
    (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
      {/* PROFILE CARD */}
      <div className={`border rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm transition-colors ${
        isWhite
          ? 'bg-white border-neutral-200 text-neutral-900'
          : 'bg-neutral-950 border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Profil'}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-neutral-300 shadow-md"
            />
          ) : (
            <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center font-extrabold text-2xl shadow-sm ${
              isWhite
                ? 'bg-neutral-100 border-neutral-200 text-neutral-900'
                : 'bg-neutral-900 border-neutral-800 text-white'
            }`}>
              {user ? user.email?.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>
          )}

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className={`text-xl sm:text-2xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                {user ? user.displayName || 'Utilisateur Bible AI' : 'Invité (Non connecté)'}
              </h1>
              {isAdmin && (
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isWhite
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-red-950/40 text-red-300 border-red-900/50'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  Administrateur
                </span>
              )}
            </div>
            <p className={`text-xs flex items-center justify-center sm:justify-start gap-1.5 ${
              isWhite ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'Connectez-vous pour synchroniser vos données'}</span>
            </p>
          </div>

          <div>
            {user ? (
              <button
                onClick={logout}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isWhite
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-800'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <button
                onClick={login}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isWhite
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                <span>Connexion Google</span>
              </button>
            )}
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className={`grid grid-cols-3 gap-3 pt-4 border-t ${
          isWhite ? 'border-neutral-200' : 'border-neutral-800'
        }`}>
          <div
            onClick={() => setCurrentTab('library')}
            className={`p-4 rounded-2xl border text-center cursor-pointer transition-colors ${
              isWhite
                ? 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            <div className={`text-xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>{favCount}</div>
            <div className={`text-[11px] mt-1 ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>Favoris</div>
          </div>

          <div
            onClick={() => setCurrentTab('library')}
            className={`p-4 rounded-2xl border text-center cursor-pointer transition-colors ${
              isWhite
                ? 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            <div className={`text-xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>{notesCount}</div>
            <div className={`text-[11px] mt-1 ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>Notes prises</div>
          </div>

          <div
            onClick={() => setCurrentTab('plans')}
            className={`p-4 rounded-2xl border text-center cursor-pointer transition-colors ${
              isWhite
                ? 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            <div className={`text-xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>{totalDaysCompleted}</div>
            <div className={`text-[11px] mt-1 ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>Jours de plans lus</div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className={`space-y-4 pt-4 border-t ${
          isWhite ? 'border-neutral-200' : 'border-neutral-800'
        }`}>
          <h3 className={`font-bold text-sm ${isWhite ? 'text-neutral-950' : 'text-white'}`}>Préférences de lecture</h3>
          <div className={`flex items-center justify-between p-4 rounded-2xl border ${
            isWhite ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div>
              <div className={`text-xs font-semibold ${isWhite ? 'text-neutral-900' : 'text-white'}`}>Traduction par défaut</div>
              <div className={`text-[11px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Choix entre la référence francophone (LSG 1910) et anglophone (KJV)
              </div>
            </div>

            <div className={`flex p-0.5 rounded-xl border text-xs ${
              isWhite ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <button
                onClick={() => setTranslation('LSG')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                  translation === 'LSG'
                    ? isWhite
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-white text-neutral-950 border-white shadow-xs'
                    : isWhite
                    ? 'text-neutral-600 hover:text-black border-transparent'
                    : 'text-neutral-400 hover:text-white border-transparent'
                }`}
              >
                LSG 1910
              </button>
              <button
                onClick={() => setTranslation('KJV')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                  translation === 'KJV'
                    ? isWhite
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-white text-neutral-950 border-white shadow-xs'
                    : isWhite
                    ? 'text-neutral-600 hover:text-black border-transparent'
                    : 'text-neutral-400 hover:text-white border-transparent'
                }`}
              >
                KJV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
