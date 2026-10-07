import React from 'react';
import {
  Home,
  BookOpen,
  Search,
  Sparkles,
  Bookmark,
  Users,
  BookMarked,
  GraduationCap,
  Heart,
  CalendarCheck2,
  HelpCircle,
  FolderHeart,
  Video,
  ShieldAlert,
  User,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { isAdmin } = useAuth();
  const { isWhite } = useTheme();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, section: 'Principal' },
    { id: 'bible', label: 'Bible numérique', icon: BookOpen, section: 'Principal' },
    { id: 'search', label: 'Recherche globale', icon: Search, section: 'Principal' },
    { id: 'ai_chat', label: 'Bible AI (Gemini)', icon: Sparkles, section: 'Intelligence Artificielle', highlight: true },
    { id: 'stories', label: 'Histoires bibliques', icon: BookMarked, section: 'Découverte' },
    { id: 'characters', label: 'Personnages', icon: Users, section: 'Découverte' },
    { id: 'dictionary', label: 'Dictionnaire théologique', icon: Bookmark, section: 'Découverte' },
    { id: 'studies', label: 'Études bibliques', icon: GraduationCap, section: 'Croissance spirituelle' },
    { id: 'devotionals', label: 'Méditation du jour', icon: Heart, section: 'Croissance spirituelle' },
    { id: 'plans', label: 'Plans de lecture', icon: CalendarCheck2, section: 'Croissance spirituelle' },
    { id: 'quiz', label: 'Quiz bibliques', icon: HelpCircle, section: 'Pratique & Savoir' },
    { id: 'studio', label: 'Studios (Contenu & Vidéo)', icon: Video, section: 'Création' },
    { id: 'library', label: 'Ma Bibliothèque', icon: FolderHeart, section: 'Personnel' },
    { id: 'profile', label: 'Mon Profil', icon: User, section: 'Personnel' },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, section: 'Administration' });
  }

  // Group by sections
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  return (
    <aside className={`w-64 border-r hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto custom-scrollbar p-3 transition-colors ${
      isWhite
        ? 'bg-white border-neutral-200 text-neutral-900'
        : 'bg-black border-neutral-800 text-neutral-100'
    }`}>
      <div className="space-y-6">
        {sections.map(sectionName => (
          <div key={sectionName}>
            <div className={`px-3 mb-2 text-[10px] uppercase font-bold tracking-wider ${
              isWhite ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              {sectionName}
            </div>
            <div className="space-y-1">
              {navItems
                .filter(item => item.section === sectionName)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? isWhite
                            ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                            : 'bg-white text-neutral-950 font-semibold shadow-xs'
                          : isWhite
                          ? 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/60'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive
                            ? isWhite ? 'text-white' : 'text-neutral-950'
                            : isWhite ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.highlight && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? isWhite
                              ? 'bg-white/20 text-white'
                              : 'bg-neutral-900 text-white'
                            : isWhite
                            ? 'bg-neutral-200 text-neutral-900'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}>
                          IA
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-auto pt-4 border-t text-[11px] px-3 ${
        isWhite ? 'border-neutral-200 text-neutral-500' : 'border-neutral-900 text-neutral-400'
      }`}>
        Bible AI v1.0 • RAG & Gemini
      </div>
    </aside>
  );
};
