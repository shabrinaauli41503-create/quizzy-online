import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { QuizQuestion, QuestionCategory } from '../../types/quiz';
import { 
  BookOpen, Play, CheckCircle2, XCircle, ArrowRight, 
  RotateCcw, Sparkles, Flame, Trophy, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

const OPTION_STYLES = [
  { bg: 'bg-rose-600', hover: 'hover:bg-rose-500', shape: '▲', label: 'A' },
  { bg: 'bg-sky-600', hover: 'hover:bg-sky-500', shape: '◆', label: 'B' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-400', shape: '●', label: 'C' },
  { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', shape: '■', label: 'D' },
];

export const SoloPlayView: React.FC = () => {
  const { questions, setRole } = useQuiz();

  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'SUMMARY'>('SETUP');
  const [selectedCount, setSelectedCount] = useState(10);
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Game metrics
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<{
    question: QuizQuestion;
    chosen: number;
    isCorrect: boolean;
  }[]>([]);

  // Start solo game
  const handleStartSolo = () => {
    soundManager.playStart();
    let pool = [...questions];
    if (selectedCat !== 'Semua') {
      pool = pool.filter(q => q.category === selectedCat);
    }
    if (pool.length === 0) pool = [...questions];
    pool.sort(() => Math.random() - 0.5);

    const chosen = pool.slice(0, Math.min(selectedCount, pool.length));
    setActiveQuestions(chosen);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setAnswersHistory([]);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setGameState('PLAYING');
  };

  const currentQ = activeQuestions[currentIndex];

  const handleChooseOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(idx);
    setIsAnswerRevealed(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      const points = 1000 + streak * 100;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        question: currentQ,
        chosen: idx,
        isCorrect,
      }
    ]);
  };

  const handleNext = () => {
    soundManager.playTap();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      soundManager.playVictory();
      setGameState('SUMMARY');
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // silent
      }
    }
  };

  // Setup View
  if (gameState === 'SETUP') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              Mode Latihan Mandiri (Solo)
            </h2>
            <p className="text-xs text-slate-400">
              Latih pemahaman materi Pemrograman Web 2 (HTML, CSS, JavaScript, React, Node.js, Express, REST API) mandiri tanpa perlu menunggu room kuis dosen.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Pilih Kategori Materi
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Semua">Semua Materi (Full-Stack Web 2)</option>
                <option value="HTML & CSS Modern">HTML & CSS Modern</option>
                <option value="JavaScript ES6+ & DOM">JavaScript ES6+ & DOM</option>
                <option value="Async & REST API">Async & REST API</option>
                <option value="React & Frontend">React & Frontend</option>
                <option value="Node.js & Express">Node.js & Express</option>
                <option value="Database & Web Storage">Database & Web Storage</option>
                <option value="Web Security & HTTP">Web Security & HTTP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Jumlah Soal
              </label>
              <select
                value={selectedCount}
                onChange={(e) => setSelectedCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value={5}>5 Soal (Uji Cepat 2 Menit)</option>
                <option value={10}>10 Soal (Latihan Standar)</option>
                <option value={15}>15 Soal (Simulasi UAS)</option>
                <option value={20}>20 Soal (Komprehensif)</option>
                <option value={questions.length}>Semua Soal ({questions.length} Soal)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartSolo}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Latihan Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  // Playing View
  if (gameState === 'PLAYING' && currentQ) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        
        {/* Status Bar */}
        <div className="flex items-center justify-between gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-amber-400">
              Soal {currentIndex + 1} / {activeQuestions.length}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300">{currentQ.category}</span>
          </div>

          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streak}x Combo</span>
              </div>
            )}
            <div className="text-sm font-mono font-bold text-sky-400">
              {score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
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

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((option, idx) => {
            const style = OPTION_STYLES[idx];
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let btnClass = `${style.bg} ${style.hover} text-white shadow-lg`;
            if (isAnswerRevealed) {
              if (isCorrect) {
                btnClass = 'bg-emerald-600 border-2 border-white ring-4 ring-emerald-500/30 text-white shadow-xl';
              } else if (isSelected && !isCorrect) {
                btnClass = 'bg-rose-800 border-2 border-rose-500 text-white opacity-80';
              } else {
                btnClass = 'bg-slate-900 border border-slate-800 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerRevealed}
                onClick={() => handleChooseOption(idx)}
                className={`p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all font-semibold text-sm ${btnClass}`}
              >
                <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center font-bold text-base shrink-0">
                  {style.shape}
                </div>
                <span className="flex-1 leading-snug">{option}</span>
                {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {isAnswerRevealed && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1.5 text-xs text-slate-300">
              <div className="font-bold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pembahasan:</span>
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentIndex + 1 < activeQuestions.length ? 'Soal Berikutnya' : 'Selesai & Lihat Hasil'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    );
  }

  // Summary View
  const correctCount = answersHistory.filter(a => a.isCorrect).length;
  const accuracy = activeQuestions.length > 0 ? Math.round((correctCount / activeQuestions.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl">
          🏆
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Latihan Mandiri Selesai!</h2>
          <p className="text-xs text-slate-400 mt-1">Berikut ringkasan performa pemahaman materi Pemrograman Web Anda.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-[10px] text-slate-400 font-mono">Skor Total</div>
            <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">{score.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-[10px] text-slate-400 font-mono">Benar</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{correctCount} / {activeQuestions.length}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="text-[10px] text-slate-400 font-mono">Akurasi</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">{accuracy}%</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={handleStartSolo}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Latihan</span>
          </button>
          <button
            onClick={() => setGameState('SETUP')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
          >
            Ganti Materi
          </button>
        </div>
      </div>
    </div>
  );
};
