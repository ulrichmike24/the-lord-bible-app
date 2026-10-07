import React, { useState, useEffect } from 'react';
import { FolderHeart, Bookmark, FileText, Trash2 } from 'lucide-react';
import { VerseRecord, api } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

export const LibraryView: React.FC = () => {
  const { isWhite } = useTheme();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteRecords, setFavoriteRecords] = useState<Record<string, VerseRecord>>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'favorites' | 'notes'>('favorites');

  useEffect(() => {
    try {
      const favs = localStorage.getItem('bible_ai_favorites');
      if (favs) setFavorites(JSON.parse(favs));

      const recs = localStorage.getItem('bible_ai_favorite_records');
      if (recs) setFavoriteRecords(JSON.parse(recs));

      const nts = localStorage.getItem('bible_ai_notes');
      if (nts) setNotes(JSON.parse(nts));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch missing verses asynchronously if any are not in favoriteRecords
  useEffect(() => {
    if (favorites.length === 0) return;

    favorites.forEach(async (id) => {
      if (!favoriteRecords[id]) {
        // ID format: TRANSLATION_BOOK_CHAPTER_VERSE e.g. LSG_JHN_3_16
        const parts = id.split('_');
        if (parts.length >= 4) {
          const translation = (parts[0] === 'KJV' ? 'KJV' : 'LSG') as 'LSG' | 'KJV';
          const bookId = parts[1];
          const chapter = parseInt(parts[2], 10);
          const verse = parseInt(parts[3], 10);

          if (!isNaN(chapter) && !isNaN(verse)) {
            const fetched = await api.getVerse(bookId, chapter, verse, translation);
            if (fetched) {
              setFavoriteRecords(prev => {
                const next = { ...prev, [id]: fetched };
                try {
                  localStorage.setItem('bible_ai_favorite_records', JSON.stringify(next));
                } catch {}
                return next;
              });
            }
          }
        }
      }
    });
  }, [favorites]);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f !== id);
    setFavorites(updated);
    localStorage.setItem('bible_ai_favorites', JSON.stringify(updated));

    const updatedRecs = { ...favoriteRecords };
    delete updatedRecs[id];
    setFavoriteRecords(updatedRecs);
    localStorage.setItem('bible_ai_favorite_records', JSON.stringify(updatedRecs));
  };

  const removeNote = (id: string) => {
    const updated = { ...notes };
    delete updated[id];
    setNotes(updated);
    localStorage.setItem('bible_ai_notes', JSON.stringify(updated));
  };

  const favoriteVerses: VerseRecord[] = favorites.map(id => {
    if (favoriteRecords[id]) {
      return favoriteRecords[id];
    }
    const parts = id.split('_');
    const bookName = parts[1] || 'Passage';
    const chapter = parseInt(parts[2] || '1', 10);
    const verse = parseInt(parts[3] || '1', 10);
    const translation = (parts[0] || 'LSG') as 'LSG' | 'KJV';

    return {
      id,
      translation,
      bookId: parts[1] || 'REF',
      bookName,
      chapter: isNaN(chapter) ? 1 : chapter,
      verse: isNaN(verse) ? 1 : verse,
      text: 'Chargement du verset sauvegardé...',
    };
  });

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
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
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Ma Bibliothèque Personnelle
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Retrouvez vos versets favoris, vos notes d'études spirituelles et vos réflexions.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'favorites'
                ? isWhite
                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                  : 'bg-white text-neutral-950 border-white shadow-xs'
                : isWhite
                ? 'bg-white text-neutral-700 hover:text-black border-neutral-300 hover:bg-neutral-100'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Versets favoris ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'notes'
                ? isWhite
                  ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                  : 'bg-white text-neutral-950 border-white shadow-xs'
                : isWhite
                ? 'bg-white text-neutral-700 hover:text-black border-neutral-300 hover:bg-neutral-100'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mes notes ({Object.keys(notes).length})</span>
          </button>
        </div>
      </div>

      {/* CONTENT LIST */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteVerses.length > 0 ? (
            favoriteVerses.map(v => (
              <div
                key={v.id}
                className={`p-5 rounded-2xl border space-y-2 transition-all ${
                  isWhite
                    ? 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs text-neutral-900'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 shadow-xs text-neutral-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-bold ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                    {v.bookName} {v.chapter}:{v.verse} ({v.translation})
                  </div>
                  <button
                    onClick={() => removeFavorite(v.id)}
                    className={`p-1 rounded-lg ${isWhite ? 'text-neutral-400 hover:text-red-600' : 'text-neutral-500 hover:text-red-400'}`}
                    title="Supprimer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className={`font-serif italic text-sm ${isWhite ? 'text-neutral-800' : 'text-neutral-200'}`}>
                  « {v.text} »
                </p>
              </div>
            ))
          ) : (
            <div className={`py-16 text-center text-xs rounded-3xl border ${
              isWhite ? 'text-neutral-500 bg-neutral-50 border-neutral-200' : 'text-neutral-400 bg-neutral-900/30 border-neutral-800/60'
            }`}>
              Aucun verset favori pour le moment. Cliquez sur l'icône marque-page dans le lecteur biblique.
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          {Object.keys(notes).length > 0 ? (
            Object.entries(notes).map(([id, noteText]) => (
              <div
                key={id}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${
                  isWhite
                    ? 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs text-neutral-900'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 shadow-xs text-neutral-100'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b text-xs font-bold ${
                  isWhite ? 'border-neutral-200 text-neutral-900' : 'border-neutral-800 text-white'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Note sur verset ({id})</span>
                  </div>
                  <button
                    onClick={() => removeNote(id)}
                    className={`p-1 rounded-lg ${isWhite ? 'text-neutral-400 hover:text-red-600' : 'text-neutral-500 hover:text-red-400'}`}
                    title="Supprimer la note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                  isWhite ? 'text-neutral-800' : 'text-neutral-200'
                }`}>
                  {noteText}
                </p>
              </div>
            ))
          ) : (
            <div className={`py-16 text-center text-xs rounded-3xl border ${
              isWhite ? 'text-neutral-500 bg-neutral-50 border-neutral-200' : 'text-neutral-400 bg-neutral-900/30 border-neutral-800/60'
            }`}>
              Aucune note personnelle enregistrée pour le moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
