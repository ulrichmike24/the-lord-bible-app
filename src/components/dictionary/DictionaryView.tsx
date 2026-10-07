import React, { useState, useEffect } from 'react';
import { Bookmark, Search, BookOpen, Sparkles, X } from 'lucide-react';
import { api, DictionaryEntry } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface DictionaryViewProps {
  onAskAiConcept?: (concept: string) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ onAskAiConcept }) => {
  const { isWhite } = useTheme();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [query, setQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    api.getDictionary(query).then(setEntries).catch(console.error);
  }, [query]);

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
            isWhite ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
          }`}>
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Dictionnaire Théologique
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Définitions rigoureuses, signification biblique et concepts théologiques vérifiés sans extrapolation étymologique.
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isWhite ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un terme (ex: Grâce, Justification, Sanctification...)"
            className={`w-full border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-colors ${
              isWhite
                ? 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
            }`}
          />
        </div>
      </div>

      {/* ENTRIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(entry => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className={`group p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md space-y-3 ${
              isWhite
                ? 'bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-neutral-300 text-neutral-900 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 text-neutral-100 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-base transition-colors ${isWhite ? 'text-neutral-950 group-hover:text-black' : 'text-white'}`}>
                {entry.term}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isWhite
                  ? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                Théologie
              </span>
            </div>

            <p className={`text-xs leading-relaxed line-clamp-3 ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              {entry.definition}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {entry.references.slice(0, 2).map(ref => (
                <span
                  key={ref}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                    isWhite
                      ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 custom-scrollbar transition-colors ${
            isWhite
              ? 'bg-white border-neutral-300 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <h2 className="text-2xl font-black">{selectedEntry.term}</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className={`p-1 rounded-full ${isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  Définition
                </h4>
                <p className={`leading-relaxed p-3.5 rounded-2xl border ${
                  isWhite
                    ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                }`}>
                  {selectedEntry.definition}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  Signification et portée biblique
                </h4>
                <p className={`leading-relaxed ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  {selectedEntry.biblicalSignificance}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className={`font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Passages scripturaires clés</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.references.map(r => (
                    <span
                      key={r}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
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

              {selectedEntry.associatedConcepts && selectedEntry.associatedConcepts.length > 0 && (
                <div className="space-y-2">
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] ${
                    isWhite ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Concepts associés
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.associatedConcepts.map(c => (
                      <span
                        key={c}
                        className={`px-2 py-0.5 rounded-md text-xs border ${
                          isWhite
                            ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`pt-4 border-t flex justify-end ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <button
                onClick={() => {
                  onAskAiConcept?.(selectedEntry.term);
                  setSelectedEntry(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isWhite
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Approfondir « {selectedEntry.term} » avec Bible AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
