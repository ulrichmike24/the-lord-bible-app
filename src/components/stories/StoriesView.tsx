import React, { useState, useEffect } from 'react';
import { BookMarked, BookOpen, Sparkles, X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { api, BibleStory } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface StoriesViewProps {
  onAskAiStory?: (storyTitle: string) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({ onAskAiStory }) => {
  const { isWhite } = useTheme();
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedStory, setSelectedStory] = useState<BibleStory | null>(null);

  const categories = [
    'Toutes',
    'Ancien Testament',
    'Nouveau Testament',
    'Vie de Jésus',
    'Paraboles',
  ];

  useEffect(() => {
    api.getStories(selectedCategory).then(setStories).catch(console.error);
  }, [selectedCategory]);

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 transition-colors ${
        isWhite
          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
          : 'bg-neutral-950/80 border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isWhite ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-950'
          }`}>
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Histoires de la Bible
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Revivez les grands récits de la foi, découvrez la chronologie et méditez les leçons spirituelles.
            </p>
          </div>
        </div>

        {/* CATEGORIES CHIPS */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? isWhite
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-950 border-white shadow-xs'
                  : isWhite
                  ? 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border-neutral-200'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* STORIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className={`group p-6 rounded-3xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-4 flex flex-col justify-between ${
              isWhite
                ? 'bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-neutral-300 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 text-neutral-100 shadow-xs'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isWhite
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}>
                  {story.category}
                </span>
                <span className={`text-[10px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {story.timeline}
                </span>
              </div>

              <h2 className={`text-lg font-bold transition-colors ${
                isWhite ? 'text-neutral-950 group-hover:text-black' : 'text-white'
              }`}>
                {story.title}
              </h2>

              <p className={`text-xs leading-relaxed line-clamp-3 ${
                isWhite ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                {story.summary}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <span className={`text-[11px] truncate max-w-[140px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {story.characters.slice(0, 2).join(', ')}...
              </span>
              <span className={`font-bold transition-transform group-hover:translate-x-0.5 ${
                isWhite ? 'text-neutral-950' : 'text-white'
              }`}>
                Lire le récit →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* STORY DETAIL MODAL */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 custom-scrollbar transition-colors ${
            isWhite
              ? 'bg-white border-neutral-300 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isWhite ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  {selectedStory.category} • {selectedStory.timeline}
                </span>
                <h2 className="text-2xl font-black mt-1">{selectedStory.title}</h2>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className={`p-1 rounded-full ${isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="space-y-1">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  Récit & Résumé
                </h4>
                <p className={`leading-relaxed p-4 rounded-2xl border ${
                  isWhite
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                }`}>
                  {selectedStory.summary}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  Personnages clés
                </h4>
                <p className={isWhite ? 'text-neutral-700' : 'text-neutral-300'}>
                  {selectedStory.characters.join(', ')}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leçons spirituelles</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedStory.lessons.map(l => (
                    <li key={l} className={`flex items-start gap-2 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      <span className="font-bold">•</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Questions de partage & réflexion</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedStory.questions.map(q => (
                    <li key={q} className={`italic flex items-start gap-2 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
                      <span className="font-serif font-bold">?</span>
                      <span>« {q} »</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                  isWhite ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Passages dans la Bible
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStory.references.map(r => (
                    <span
                      key={r}
                      className={`px-2.5 py-1 rounded-lg text-xs border ${
                        isWhite
                          ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                          : 'bg-neutral-800 text-neutral-200 border-neutral-700'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-end ${isWhite ? 'border-neutral-200' : 'border-neutral-800'}`}>
              <button
                onClick={() => {
                  onAskAiStory?.(selectedStory.title);
                  setSelectedStory(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isWhite
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Étudier « {selectedStory.title} » avec Bible AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
