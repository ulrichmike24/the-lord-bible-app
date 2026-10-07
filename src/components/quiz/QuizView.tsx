import React, { useState, useEffect } from 'react';
import { HelpCircle, Check, X, RotateCcw, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { api, QuizTopic, QuizQuestion } from '../../lib/api.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

export const QuizView: React.FC = () => {
  const { isWhite } = useTheme();
  const [quizzes, setQuizzes] = useState<QuizTopic[]>([]);
  const [activeQuizId, setActiveQuizId] = useState<string>('general-debutant');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    api.getQuizzes().then(data => {
      setQuizzes(data);
      if (data.length > 0) setActiveQuizId(data[0].id);
    }).catch(console.error);
  }, []);

  const activeQuiz = quizzes.find(q => q.id === activeQuizId) || quizzes[0];
  const questions = activeQuiz?.questions || [];
  const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (currentQuestion && index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = (quizId?: string) => {
    if (quizId) setActiveQuizId(quizId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
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
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
              Quiz Bibliques Interactifs
            </h1>
            <p className={`text-xs sm:text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Testez et approfondissez vos connaissances avec des questions documentées et références scripturaires.
            </p>
          </div>
        </div>

        {/* QUIZ SELECTOR CHIPS */}
        <div className="flex flex-wrap gap-2 pt-2">
          {quizzes.map(q => (
            <button
              key={q.id}
              onClick={() => handleRestart(q.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeQuizId === q.id
                  ? isWhite
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-950 border-white shadow-xs'
                  : isWhite
                  ? 'bg-white text-neutral-700 hover:text-black border-neutral-300 hover:bg-neutral-100'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {q.title} ({q.difficulty})
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ ENGINE */}
      {activeQuiz && !isFinished && currentQuestion && (
        <div className={`border rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-950 border-neutral-800 text-neutral-100'
        }`}>
          {/* PROGRESS BAR & COUNTER */}
          <div className={`flex items-center justify-between text-xs font-bold ${
            isWhite ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            <span>
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
            <span className={isWhite ? 'text-neutral-950 font-black' : 'text-white font-black'}>
              Score : {score} / {questions.length}
            </span>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden border ${
            isWhite ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div
              className={`h-full transition-all duration-300 ${isWhite ? 'bg-neutral-950' : 'bg-white'}`}
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* QUESTION TEXT */}
          <h2 className={`text-lg sm:text-xl font-bold pt-2 ${isWhite ? 'text-neutral-950' : 'text-white'}`}>
            {currentQuestion.question}
          </h2>

          {/* OPTIONS LIST */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let style = isWhite
                ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800 text-neutral-200';

              if (isAnswered) {
                if (isCorrect) {
                  style = isWhite
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = isWhite
                    ? 'bg-red-50 border-red-500 text-red-800 font-bold'
                    : 'bg-red-950/40 border-red-500 text-red-300 font-bold';
                } else {
                  style = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl text-xs sm:text-sm text-left border transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* IMMEDIATE FEEDBACK & SCRIPTURAL CITATION */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border space-y-2 animate-in fade-in ${
              isWhite
                ? 'bg-neutral-50 border-neutral-200 text-neutral-800'
                : 'bg-neutral-900 border-neutral-800 text-neutral-200'
            }`}>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedOption === currentQuestion.correctIndex ? '✓ Bonne réponse !' : '✗ Réponse incorrecte'}
                </span>
                <span className={`text-[11px] flex items-center gap-1 font-semibold ml-auto ${
                  isWhite ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentQuestion.reference}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* NEXT BUTTON */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all ${
                  isWhite
                    ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                    : 'bg-white hover:bg-neutral-200 text-neutral-950'
                }`}
              >
                <span>
                  {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Voir mon résultat'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* FINISHED SCORE SCREEN */}
      {isFinished && (
        <div className={`border rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm transition-colors ${
          isWhite
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-neutral-950 border-neutral-800 text-white'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
            isWhite ? 'bg-neutral-100 text-neutral-950' : 'bg-neutral-800 text-white'
          }`}>
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">
              Quiz terminé !
            </h2>
            <p className={`text-sm ${isWhite ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Vous avez obtenu <span className="font-bold text-base">{score}</span> bonnes réponses sur <span className="font-bold text-base">{questions.length}</span>.
            </p>
          </div>

          <div className={`max-w-xs mx-auto p-4 rounded-2xl border text-xs ${
            isWhite ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-neutral-900 border-neutral-800 text-neutral-200'
          }`}>
            {score === questions.length ? (
              <span className="text-emerald-600 font-bold">Excellent ! Parfaite maîtrise des Écritures !</span>
            ) : score >= questions.length / 2 ? (
              <span className="font-semibold">Très bon travail ! Continuez à sonder la Parole.</span>
            ) : (
              <span>Bel essai ! La Bible regorge encore de trésors à découvrir.</span>
            )}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => handleRestart()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                isWhite
                  ? 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-200 text-neutral-950'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer le quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
