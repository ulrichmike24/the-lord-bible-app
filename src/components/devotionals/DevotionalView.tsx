import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Copy, Check } from 'lucide-react';
import { api, Devotional, AiChatResponse } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface DevotionalViewProps {
  translation: 'LSG' | 'KJV';
}

export const DevotionalView: React.FC<DevotionalViewProps> = ({ translation }) => {
  const { isWhite } = useTheme();
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [prayerTheme, setPrayerTheme] = useState<string>('reconnaissance');
  const [prayerPassage, setPrayerPassage] = useState<string>('Psaume 23');
  const [prayerResult, setPrayerResult] = useState<AiChatResponse | null>(null);
  const [prayerLoading, setPrayerLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    api.getTodayDevotional().then(setDevotional).catch(console.error);
  }, []);

  const prayerCategories = [
    { id: 'reconnaissance', label: 'Reconnaissance & Louange' },
    { id: 'foi', label: 'Foi & Confiance' },
    { id: 'paix', label: 'Paix & Protection' },
    { id: 'repentance', label: 'Repentance & Pardon' },
    { id: 'famille', label: 'Famille & Foyer' },
    { id: 'sagesse', label: 'Sagesse & Direction' },
  ];

  const handleGeneratePrayer = async () => {
    setPrayerLoading(true);
    setPrayerResult(null);
    try {
      const res = await api.generatePrayer(prayerTheme, prayerPassage, translation);
      setPrayerResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setPrayerLoading(false);
    }
  };

  const handleCopyPrayer = () => {
    if (!prayerResult) return;
    navigator.clipboard.writeText(prayerResult.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* TODAY'S DEVOTIONAL */}
      {devotional && (
        <div className={`border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-950 border-neutral-800 text-neutral-100'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isWhite ? 'border-neutral-200' : 'border-neutral-800'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
              isWhite ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              <Heart className={`w-4 h-4 ${isWhite ? 'fill-neutral-900 text-neutral-900' : 'fill-white text-white'}`} />
              <span>Méditation du jour • {devotional.dateKey}</span>
            </div>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
            {devotional.title}
          </h1>

          {/* VERSE CARD */}
          <blockquote className={`p-6 rounded-2xl border-l-4 font-serif text-base sm:text-lg italic space-y-2 border transition-colors ${
            isWhite
              ? 'bg-neutral-50 border-neutral-200 border-l-neutral-950 text-neutral-900'
              : 'bg-neutral-900 border-neutral-800 border-l-white text-neutral-100'
          }`}>
            <p>« {devotional.verseText} »</p>
            <cite className={`block not-italic text-xs font-sans font-bold ${
              isWhite ? 'text-neutral-900' : 'text-white'
            }`}>
              — {devotional.verseRef} ({devotional.translation})
            </cite>
          </blockquote>

          {/* REFLECTION & TEACHING */}
          <div className={`space-y-4 text-xs sm:text-sm leading-relaxed font-sans ${
            isWhite ? 'text-neutral-700' : 'text-neutral-300'
          }`}>
            <div className="space-y-1">
              <h3 className={`font-bold text-sm ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                Réflexion spirituelle
              </h3>
              <p>{devotional.reflection}</p>
            </div>

            <div className="space-y-1">
              <h3 className={`font-bold text-sm ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                Enseignement principal
              </h3>
              <p>{devotional.teaching}</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${
              isWhite
                ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                : 'bg-neutral-900 border-neutral-800 text-neutral-100'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${
                isWhite ? 'text-neutral-950' : 'text-white'
              }`}>
                Application pratique aujourd'hui
              </h4>
              <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-300'}`}>
                {devotional.practicalApplication}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${
              isWhite
                ? 'bg-white border-neutral-200 text-neutral-900'
                : 'bg-neutral-900 border-neutral-800 text-neutral-100'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${
                isWhite ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Question de réflexion personnelle
              </h4>
              <p className="text-xs italic">« {devotional.question} »</p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${
              isWhite
                ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                : 'bg-neutral-900 border-neutral-800 text-neutral-100'
            }`}>
              <h4 className={`font-bold text-xs uppercase tracking-wider ${
                isWhite ? 'text-neutral-950' : 'text-white'
              }`}>
                Prière guidée
              </h4>
              <p className="text-xs font-serif italic">« {devotional.prayer} »</p>
            </div>
          </div>
        </div>
      )}

      {/* SCRIPTURAL PRAYER GENERATOR */}
      <div className={`border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm transition-colors ${
        isWhite
          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
          : 'bg-neutral-950/80 border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isWhite ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-950'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Générateur de Prières Scripturaires
            </h2>
            <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Formulez une prière humble et fervente ancrée dans les Écritures pour nourrir votre dialogue avec Dieu.
            </p>
          </div>
        </div>

        {/* Categories chips */}
        <div className="space-y-2">
          <label className={`text-xs font-bold ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
            Thème de prière :
          </label>
          <div className="flex flex-wrap gap-2">
            {prayerCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setPrayerTheme(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  prayerTheme === cat.id
                    ? isWhite
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-white text-neutral-950 border-white shadow-xs'
                    : isWhite
                    ? 'bg-white text-neutral-700 hover:text-black border-neutral-300 hover:bg-neutral-100'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Biblical anchor passage */}
        <div className="space-y-2">
          <label className={`text-xs font-bold ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
            Passage biblique d'ancrage (facultatif) :
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prayerPassage}
              onChange={e => setPrayerPassage(e.target.value)}
              placeholder="Ex: Psaume 23, Philippiens 4:6-7, Ésaïe 40:31..."
              className={`flex-1 border rounded-2xl px-4 py-2.5 text-xs sm:text-sm outline-none transition-colors ${
                isWhite
                  ? 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                  : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
              }`}
            />
            <button
              onClick={handleGeneratePrayer}
              disabled={prayerLoading}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-40 ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{prayerLoading ? 'Rédaction...' : 'Prier avec la Parole'}</span>
            </button>
          </div>
        </div>

        {/* Prayer Result */}
        {prayerResult && (
          <div className={`p-6 rounded-2xl border space-y-3 transition-colors ${
            isWhite
              ? 'bg-white border-neutral-300 text-neutral-900'
              : 'bg-neutral-900 border-neutral-700 text-neutral-100'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b text-xs font-bold ${
              isWhite ? 'border-neutral-200 text-neutral-900' : 'border-neutral-800 text-white'
            }`}>
              <span>Prière scripturaire inspirée</span>
              <button
                onClick={handleCopyPrayer}
                className={`flex items-center gap-1 text-xs font-normal ${
                  isWhite ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            <div className="font-serif italic text-sm leading-relaxed whitespace-pre-line">
              {prayerResult.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
