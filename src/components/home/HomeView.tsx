import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Heart,
  HelpCircle,
  CalendarCheck2,
  BookMarked,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api, Devotional } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  onSelectVerseToExplain?: (verseRef: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab }) => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const { isWhite } = useTheme();

  useEffect(() => {
    api.getTodayDevotional().then(setDevotional).catch(console.error);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 md:p-16 text-center shadow-md transition-colors ${
        isWhite
          ? 'bg-gradient-to-b from-neutral-50 via-white to-neutral-100/50 border-neutral-200 text-neutral-900'
          : 'bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-neutral-800 text-neutral-100'
      }`}>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold ${
            isWhite
              ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
              : 'bg-neutral-800 border-neutral-700 text-neutral-200'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isWhite ? 'text-neutral-900' : 'text-amber-400'}`} />
            <span>Assistant théologique Gemini & RAG biblique</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${
            isWhite ? 'text-neutral-950' : 'text-white'
          }`}>
            BIBLE AI
          </h1>

          <p className={`text-lg sm:text-xl font-serif italic max-w-2xl mx-auto ${
            isWhite ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            « Explorez la Bible. Comprenez la Parole. Grandissez dans votre foi. »
          </p>

          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${
            isWhite ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            La Bible, la connaissance et l'intelligence au même endroit. Un lecteur complet, des études approfondies, un dictionnaire théologique et un moteur de recherche sécurisé sans hallucination.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentTab('bible')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white shadow-neutral-950/20'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950 shadow-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Lire la Bible</span>
            </button>

            <button
              onClick={() => setCurrentTab('ai_chat')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border hover:scale-105 active:scale-95 transition-all ${
                isWhite
                  ? 'bg-white hover:bg-neutral-100 text-neutral-900 border-neutral-300 shadow-xs'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border-neutral-700 shadow-xs'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Demander à Bible AI</span>
            </button>

            <button
              onClick={() => setCurrentTab('studies')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border hover:scale-105 active:scale-95 transition-all ${
                isWhite
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Commencer une étude</span>
            </button>
          </div>
        </div>
      </section>

      {/* MÉDITATION DU JOUR HIGHLIGHT */}
      {devotional && (
        <section className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden shadow-md transition-colors ${
          isWhite
            ? 'bg-neutral-50/90 border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 border-neutral-800 text-neutral-100'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <Heart className={`w-4 h-4 ${isWhite ? 'fill-neutral-900 text-neutral-900' : 'fill-white text-white'}`} />
                <span>Méditation du jour • {devotional.dateKey}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${
                isWhite ? 'text-neutral-950' : 'text-white'
              }`}>
                {devotional.title}
              </h2>
              <blockquote className={`border-l-2 pl-4 py-1 font-serif italic text-sm ${
                isWhite
                  ? 'border-neutral-900 text-neutral-800'
                  : 'border-white text-neutral-200'
              }`}>
                « {devotional.verseText} »
                <span className={`block mt-1 font-sans text-xs font-bold not-italic ${
                  isWhite ? 'text-neutral-900' : 'text-white'
                }`}>
                  — {devotional.verseRef} ({devotional.translation})
                </span>
              </blockquote>
              <p className={`text-xs sm:text-sm line-clamp-2 ${
                isWhite ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                {devotional.reflection}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('devotionals')}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white border-neutral-950 shadow-xs'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950 border-white shadow-xs'
              }`}
            >
              <span>Lire la méditation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* GRILLE DES MODULES CLÉS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${
            isWhite ? 'text-neutral-950' : 'text-white'
          }`}>
            <span>Explorez les modules de BIBLE AI</span>
          </h2>
          <span className={`text-xs ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
            12 outils intégrés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Lecteur Biblique */}
          <div
            onClick={() => setCurrentTab('bible')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-white'
            }`}>
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base transition-colors ${
              isWhite ? 'text-neutral-950 group-hover:text-black' : 'text-white'
            }`}>
              Bible numérique
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              66 livres de l'Ancien et Nouveau Testament. Navigation rapide par testament, livre, chapitre et verset avec traductions libres (LSG & KJV).
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Ouvrir la Bible</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Bible AI Assistant */}
          <div
            onClick={() => setCurrentTab('ai_chat')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-neutral-50 hover:bg-neutral-100/70 border-neutral-300 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-700 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
            }`}>
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Assistant Bible AI
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Exégèse structurée, explications de versets avec contexte historique, 13 agents spécialisés connectés au pipeline RAG anti-hallucination.
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Poser une question</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Études Bibliques */}
          <div
            onClick={() => setCurrentTab('studies')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-white'
            }`}>
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base transition-colors ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              Études bibliques
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Générez des études théologiques personnalisées sur le Saint-Esprit, la foi, la grâce, avec objectifs, passages clés et applications.
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Créer une étude</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Histoires Bibliques */}
          <div
            onClick={() => setCurrentTab('stories')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-white'
            }`}>
              <BookMarked className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base transition-colors ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              Histoires de la Bible
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              De la Création à l'Exode, David et Goliath, les paraboles de Jésus et la Résurrection. Récits, leçons de foi et questions de partage.
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Découvrir les récits</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Plans de Lecture */}
          <div
            onClick={() => setCurrentTab('plans')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-white'
            }`}>
              <CalendarCheck2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base transition-colors ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              Plans de lecture
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Suivez votre progression quotidienne : la Foi en 7 jours, le Saint-Esprit en 14 jours, les Évangiles en 30 jours, les Psaumes.
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Suivre un plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Quiz Bibliques */}
          <div
            onClick={() => setCurrentTab('quiz')}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 text-neutral-100 shadow-xs'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-white'
            }`}>
              <HelpCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className={`font-bold text-base transition-colors ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              Quiz bibliques
            </h3>
            <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Testez et approfondissez vos connaissances avec des quiz interactifs, explications théologiques immédiates et versets justificatifs.
            </p>
            <div className={`pt-2 flex items-center gap-1 text-xs font-bold ${
              isWhite ? 'text-neutral-950' : 'text-white'
            }`}>
              <span>Lancer un quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT DE RIGUEUR ET DE RESPECT */}
      <section className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-center gap-5 transition-colors ${
        isWhite
          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
          : 'bg-neutral-900/60 border-neutral-800 text-neutral-100'
      }`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
          isWhite
            ? 'bg-white border-neutral-300 text-neutral-900'
            : 'bg-neutral-800 border-neutral-700 text-white'
        }`}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className={`text-sm font-bold ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
            Architecture RAG & Zéro Hallucination Biblique
          </h4>
          <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Tous les versets affichés et cités par Bible AI proviennent directement des textes canoniques de la base de données. L'intelligence artificielle est encadrée par des garde-fous théologiques stricts.
          </p>
        </div>
      </section>
    </div>
  );
};
