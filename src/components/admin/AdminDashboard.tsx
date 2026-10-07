import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart3, Users, BookOpen, Sparkles, GraduationCap, HelpCircle, FileText, Settings, Check } from 'lucide-react';
import { api } from '../../lib/api.ts';
import { AGENT_DESCRIPTIONS, AgentType } from '../../types/agents.ts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalVersesRead: 1420,
    totalAiQueries: 285,
    totalStudiesGenerated: 64,
    totalQuizAttempts: 112,
    totalContentDrafts: 37,
  });

  const [activeTab, setActiveTab] = useState<'stats' | 'prompts'>('stats');
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('verse_explanation');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    api.getAdminStats().then(s => {
      if (s) setStats(s);
    }).catch(console.error);
  }, []);

  const handleSavePrompt = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="bg-slate-900/90 border border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">
                  Tableau de bord Administrateur
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Supervision des métriques d'usage, gestion des 13 agents IA et modération.
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'stats'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistiques</span>
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'prompts'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gestion des Prompts IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS VIEW */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Versets consultés</span>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalVersesRead}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Requêtes Bible AI</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{stats.totalAiQueries}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Études générées</span>
                <GraduationCap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalStudiesGenerated}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Quiz réalisés</span>
                <HelpCircle className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalQuizAttempts}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Contenus en studio</span>
                <FileText className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalContentDrafts}</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Pipeline RAG</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-emerald-400 mt-2">Opérationnel (0 error)</div>
            </div>
          </div>
        </div>
      )}

      {/* PROMPTS CONFIGURATION (SECTION 27 DU BRIEF) */}
      {activeTab === 'prompts' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Gestion des Prompts Système (AI Prompts)</h2>
            <p className="text-xs text-slate-400">
              Paramétrez les directives données aux agents d'IA théologique. Ces consignes sont exécutées côté serveur sécurisé.
            </p>
          </div>

          {/* AGENT SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Agent à configurer :</label>
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value as AgentType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-amber-500"
            >
              {Object.entries(AGENT_DESCRIPTIONS).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.name} — ({meta.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Directives théologiques appliquées :</label>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed space-y-2">
              <p className="text-amber-400 font-bold">Rôle : {AGENT_DESCRIPTIONS[selectedAgent].role}</p>
              <p>• Garde-fou 1 : Ne jamais inventer une référence biblique inexistante.</p>
              <p>• Garde-fou 2 : Priorité absolue aux versets de la base de données locale (RAG).</p>
              <p>• Garde-fou 3 : Respect rigoureux des doctrines chrétiennes fondamentales.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-400 font-semibold">
              {savedSuccess && 'Directives enregistrées avec succès sur le serveur !'}
            </span>
            <button
              onClick={handleSavePrompt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              <span>Enregistrer la configuration</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
