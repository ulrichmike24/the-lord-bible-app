import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Users, Bookmark, BookMarked, X } from 'lucide-react';
import { api, VerseRecord, DictionaryEntry, CharacterProfile, BibleStory } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  translation: 'LSG' | 'KJV';
  onSelectVerse?: (verse: VerseRecord) => void;
  onSelectTab?: (tab: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  translation,
  onSelectTab,
}) => {
  const { isWhite } = useTheme();
  const [query, setQuery] = useState<string>('');
  const [verses, setVerses] = useState<VerseRecord[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query.trim()) {
      setVerses([]);
      setDictionary([]);
      setCharacters([]);
      setStories([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [v, d, c, s] = await Promise.all([
          api.search(query, translation),
          api.getDictionary(query),
          api.getCharacters(query),
          api.getStories('Toutes'),
        ]);

        setVerses(v);
        setDictionary(d);
        setCharacters(c);
        setStories(s.filter(story => story.title.toLowerCase().includes(query.toLowerCase())));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, translation]);

  if (!isOpen) return null;

  const totalResults = verses.length + dictionary.length + characters.length + stories.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20">
      <div className={`border rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 transition-colors ${
        isWhite
          ? 'bg-white border-neutral-300 text-neutral-900'
          : 'bg-neutral-950 border-neutral-800 text-neutral-100'
      }`}>
        {/* Search input bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isWhite ? 'border-neutral-200 bg-neutral-50/50' : 'border-neutral-800 bg-neutral-900/50'
        }`}>
          <Search className={`w-5 h-5 shrink-0 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un verset, personnage, concept (ex: Jean 3:16, foi, grâce, Abraham...)"
            className={`flex-1 bg-transparent text-sm sm:text-base outline-none ${
              isWhite ? 'text-neutral-900 placeholder-neutral-400' : 'text-white placeholder-neutral-500'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 rounded-md ${isWhite ? 'text-neutral-400 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              isWhite
                ? 'bg-neutral-100 text-neutral-700 hover:text-black border-neutral-300'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            Fermer (Échap)
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar flex-1">
          {loading && (
            <div className={`py-8 text-center text-xs flex items-center justify-center gap-2 ${
              isWhite ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                isWhite ? 'border-neutral-900' : 'border-white'
              }`} />
              <span>Recherche globale en cours...</span>
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className={`py-12 text-center text-xs ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Aucun résultat direct trouvé pour « {query} ».
            </div>
          )}

          {/* Verses results */}
          {verses.length > 0 && (
            <div className="space-y-2">
              <div className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Passages bibliques ({verses.length})</span>
              </div>
              <div className="space-y-2">
                {verses.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onClose();
                      onSelectTab?.('bible');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isWhite
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                        : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isWhite ? 'text-neutral-950' : 'text-white'}>
                        {v.bookName} {v.chapter}:{v.verse}
                      </span>
                      <span className={`text-[10px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {v.translation}
                      </span>
                    </div>
                    <p className={`text-xs font-serif mt-1 italic ${isWhite ? 'text-neutral-800' : 'text-neutral-200'}`}>
                      « {v.text} »
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theological Dictionary results */}
          {dictionary.length > 0 && (
            <div className="space-y-2">
              <div className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Dictionnaire théologique ({dictionary.length})</span>
              </div>
              <div className="space-y-2">
                {dictionary.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onClose();
                      onSelectTab?.('dictionary');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isWhite
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                        : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                      {d.term}
                    </span>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {d.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Characters results */}
          {characters.length > 0 && (
            <div className="space-y-2">
              <div className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <Users className="w-3.5 h-3.5" />
                <span>Personnages bibliques ({characters.length})</span>
              </div>
              <div className="space-y-2">
                {characters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onSelectTab?.('characters');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isWhite
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                        : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isWhite ? 'text-neutral-950' : 'text-white'}>{c.name}</span>
                      <span className={`text-[10px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {c.era}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {c.presentation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stories results */}
          {stories.length > 0 && (
            <div className="space-y-2">
              <div className={`text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                <BookMarked className="w-3.5 h-3.5" />
                <span>Histoires bibliques ({stories.length})</span>
              </div>
              <div className="space-y-2">
                {stories.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onClose();
                      onSelectTab?.('stories');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isWhite
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                        : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                      {s.title}
                    </span>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {s.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
