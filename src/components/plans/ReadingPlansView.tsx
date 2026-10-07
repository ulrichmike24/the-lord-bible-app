import React, { useState, useEffect } from 'react';
import { CalendarCheck2, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { api, ReadingPlan } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface ReadingPlansViewProps {
  onReadPassage?: (passageRef: string) => void;
}

export const ReadingPlansView: React.FC<ReadingPlansViewProps> = ({ onReadPassage }) => {
  const { isWhite } = useTheme();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>('foi-7-jours');
  const [completedDays, setCompletedDays] = useState<{ [planId: string]: number[] }>({});

  useEffect(() => {
    api.getPlans().then(data => {
      setPlans(data);
      if (data.length > 0) setActivePlanId(data[0].id);
    }).catch(console.error);

    try {
      const saved = localStorage.getItem('bible_ai_reading_progress');
      if (saved) setCompletedDays(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const toggleDayCompleted = (planId: string, day: number) => {
    const planProgress = completedDays[planId] || [];
    let updated: number[];
    if (planProgress.includes(day)) {
      updated = planProgress.filter(d => d !== day);
    } else {
      updated = [...planProgress, day];
    }
    const newCompleted = { ...completedDays, [planId]: updated };
    setCompletedDays(newCompleted);
    localStorage.setItem('bible_ai_reading_progress', JSON.stringify(newCompleted));
  };

  const currentPlanDoneCount = (completedDays[activePlanId] || []).length;
  const currentPlanTotal = activePlan ? activePlan.days.length : 1;
  const progressPercent = Math.round((currentPlanDoneCount / currentPlanTotal) * 100);

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
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Plans de Lecture Biblique
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Cultivez une discipline spirituelle quotidienne et suivez votre progression jour après jour.
            </p>
          </div>
        </div>

        {/* PLAN SELECTOR PILLS */}
        <div className="flex flex-wrap gap-2 pt-2">
          {plans.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlanId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activePlanId === p.id
                  ? isWhite
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-950 border-white shadow-xs'
                  : isWhite
                  ? 'bg-white text-neutral-700 hover:text-black border-neutral-300 hover:bg-neutral-100'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {p.title} ({p.durationDays} j)
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE PLAN PROGRESS CARD */}
      {activePlan && (
        <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-950 border-neutral-800 text-neutral-100'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isWhite ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                {activePlan.category} • {activePlan.durationDays} Jours
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold mt-1 ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                {activePlan.title}
              </h2>
              <p className={`text-xs mt-1 max-w-xl ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {activePlan.description}
              </p>
            </div>

            {/* PROGRESS GAUGE */}
            <div className={`p-4 rounded-2xl border text-center shrink-0 space-y-1 ${
              isWhite
                ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                : 'bg-neutral-900 border-neutral-800 text-white'
            }`}>
              <div className={`text-2xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
                {progressPercent}%
              </div>
              <div className={`text-[11px] ${isWhite ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {currentPlanDoneCount} sur {currentPlanTotal} jours
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
            isWhite ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div
              className={`h-full transition-all duration-500 ${
                isWhite ? 'bg-neutral-950' : 'bg-white'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* DAYS LIST */}
          <div className="space-y-3 pt-2">
            {activePlan.days.map(d => {
              const isDone = (completedDays[activePlanId] || []).includes(d.day);
              return (
                <div
                  key={d.day}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? isWhite
                        ? 'bg-neutral-50/70 border-emerald-300'
                        : 'bg-neutral-900/60 border-emerald-900/50'
                      : isWhite
                      ? 'bg-white border-neutral-200 hover:border-neutral-300'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleDayCompleted(activePlanId, d.day)}
                      className="hover:scale-110 transition-transform"
                      title={isDone ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    >
                      {isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                      ) : (
                        <Circle className={`w-5 h-5 ${isWhite ? 'text-neutral-400' : 'text-neutral-600'}`} />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isWhite ? 'text-neutral-900' : 'text-white'}`}>
                          Jour {d.day}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isDone
                              ? 'line-through text-neutral-400'
                              : isWhite ? 'text-neutral-800' : 'text-neutral-200'
                          }`}
                        >
                          {d.title}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {d.passages.map(p => (
                          <span
                            key={p}
                            className={`text-[11px] px-2 py-0.5 rounded font-mono border ${
                              isWhite
                                ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
                                : 'bg-neutral-800 text-neutral-200 border-neutral-700'
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onReadPassage?.(d.passages[0])}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border shrink-0 transition-all ${
                      isWhite
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lire</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
