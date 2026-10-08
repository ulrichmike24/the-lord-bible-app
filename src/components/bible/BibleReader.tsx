import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Copy,
  Share2,
  Bookmark,
  FileText,
  Check,
  X,
  Volume2,
} from 'lucide-react';
import { api, BibleBook, ChapterData, VerseRecord, AiChatResponse, FALLBACK_BIBLE_BOOKS } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface BibleReaderProps {
  translation: 'LSG' | 'KJV';
  setTranslation: (t: 'LSG' | 'KJV') => void;
  onNavigateToAiExplanation?: (verse: VerseRecord) => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  translation,
  setTranslation,
  onNavigateToAiExplanation,
}) => {
  const { isWhite } = useTheme();
  const [books, setBooks] = useState<BibleBook[]>(FALLBACK_BIBLE_BOOKS);
  const [selectedBookId, setSelectedBookId] = useState<string>('GEN');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Verse selection drawer
  const [selectedVerse, setSelectedVerse] = useState<VerseRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNotes, setSavedNotes] = useState<{ [key: string]: string }>({});
  const [currentNote, setCurrentNote] = useState<string>('');
  const [noteOpen, setNoteOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // AI Verse Explanation in modal
  const [explainingAi, setExplainingAi] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<AiChatResponse | null>(null);

  // Book selection modal
  const [bookModalOpen, setBookModalOpen] = useState<boolean>(false);
  const [bookFilter, setBookFilter] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [bookSearch, setBookSearch] = useState<string>('');

  // Reader Font Size scaling for mobile & desktop
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('bible_ai_font_size') || '18', 10);
    } catch {
      return 18;
    }
  });

  const updateFontSize = (delta: number) => {
    setFontSize(prev => {
      const next = Math.min(26, Math.max(14, prev + delta));
      try {
        localStorage.setItem('bible_ai_font_size', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Initial load
  useEffect(() => {
    api.getBooks().then(loadedBooks => {
      if (loadedBooks && loadedBooks.length > 0) {
        setBooks(loadedBooks);
      }
    }).catch(console.error);

    // Load saved favorites & notes from localStorage
    try {
      const favs = localStorage.getItem('bible_ai_favorites');
      if (favs) setFavorites(JSON.parse(favs));
      const notes = localStorage.getItem('bible_ai_notes');
      if (notes) setSavedNotes(JSON.parse(notes));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Fetch chapter
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    api.getChapter(selectedBookId, currentChapter, translation)
      .then(data => {
        if (!isCancelled) {
          setChapterData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching chapter:', err);
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedBookId, currentChapter, translation]);

  const currentBook = books.find(b => b.id === selectedBookId) || 
    FALLBACK_BIBLE_BOOKS.find(b => b.id === selectedBookId) || 
    FALLBACK_BIBLE_BOOKS[0];

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(c => c - 1);
    } else {
      // Go to previous book if exists
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setSelectedBookId(prevBook.id);
        setCurrentChapter(prevBook.chaptersCount);
      }
    }
    setSelectedVerse(null);
  };

  const handleNextChapter = () => {
    if (currentChapter < currentBook.chaptersCount) {
      setCurrentChapter(c => c + 1);
    } else {
      // Go to next book if exists
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setSelectedBookId(nextBook.id);
        setCurrentChapter(1);
      }
    }
    setSelectedVerse(null);
  };

  const handleCopyVerse = (verse: VerseRecord) => {
    const textToCopy = `« ${verse.text} » — ${verse.bookName} ${verse.chapter}:${verse.verse} (${verse.translation})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = (verse: VerseRecord) => {
    const id = verse.id;
    let newFavs: string[];
    let storedRecords: Record<string, VerseRecord> = {};
    try {
      storedRecords = JSON.parse(localStorage.getItem('bible_ai_favorite_records') || '{}');
    } catch {}

    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
      delete storedRecords[id];
    } else {
      newFavs = [...favorites, id];
      storedRecords[id] = verse;
    }
    setFavorites(newFavs);
    localStorage.setItem('bible_ai_favorites', JSON.stringify(newFavs));
    localStorage.setItem('bible_ai_favorite_records', JSON.stringify(storedRecords));
  };

  const handleSaveNote = () => {
    if (!selectedVerse) return;
    const newNotes = { ...savedNotes, [selectedVerse.id]: currentNote };
    setSavedNotes(newNotes);
    localStorage.setItem('bible_ai_notes', JSON.stringify(newNotes));
    setNoteOpen(false);
  };

  const handleExplainWithAi = async (verse: VerseRecord) => {
    if (onNavigateToAiExplanation) {
      onNavigateToAiExplanation(verse);
      return;
    }

    setExplainingAi(true);
    setAiExplanation(null);
    try {
      const response = await api.explainVerse(
        verse.bookName,
        verse.chapter,
        verse.verse,
        verse.text,
        translation
      );
      setAiExplanation(response);
    } catch (err) {
      console.error(err);
    } finally {
      setExplainingAi(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = translation === 'LSG' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredBooks = books.filter(b => {
    if (bookFilter === 'AT' && b.testament !== 'AT') return false;
    if (bookFilter === 'NT' && b.testament !== 'NT') return false;
    if (bookSearch) {
      const s = bookSearch.toLowerCase();
      return b.name.toLowerCase().includes(s) || b.englishName.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6 pb-20">
      {/* TOP CONTROLS & BREADCRUMB */}
      <div className={`border rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 shadow-xs sticky top-16 z-20 backdrop-blur-md transition-colors ${
        isWhite
          ? 'bg-white/95 border-neutral-200 text-neutral-900'
          : 'bg-neutral-950/95 border-neutral-800 text-neutral-100'
      }`}>
        {/* Book & Chapter selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setBookModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 min-h-[42px] rounded-xl font-bold text-xs sm:text-sm border transition-all ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-700'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">{currentBook.name}</span>
          </button>

          {/* Chapter Selector Dropdown */}
          <select
            value={currentChapter}
            onChange={e => setCurrentChapter(parseInt(e.target.value, 10))}
            className={`border text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-2 min-h-[42px] outline-none transition-colors ${
              isWhite
                ? 'bg-neutral-100 border-neutral-300 text-neutral-900 focus:border-neutral-950'
                : 'bg-neutral-900 border-neutral-700 text-white focus:border-white'
            }`}
          >
            {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(c => (
              <option key={c} value={c}>
                Ch. {c}
              </option>
            ))}
          </select>
        </div>

        {/* Previous / Next chapter buttons & Font Size Adjustments */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrevChapter}
            className={`p-2 min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl border transition-all ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
            }`}
            title="Chapitre précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-xs font-semibold px-1 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
            {currentChapter}/{currentBook.chaptersCount}
          </span>
          <button
            onClick={handleNextChapter}
            className={`p-2 min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl border transition-all ${
              isWhite
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
            }`}
            title="Chapitre suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Font size adjustments */}
          <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => updateFontSize(-1)}
              className={`px-2 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold transition-all ${
                isWhite
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
              title="Diminuer la taille de police (Mobile & Desktop)"
            >
              A-
            </button>
            <button
              onClick={() => updateFontSize(1)}
              className={`px-2 py-1.5 min-h-[38px] rounded-lg border text-xs font-bold transition-all ${
                isWhite
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
              title="Agrandir la taille de police (Mobile & Desktop)"
            >
              A+
            </button>
          </div>
        </div>

        {/* Quick book shortcuts */}
        <div className="w-full flex items-center justify-between gap-2 pt-2 border-t text-xs border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            <span className={`text-[11px] font-semibold shrink-0 ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>Accès rapide :</span>
            {[
              { id: 'GEN', name: 'Genèse' },
              { id: 'PSA', name: 'Psaumes' },
              { id: 'PRO', name: 'Proverbes' },
              { id: 'MAT', name: 'Matthieu' },
              { id: 'JHN', name: 'Jean' },
              { id: 'ROM', name: 'Romains' },
              { id: 'REV', name: 'Apocalypse' }
            ].map(qb => (
              <button
                key={qb.id}
                onClick={() => {
                  setSelectedBookId(qb.id);
                  setCurrentChapter(1);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-colors shrink-0 ${
                  selectedBookId === qb.id
                    ? isWhite
                      ? 'bg-neutral-950 text-white border-neutral-950 font-bold'
                      : 'bg-white text-neutral-950 border-white font-bold'
                    : isWhite
                    ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                {qb.name}
              </button>
            ))}
          </div>

          <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
            isWhite ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase & Local Sync</span>
          </div>
        </div>
      </div>

      {/* READING VIEW (WHITE & BLACK PAPER AESTHETIC) */}
      <div className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-sm max-w-4xl mx-auto transition-colors ${
        isWhite
          ? 'bg-white border-neutral-200 text-neutral-900'
          : 'bg-neutral-950 border-neutral-800 text-neutral-100'
      }`}>
        {/* Chapter Title */}
        <div className={`text-center pb-6 sm:pb-8 border-b space-y-2 ${
          isWhite ? 'border-neutral-200' : 'border-neutral-800'
        }`}>
          <div className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest ${
            isWhite ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            {currentBook.testament === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'} • {currentBook.category}
          </div>
          <h1 className={`text-2xl sm:text-4xl font-black ${
            isWhite ? 'text-neutral-950' : 'text-white'
          }`}>
            {currentBook.name} {currentChapter}
          </h1>
          <div className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs ${
            isWhite ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            <span>Traduction : {translation === 'LSG' ? 'Louis Segond 1910' : 'King James Version (KJV)'}</span>
            {chapterData?.verses && chapterData.verses.length > 0 && (
              <>
                <span>•</span>
                <span className={`font-bold ${isWhite ? 'text-neutral-900' : 'text-white'}`}>
                  {chapterData.verses.length} versets
                </span>
              </>
            )}
          </div>
        </div>

        {/* Verses list */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
              isWhite ? 'border-neutral-900' : 'border-white'
            }`} />
            <p className={`text-xs ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Chargement de la Parole...
            </p>
          </div>
        ) : (
          <div
            style={{ fontSize: `${fontSize}px` }}
            className={`space-y-3 sm:space-y-4 pt-6 sm:pt-8 font-serif leading-relaxed ${
              isWhite ? 'text-neutral-900' : 'text-neutral-200'
            }`}
          >
            {chapterData?.verses && chapterData.verses.length > 0 ? (
              chapterData.verses.map(v => {
                const isFav = favorites.includes(v.id);
                const hasNote = Boolean(savedNotes[v.id]);
                const isSelected = selectedVerse?.id === v.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      if (selectedVerse?.id === v.id) {
                        setSelectedVerse(null);
                      } else {
                        setSelectedVerse(v);
                        if (savedNotes[v.id]) setCurrentNote(savedNotes[v.id]);
                        else setCurrentNote('');
                      }
                    }}
                    className={`group relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? isWhite
                          ? 'bg-neutral-100 border-neutral-300 shadow-xs'
                          : 'bg-neutral-900 border-neutral-700 shadow-xs'
                        : isWhite
                        ? 'hover:bg-neutral-50/90 border-transparent hover:border-neutral-200'
                        : 'hover:bg-neutral-900/60 border-transparent hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <span className={`select-none shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-lg border mt-1 ${
                        isSelected
                          ? isWhite
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-950 border-white'
                          : isWhite
                          ? 'bg-neutral-100 text-neutral-700 border-neutral-200 group-hover:border-neutral-300'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 group-hover:border-neutral-700'
                      }`}>
                        {v.verse}
                      </span>
                      <p className="flex-1 leading-relaxed">
                        {v.text}
                      </p>
                      {/* Favorite/Note indicator flags */}
                      <div className="shrink-0 flex items-center gap-1.5 pt-1">
                        {isFav && (
                          <Bookmark className={`w-3.5 h-3.5 ${
                            isWhite ? 'fill-neutral-900 text-neutral-900' : 'fill-white text-white'
                          }`} />
                        )}
                        {hasNote && (
                          <FileText className={`w-3.5 h-3.5 ${
                            isWhite ? 'text-neutral-700' : 'text-neutral-300'
                          }`} />
                        )}
                      </div>
                    </div>

                    {/* Display inline note preview if available */}
                    {hasNote && (
                      <div className={`mt-2 ml-8 sm:ml-9 p-2.5 rounded-xl border text-xs font-sans italic ${
                        isWhite
                          ? 'bg-neutral-100 border-neutral-200 text-neutral-700'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}>
                        <span className="font-bold not-italic">Ma Note :</span> {savedNotes[v.id]}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={`py-16 text-center text-xs border rounded-2xl ${
                isWhite ? 'text-neutral-500 bg-neutral-50 border-neutral-200' : 'text-neutral-400 bg-neutral-900/40 border-neutral-800'
              }`}>
                Chapitre en cours de chargement ou versets non indexés.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FLOATING ACTION TOOLBAR FOR SELECTED VERSE */}
      {selectedVerse && (
        <div className="fixed bottom-20 lg:bottom-6 inset-x-2 sm:inset-x-4 max-w-xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`border rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-wrap items-center justify-between gap-2 backdrop-blur-md ${
            isWhite
              ? 'bg-white/95 border-neutral-300 text-neutral-900 shadow-neutral-900/10'
              : 'bg-neutral-950/95 border-neutral-700 text-white shadow-black/40'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                isWhite
                  ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                  : 'bg-neutral-900 text-white border-neutral-700'
              }`}>
                {selectedVerse.bookName} {selectedVerse.chapter}:{selectedVerse.verse}
              </span>
              <button
                onClick={() => setSelectedVerse(null)}
                className={`p-1 rounded-lg ${isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleCopyVerse(selectedVerse)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isWhite
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                onClick={() => handleToggleFavorite(selectedVerse)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  favorites.includes(selectedVerse.id)
                    ? isWhite
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-white text-neutral-950 border-white'
                    : isWhite
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${favorites.includes(selectedVerse.id) ? 'fill-current' : ''}`} />
                <span>Favori</span>
              </button>

              <button
                onClick={() => setNoteOpen(true)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isWhite
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>

              <button
                onClick={() => handleSpeak(selectedVerse.text)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isWhite
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
                title="Écouter la lecture audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Audio</span>
              </button>
            </div>

            {/* AI EXPLANATION BUTTON */}
            <button
              onClick={() => handleExplainWithAi(selectedVerse)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl font-extrabold text-xs shadow-md active:scale-95 transition-all ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Expliquer avec Bible AI</span>
            </button>
          </div>
        </div>
      )}

      {/* NOTE MODAL */}
      {noteOpen && selectedVerse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl transition-colors ${
            isWhite
              ? 'bg-white border-neutral-200 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <h3 className="font-bold text-sm">
                Note personnelle sur {selectedVerse.bookName} {selectedVerse.chapter}:{selectedVerse.verse}
              </h3>
              <button onClick={() => setNoteOpen(false)} className={isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={currentNote}
              onChange={e => setCurrentNote(e.target.value)}
              placeholder="Écrivez votre réflexion spirituelle, méditation ou application pratique..."
              className={`w-full h-36 border rounded-xl p-3 text-xs outline-none font-sans resize-none transition-colors ${
                isWhite
                  ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
              }`}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setNoteOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs ${isWhite ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveNote}
                className={`px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isWhite
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                Enregistrer la note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI EXPLANATION MODAL */}
      {(explainingAi || aiExplanation) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 custom-scrollbar transition-colors ${
            isWhite
              ? 'bg-white border-neutral-300 text-neutral-900'
              : 'bg-neutral-950 border-neutral-700 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isWhite ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-900 text-white'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    Explication théologique par Bible AI
                  </h3>
                  <p className={`text-[11px] font-semibold ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {aiExplanation?.agentName || 'Verse Explanation Agent'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAiExplanation(null);
                  setExplainingAi(false);
                }}
                className={`p-1.5 rounded-full ${
                  isWhite ? 'bg-neutral-100 text-neutral-600 hover:text-black' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {explainingAi ? (
              <div className="py-16 text-center space-y-4">
                <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                  isWhite ? 'border-neutral-900' : 'border-white'
                }`} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Analyse exégétique en cours...</p>
                  <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Consultation des Écritures, du contexte historique et des références croisées.
                  </p>
                </div>
              </div>
            ) : (
              aiExplanation && (
                <div className={`space-y-6 text-sm leading-relaxed font-sans whitespace-pre-line ${
                  isWhite ? 'text-neutral-800' : 'text-neutral-200'
                }`}>
                  {aiExplanation.answer}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* BOOK SELECTION MODAL */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl transition-colors ${
            isWhite
              ? 'bg-white border-neutral-200 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className={`flex items-center justify-between pb-3 sm:pb-4 border-b ${
              isWhite ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <h3 className="font-bold text-sm sm:text-base">Choisir un livre de la Bible</h3>
              <button
                onClick={() => setBookModalOpen(false)}
                className={`p-2 min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center ${
                  isWhite ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and search */}
            <div className="pt-3 pb-2 space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(['ALL', 'AT', 'NT'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setBookFilter(tab)}
                    className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-all shrink-0 ${
                      bookFilter === tab
                        ? isWhite
                          ? 'bg-neutral-950 text-white'
                          : 'bg-white text-neutral-950'
                        : isWhite
                        ? 'bg-neutral-100 text-neutral-600 hover:text-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab === 'ALL'
                      ? 'Tous (66)'
                      : tab === 'AT'
                      ? 'Ancien Testament (39)'
                      : 'Nouveau Testament (27)'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isWhite ? 'text-neutral-400' : 'text-neutral-500'}`} />
                <input
                  type="text"
                  value={bookSearch}
                  onChange={e => setBookSearch(e.target.value)}
                  placeholder="Filtrer les livres (ex: Genèse, Jean, Romains)..."
                  className={`w-full border rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-900'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                />
              </div>
            </div>

            {/* Books grid */}
            <div className="overflow-y-auto custom-scrollbar flex-1 py-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {filteredBooks.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBookId(b.id);
                    setCurrentChapter(1);
                    setBookModalOpen(false);
                  }}
                  className={`text-left p-2.5 sm:p-3 min-h-[48px] rounded-xl text-xs font-semibold transition-all border ${
                    selectedBookId === b.id
                      ? isWhite
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-neutral-950 border-white shadow-xs'
                      : isWhite
                      ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                      : 'bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                  }`}
                >
                  <div className="truncate font-bold">{b.name}</div>
                  <div className={`text-[10px] font-normal ${
                    selectedBookId === b.id
                      ? isWhite ? 'text-neutral-300' : 'text-neutral-600'
                      : isWhite ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    {b.chaptersCount} chapitres
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
