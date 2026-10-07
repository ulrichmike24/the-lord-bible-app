import React, { useState } from 'react';
import { Video, FileText, Sparkles, Copy, Check, Film } from 'lucide-react';
import { api, AiChatResponse } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface ContentStudioViewProps {
  translation: 'LSG' | 'KJV';
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ translation }) => {
  const { isWhite } = useTheme();
  const [activeStudio, setActiveStudio] = useState<'video' | 'content'>('video');

  // Video studio state
  const [videoTopic, setVideoTopic] = useState<string>('L\'histoire et la foi inébranlable de Joseph en Égypte');
  const [videoDuration, setVideoDuration] = useState<string>('3 minutes');
  const [videoAudience, setVideoAudience] = useState<string>('Jeunes & réseaux sociaux (YouTube / TikTok)');
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [videoResult, setVideoResult] = useState<AiChatResponse | null>(null);

  // Content studio state
  const [contentTopic, setContentTopic] = useState<string>('Comment triompher du doute par les promesses divines');
  const [contentType, setContentType] = useState<string>('Article d\'édification');
  const [contentTone, setContentTone] = useState<string>('Pastoral & encourageant');
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [contentResult, setContentResult] = useState<AiChatResponse | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateVideo = async () => {
    if (!videoTopic.trim()) return;
    setVideoLoading(true);
    setVideoResult(null);
    try {
      const res = await api.generateVideoScript(videoTopic, videoDuration, videoAudience, translation);
      setVideoResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentTopic.trim()) return;
    setContentLoading(true);
    setContentResult(null);
    try {
      const res = await api.generateContent(contentTopic, contentType, contentTone, translation);
      setContentResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* HEADER WITH SWITCH */}
      <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 transition-colors ${
        isWhite
          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
          : 'bg-neutral-950/80 border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isWhite ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-950'
            }`}>
              {activeStudio === 'video' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                Bible Content & Video Studios
              </h1>
              <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Générez des scripts vidéo professionnels et des contenus d'édification chrétienne de haute qualité.
              </p>
            </div>
          </div>

          {/* STUDIO MODE TABS */}
          <div className={`flex items-center p-1 rounded-2xl border ${
            isWhite ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <button
              onClick={() => setActiveStudio('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeStudio === 'video'
                  ? isWhite
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-950 border-white shadow-xs'
                  : isWhite
                  ? 'text-neutral-600 hover:text-black border-transparent'
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Script Studio</span>
            </button>

            <button
              onClick={() => setActiveStudio('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeStudio === 'content'
                  ? isWhite
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-950 border-white shadow-xs'
                  : isWhite
                  ? 'text-neutral-600 hover:text-black border-transparent'
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Content Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIDEO SCRIPT STUDIO */}
      {activeStudio === 'video' && (
        <div className="space-y-6">
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm transition-colors ${
            isWhite
              ? 'bg-white border-neutral-200 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-neutral-100'
          }`}>
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isWhite ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              <Film className="w-4 h-4" />
              <span>Générateur de Script Vidéo Scripturaire</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-3 space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  Sujet ou histoire biblique de la vidéo
                </label>
                <input
                  type="text"
                  value={videoTopic}
                  onChange={e => setVideoTopic(e.target.value)}
                  placeholder="Ex: L'histoire de Joseph, David contre Goliath, Pourquoi Jésus est mort..."
                  className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>Durée visée</label>
                <select
                  value={videoDuration}
                  onChange={e => setVideoDuration(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                >
                  <option value="60 secondes">Format Court (Reels / Shorts / 60s)</option>
                  <option value="3 minutes">Moyen (3 minutes)</option>
                  <option value="5 minutes">Standard (5 minutes)</option>
                  <option value="10 minutes">Long métrage / Prédication (10 minutes)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>Audience cible</label>
                <select
                  value={videoAudience}
                  onChange={e => setVideoAudience(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                >
                  <option value="Jeunes & réseaux sociaux (YouTube / TikTok)">Jeunes & Réseaux sociaux</option>
                  <option value="Tous publics & familles">Grand public & Familles</option>
                  <option value="Chrétiens affermis & responsables">Chrétiens affermis</option>
                  <option value="Personnes en quête spirituelle">En quête spirituelle</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoLoading || !videoTopic.trim()}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
                    isWhite
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{videoLoading ? 'Conception...' : 'Générer le script'}</span>
                </button>
              </div>
            </div>
          </div>

          {videoLoading && (
            <div className={`py-16 text-center space-y-3 rounded-3xl border ${
              isWhite ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                isWhite ? 'border-neutral-900' : 'border-white'
              }`} />
              <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Écriture du script avec découpage visuel, voix off et références...
              </p>
            </div>
          )}

          {videoResult && (
            <div className={`border rounded-3xl p-6 sm:p-10 shadow-sm space-y-5 transition-colors ${
              isWhite
                ? 'bg-white border-neutral-200 text-neutral-900'
                : 'bg-neutral-950 border-neutral-800 text-neutral-100'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isWhite ? 'border-neutral-200' : 'border-neutral-800'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  Script vidéo finalisé ({videoDuration})
                </span>
                <button
                  onClick={() => handleCopy(videoResult.answer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isWhite
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le script'}</span>
                </button>
              </div>

              <div className={`max-w-none text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line ${
                isWhite ? 'text-neutral-800' : 'text-neutral-200'
              }`}>
                {videoResult.answer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENT STUDIO */}
      {activeStudio === 'content' && (
        <div className="space-y-6">
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm transition-colors ${
            isWhite
              ? 'bg-white border-neutral-200 text-neutral-900'
              : 'bg-neutral-950 border-neutral-800 text-neutral-100'
          }`}>
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isWhite ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              <FileText className="w-4 h-4" />
              <span>Rédaction de Contenus Chrétiens & Théologiques</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-3 space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  Thème ou réflexion à développer
                </label>
                <input
                  type="text"
                  value={contentTopic}
                  onChange={e => setContentTopic(e.target.value)}
                  placeholder="Ex: La puissance du pardon, Trouver la paix dans l'anxiété..."
                  className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>Format de contenu</label>
                <select
                  value={contentType}
                  onChange={e => setContentType(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                >
                  <option value="Article d'édification">Article d'édification</option>
                  <option value="Publication pour réseaux sociaux">Post Réseaux Sociaux (Instagram/Facebook)</option>
                  <option value="Résumé théologique">Résumé théologique synthétique</option>
                  <option value="Plan de prédication">Plan d'exhortation / Prédication</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>Tonalité</label>
                <select
                  value={contentTone}
                  onChange={e => setContentTone(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${
                    isWhite
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-800 focus:border-neutral-950'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                >
                  <option value="Pastoral & encourageant">Pastoral & Encourageant</option>
                  <option value="Doctrinal & rigoureux">Doctrinal & Rigoureux</option>
                  <option value="Pratique & accessible">Pratique & Accessible</option>
                  <option value="Méditatif & poétique">Méditatif & Poétique</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateContent}
                  disabled={contentLoading || !contentTopic.trim()}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
                    isWhite
                      ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                      : 'bg-white hover:bg-neutral-200 text-neutral-950'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{contentLoading ? 'Rédaction...' : 'Rédiger le contenu'}</span>
                </button>
              </div>
            </div>
          </div>

          {contentLoading && (
            <div className={`py-16 text-center space-y-3 rounded-3xl border ${
              isWhite ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                isWhite ? 'border-neutral-900' : 'border-white'
              }`} />
              <p className={`text-xs ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Rédaction en cours avec intégration des Écritures...
              </p>
            </div>
          )}

          {contentResult && (
            <div className={`border rounded-3xl p-6 sm:p-10 shadow-sm space-y-5 transition-colors ${
              isWhite
                ? 'bg-white border-neutral-200 text-neutral-900'
                : 'bg-neutral-950 border-neutral-800 text-neutral-100'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isWhite ? 'border-neutral-200' : 'border-neutral-800'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  {contentType} • {contentTone}
                </span>
                <button
                  onClick={() => handleCopy(contentResult.answer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isWhite
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
                </button>
              </div>

              <div className={`max-w-none text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line ${
                isWhite ? 'text-neutral-800' : 'text-neutral-200'
              }`}>
                {contentResult.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
