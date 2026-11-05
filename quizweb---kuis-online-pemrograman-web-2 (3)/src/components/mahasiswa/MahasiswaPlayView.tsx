import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { 
  CheckCircle2, XCircle, Clock, Sparkles, Flame, 
  RotateCw, Check
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

const OPTION_STYLES = [
  { bg: 'bg-rose-600', activeBg: 'active:bg-rose-700', border: 'border-rose-500', shape: '▲', label: 'A' },
  { bg: 'bg-sky-600', activeBg: 'active:bg-sky-700', border: 'border-sky-500', shape: '◆', label: 'B' },
  { bg: 'bg-amber-500', activeBg: 'active:bg-amber-600', border: 'border-amber-400', shape: '●', label: 'C' },
  { bg: 'bg-emerald-600', activeBg: 'active:bg-emerald-700', border: 'border-emerald-500', shape: '■', label: 'D' },
];

export const MahasiswaPlayView: React.FC = () => {
  const { activeSession, currentPlayer, submitAnswer, syncWithCloud, questions } = useQuiz();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(activeSession?.timePerQuestion || 20);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!activeSession || !currentPlayer) return null;

  const currentQId = activeSession.questionIds[activeSession.currentQuestionIndex];
  const currentQ = questions.find(q => q.id === currentQId);
  const totalQuestions = activeSession.questionIds.length;
  const currentIndex = activeSession.currentQuestionIndex;

  // CRITICAL FIX: Reset selected option when question index changes!
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(activeSession.timePerQuestion);
  }, [currentIndex, activeSession.timePerQuestion]);

  // Check if player has already submitted an answer for this question
  const existingAnswer = currentPlayer.answers.find(a => a.questionId === currentQId);
  const hasAnswered = !!existingAnswer || selectedOption !== null;

  // Local timer countdown
  useEffect(() => {
    if (activeSession.stage === 'QUESTION') {
      const timer = setInterval(() => {
        const elapsed = (Date.now() - activeSession.stageStartTime) / 1000;
        const remain = Math.max(0, Math.ceil(activeSession.timePerQuestion - elapsed));
        setTimeLeft(remain);
      }, 500);
      return () => clearInterval(timer);
    }
  }, [activeSession.stage, activeSession.stageStartTime, activeSession.timePerQuestion]);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || activeSession.stage !== 'QUESTION') return;
    setSelectedOption(idx);
    soundManager.playTap();
    const timeSpent = Math.max(1, (Date.now() - activeSession.stageStartTime) / 1000);
    submitAnswer(idx, timeSpent);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setTimeout(() => setIsSyncing(false), 500);
  };

  if (!currentQ) return null;

  const isRevealStage = activeSession.stage === 'ANSWER_REVEAL';
  const playerAnswer = existingAnswer ? existingAnswer.selectedOption : selectedOption;
  const isCorrect = playerAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      
      {/* Top Status & Score Bar */}
      <div className="flex items-center justify-between gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentPlayer.avatar}</span>
          <div>
            <div className="text-xs font-bold text-white leading-tight">{currentPlayer.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Soal {currentIndex + 1} / {totalQuestions}
            </div>
          </div>
        </div>

        {/* Current Score & Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPlayer.streak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentPlayer.streak}x</span>
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono">Total Skor</div>
            <div className="text-sm font-bold font-mono text-sky-400">
              {currentPlayer.score.toLocaleString()} <span className="text-[10px] text-slate-500">pts</span>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Sinkronkan Layar"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Timer Bar */}
      {activeSession.stage === 'QUESTION' && (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0 ${
            timeLeft <= 5 ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'
          }`}>
            {timeLeft}s
          </div>
          <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-linear ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, (timeLeft / activeSession.timePerQuestion) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-sky-400">{currentQ.category}</span>
          <span className="text-[11px] font-mono text-slate-500">{currentQ.difficulty}</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold font-display text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {currentQ.codeSnippet && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <pre className="text-xs font-mono text-emerald-400">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentQ.options.map((option, idx) => {
          const style = OPTION_STYLES[idx];
          const isSelected = playerAnswer === idx;
          const isThisCorrect = idx === currentQ.correctAnswer;

          let btnClass = `${style.bg} ${style.activeBg} text-white shadow-lg cursor-pointer`;

          if (isRevealStage) {
            if (isThisCorrect) {
              btnClass = 'bg-emerald-600 border-2 border-white ring-4 ring-emerald-500/30 text-white shadow-xl';
            } else if (isSelected && !isThisCorrect) {
              btnClass = 'bg-rose-800 border-2 border-rose-500 text-white opacity-75';
            } else {
              btnClass = 'bg-slate-900 border border-slate-800 text-slate-500 opacity-40';
            }
          } else if (hasAnswered) {
            if (isSelected) {
              btnClass = `${style.bg} ring-4 ring-white/60 scale-[1.02]`;
            } else {
              btnClass = 'bg-slate-900 border border-slate-800 text-slate-500 opacity-40 cursor-not-allowed';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasAnswered || isRevealStage}
              onClick={() => handleSelectOption(idx)}
              className={`p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all font-semibold text-sm ${btnClass}`}
            >
              <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center font-bold text-base shrink-0">
                {style.shape}
              </div>
              <span className="flex-1 leading-snug">{option}</span>

              {isRevealStage && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              )}
              {isRevealStage && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-300 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner while waiting for Dosen to lock/reveal */}
      {hasAnswered && !isRevealStage && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2.5 shadow-xl">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xl font-bold">
            ✓
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Jawaban Anda Telah Tersimpan!
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Anda memilih: <strong className="text-sky-400">Pilihan {['A', 'B', 'C', 'D'][playerAnswer ?? 0]}</strong>. Menunggu dosen mengunci hasil atau waktu habis ({timeLeft}s)...
            </p>
          </div>
        </div>
      )}

      {/* Reveal Feedback Banner */}
      {isRevealStage && (
        <div className={`p-5 rounded-2xl border text-center space-y-2 shadow-xl ${
          isCorrect 
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
        }`}>
          <div className="text-3xl">{isCorrect ? '🎉' : '❌'}</div>
          <div className="text-base sm:text-lg font-bold font-display">
            {isCorrect ? 'Jawaban Anda Benar!' : 'Jawaban Kurang Tepat!'}
          </div>
          
          {isCorrect && existingAnswer && (
            <div className="text-xs font-mono font-bold text-emerald-300">
              +{existingAnswer.pointsEarned.toLocaleString()} Poin Kecepatan & Ketepatan!
            </div>
          )}

          <div className="pt-2 text-xs text-slate-300 border-t border-slate-800 text-left space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Pembahasan:</span>
            </div>
            <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 font-mono">
            Menunggu dosen beralih ke soal berikutnya...
          </div>
        </div>
      )}

    </div>
  );
};
