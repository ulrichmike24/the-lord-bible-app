import React, { useState } from 'react';
import { GraduationCap, Sparkles, Clock, Compass, Copy, Check } from 'lucide-react';
import { api, AiChatResponse } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface StudiesViewProps {
  translation: 'LSG' | 'KJV';
}

export const StudiesView: React.FC<StudiesViewProps> = ({ translation }) => {
  const { isWhite } = useTheme();
  const [topic, setTopic] = useState<string>('Le Saint-Esprit et sa puissance transformatrice');
  const [duration, setDuration] = useState<string>('30 minutes');
  const [level, setLevel] = useState<string>('Débutant');
  const [loading, setLoading] = useState<boolean>(false);
  const [studyResult, setStudyResult] = useState<AiChatResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleTopics = [
    'Le Saint-Esprit et sa puissance',
    'La foi face à l\'épreuve selon Jacques',
    'La grâce salvatrice dans l\'épître aux Romains',
    'Le combat spirituel et l\'armure de Dieu',
    'Le pardon et la guérison du cœur',
    'La souveraineté de Dieu dans le livre de Daniel',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStudyResult(null);

    try {
      const res = await api.generateStudy(topic, duration, level, translation);
      setStudyResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!studyResult) return;
    navigator.clipboard.writeText(studyResult.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Générateur d'Études Bibliques
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Concevez des parcours d'études théologiques structurés pour vos groupes de maison ou votre méditation personnelle.
            </p>
          </div>
        </div>

        {/* STUDY CONFIGURATION FORM */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3 space-y-2">
            <label className={`text-xs font-bold ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
              Sujet théologique ou passage biblique
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ex: Le Saint-Esprit, la foi, Romains 8..."
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors ${
                isWhite
                  ? 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                  : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold flex items-center gap-1.5 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Durée prévue</span>
            </label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                isWhite
                  ? 'bg-white border-neutral-300 text-neutral-800 focus:border-neutral-950'
                  : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
              }`}
            >
              <option value="15 minutes">15 minutes (Rapide)</option>
              <option value="30 minutes">30 minutes (Standard)</option>
              <option value="45 minutes">45 minutes (Approfondi)</option>
              <option value="1 heure">1 heure (Groupe d'étude)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold flex items-center gap-1.5 ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
              <Compass className="w-3.5 h-3.5" />
              <span>Niveau spirituel</span>
            </label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                isWhite
                  ? 'bg-white border-neutral-300 text-neutral-800 focus:border-neutral-950'
                  : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
              }`}
            >
              <option value="Débutant">Débutant (Accessible & clair)</option>
              <option value="Intermédiaire">Intermédiaire (Doctrinal)</option>
              <option value="Avancé">Avancé (Exégétique approfondi)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Génération...' : 'Générer l\'étude'}</span>
            </button>
          </div>
        </div>

        {/* PRESET TOPICS */}
        <div className="pt-2 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[10px] uppercase font-bold mr-1 ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Idées de sujets :
          </span>
          {sampleTopics.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                isWhite
                  ? 'bg-white hover:bg-neutral-100 text-neutral-700 hover:text-black border-neutral-200'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* GENERATION STATE OR RESULT */}
      {loading && (
        <div className={`py-20 text-center space-y-4 rounded-3xl border transition-colors ${
          isWhite ? 'bg-neutral-50/50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
        }`}>
          <div className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
            isWhite ? 'border-neutral-900' : 'border-white'
          }`} />
          <div className="space-y-1">
            <h3 className={`font-bold text-base ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Élaboration de l'étude biblique...
            </h3>
            <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Structuration des passages, points principaux, questions de groupe et prière.
            </p>
          </div>
        </div>
      )}

      {studyResult && (
        <div className={`border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-950 border-neutral-800 text-neutral-100'
        }`}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isWhite ? 'border-neutral-200' : 'border-neutral-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isWhite ? 'text-neutral-700' : 'text-neutral-300'
              }`}>
                Étude théologique personnalisée • {level} ({duration})
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isWhite
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier l\'étude'}</span>
            </button>
          </div>

          <div className={`max-w-none text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line space-y-4 ${
            isWhite ? 'text-neutral-800' : 'text-neutral-200'
          }`}>
            {studyResult.answer}
          </div>
        </div>
      )}
    </div>
  );
};
