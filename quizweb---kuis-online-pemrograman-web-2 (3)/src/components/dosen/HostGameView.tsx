import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { 
  Play, Users, Clock, Award, Trophy, ArrowRight, 
  RotateCcw, Sparkles, CheckCircle2, XCircle, Share2, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

const OPTION_STYLES = [
  { bg: 'bg-rose-600', hover: 'hover:bg-rose-500', shape: '▲', label: 'A' },
  { bg: 'bg-sky-600', hover: 'hover:bg-sky-500', shape: '◆', label: 'B' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-400', shape: '●', label: 'C' },
  { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', shape: '■', label: 'D' },
];

export const HostGameView: React.FC = () => {
  const { 
    activeSession, 
    setGameStage, 
    nextQuestion, 
    endGame, 
    addSimulatedStudents, 
    kickPlayer, 
    questions 
  } = useQuiz();

  const [timeLeft, setTimeLeft] = useState(20);
  const [countdownNum, setCountdownNum] = useState(3);
  const [copied, setCopied] = useState(false);

  // Get current active question
  const currentQId = activeSession ? activeSession.questionIds[activeSession.currentQuestionIndex] : null;
  const currentQ = questions.find(q => q.id === currentQId);
  const totalQuestions = activeSession ? activeSession.questionIds.length : 0;
  const currentIndex = activeSession ? activeSession.currentQuestionIndex : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle stage timers
  useEffect(() => {
    if (!activeSession) return;

    if (activeSession.stage === 'COUNTDOWN') {
      setCountdownNum(3);
      const timer = setInterval(() => {
        setCountdownNum(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStage('QUESTION');
            return 3;
          }
          soundManager.playTick(true);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    if (activeSession.stage === 'QUESTION') {
      setTimeLeft(activeSession.timePerQuestion);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameStage('ANSWER_REVEAL');
            return 0;
          }
          if (prev <= 5) {
            soundManager.playTick(true);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    if (activeSession.stage === 'PODIUM') {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        const timeout = setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1 }
          });
        }, 600);
        return () => clearTimeout(timeout);
      } catch {
        // Fallback if canvas-confetti is not loaded
      }
    }
  }, [activeSession?.stage, activeSession?.currentQuestionIndex]);

  if (!activeSession) return null;

  // Answers tally for current question
  const currentAnswers = activeSession.players.map(p => {
    const ans = p.answers.find(a => a.questionId === currentQId);
    return ans ? ans.selectedOption : -1;
  }).filter(ans => ans !== -1);

  const answerTally = [0, 1, 2, 3].map(optIndex => 
    currentAnswers.filter(a => a === optIndex).length
  );

  const totalAnswered = currentAnswers.length;
  const totalPlayers = activeSession.players.length;

  // Sorted leaderboard
  const sortedPlayers = [...activeSession.players].sort((a, b) => b.score - a.score);

  // Copy PIN or share URL
  const handleCopyPin = () => {
    navigator.clipboard.writeText(activeSession.pin);
    setCopied(true);
    soundManager.playTap();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* STAGE 1: LOBBY / WAITING ROOM */}
      {activeSession.stage === 'LOBBY' && (
        <div className="space-y-8">
          
          {/* Header PIN Banner */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sesi Kuis Terbuka · Bagikan PIN ke Mahasiswa</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
              {activeSession.title}
            </h2>

            {/* Giant PIN Display */}
            <div className="max-w-md mx-auto p-6 bg-slate-950 border border-slate-800 rounded-3xl shadow-inner relative group">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                Game PIN Permainan
              </div>
              <div className="text-4xl sm:text-6xl font-extrabold font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 select-all">
                {activeSession.pin}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyPin}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin PIN'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Mahasiswa membuka website ini di HP &gt; klik <strong>&quot;Gabung Siswa&quot;</strong> &gt; masukkan PIN di atas.
            </p>
          </div>

          {/* Roster of joined students */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Mahasiswa yang Bergabung ({totalPlayers})</span>
              </div>

              <button
                onClick={() => {
                  soundManager.playTap();
                  addSimulatedStudents(6);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Tambah Simulasi 6 Teman Kelas (Uji Cepat)</span>
              </button>
            </div>

            {totalPlayers === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 animate-spin mx-auto" />
                <p>Menunggu mahasiswa bergabung dengan PIN {activeSession.pin}...</p>
                <p className="text-slate-600">Atau klik tombol simulasi di atas untuk langsung menguji dengan bot mahasiswa.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {activeSession.players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{p.avatar}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {p.nim || (p.isBot ? 'Bot Mahasiswa' : 'Peserta')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => kickPlayer(p.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Keluarkan dari ruang"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action to Start Game */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Total Soal: <strong className="text-white">{totalQuestions} Soal</strong> · Waktu: <strong className="text-white">{activeSession.timePerQuestion} detik/soal</strong>
            </div>

            <button
              disabled={totalPlayers === 0}
              onClick={() => {
                soundManager.playStart();
                setGameStage('COUNTDOWN');
              }}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-xl transition-all ${
                totalPlayers > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mulai Kuis Sekarang ({totalPlayers} Peserta)</span>
            </button>
          </div>

        </div>
      )}

      {/* STAGE 2: COUNTDOWN */}
      {activeSession.stage === 'COUNTDOWN' && (
        <div className="py-20 text-center space-y-6">
          <div className="text-xs uppercase font-mono tracking-widest text-sky-400">
            Bersiaplah! Soal {currentIndex + 1} dari {totalQuestions}
          </div>
          <div className="text-8xl sm:text-9xl font-black font-display text-white animate-bounce">
            {countdownNum}
          </div>
          <p className="text-sm text-slate-400">
            Tampilkan perhatian ke layar dan siapkan jawaban terbaik Anda!
          </p>
        </div>
      )}

      {/* STAGE 3: QUESTION (ACTIVE - DOSEN CONTROL & MONITORING VIEW) */}
      {activeSession.stage === 'QUESTION' && currentQ && (
        <div className="space-y-6">
          
          {/* Dosen Control Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                HOST
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Panel Kontrol Dosen (Layar Proyektor)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    Kuis Sedang Berjalan
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Mahasiswa sedang mengerjakan soal ini dari HP mereka. Anda memegang kendali jalannya kuis.
                </div>
              </div>
            </div>

            {/* Dosen Host Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundManager.playTap();
                  setTimeLeft(prev => prev + 10);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
                title="Beri tambahan 10 detik untuk mahasiswa"
              >
                +10s Waktu
              </button>

              <button
                onClick={() => {
                  soundManager.playTap();
                  setGameStage('ANSWER_REVEAL');
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
              >
                <span>Kunci Jawaban Sekarang 🔒</span>
              </button>
            </div>
          </div>

          {/* Timer Clock & Live Answer Progress */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-2xl shrink-0 transition-colors shadow-lg ${
                timeLeft <= 5 ? 'bg-rose-600 text-white animate-pulse' : 'bg-indigo-600 text-white'
              }`}>
                {timeLeft}s
              </div>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Sisa Waktu Menjawab</span>
                  <span className="text-white font-bold">{Math.round((timeLeft / activeSession.timePerQuestion) * 100)}%</span>
                </div>
                <div className="bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear ${
                      timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                    }`}
                    style={{ width: `${(timeLeft / activeSession.timePerQuestion) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Answer count pill */}
            <div className="md:col-span-4 p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Respon Mahasiswa</div>
                <div className="text-base font-bold font-mono text-white">
                  <span className="text-emerald-400">{totalAnswered}</span> / {totalPlayers} <span className="text-xs text-slate-400 font-normal">Sudah Menjawab</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs border border-emerald-500/20">
                {totalPlayers > 0 ? Math.round((totalAnswered / totalPlayers) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Question Text Box (Projector Display) */}
          <div className="p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-bold text-sky-400">
                Soal {currentIndex + 1} dari {totalQuestions} Soal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                Kategori: {currentQ.category} · {currentQ.difficulty}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-emerald-400">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>

          {/* 4 Options as Informative Projector Display Cards (NOT answer buttons for dosen!) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-semibold text-slate-300">
                Opsi Pilihan (Tampil di Layar HP Mahasiswa)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                *Kunci Jawaban Benar: Opsi {['A', 'B', 'C', 'D'][currentQ.correctAnswer]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((option, idx) => {
                const style = OPTION_STYLES[idx];
                const isKunci = idx === currentQ.correctAnswer;
                const countChoseThis = currentAnswers.filter(a => a === idx).length;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl ${style.bg} text-white shadow-lg flex items-center justify-between gap-3 relative overflow-hidden`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center font-bold text-base shrink-0">
                        {style.shape}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-white/70 font-mono uppercase tracking-wider">
                          Pilihan {style.label} {isKunci && '✓ (Kunci Dosen)'}
                        </div>
                        <div className="font-semibold text-sm leading-snug">
                          {option}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 px-2.5 py-1 bg-black/30 rounded-xl border border-white/10 font-mono text-xs">
                      <span className="font-bold">{countChoseThis}</span> mhs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Student Submission Monitor: Shows who has answered */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Status Jawaban Mahasiswa Real-Time ({totalAnswered}/{totalPlayers})</span>
              </span>
              <span className="text-[11px] text-slate-500">Otomatis ter-update saat mahasiswa mengirim jawaban</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {activeSession.players.map(p => {
                const hasAnsweredThis = p.answers.some(a => a.questionId === currentQId);
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                      hasAnsweredThis
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{p.avatar}</span>
                      <span className="truncate max-w-[100px] font-medium">{p.name}</span>
                    </div>
                    {hasAnsweredThis ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
                        ✓ Terkirim
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic shrink-0">
                        Mengetik...
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* STAGE 4: ANSWER REVEAL */}
      {activeSession.stage === 'ANSWER_REVEAL' && currentQ && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-xs text-slate-400">
              <span className="font-bold text-sky-400 font-mono">Pembahasan Soal {currentIndex + 1}</span>
            </div>
            <button
              onClick={() => {
                soundManager.playTap();
                setGameStage('LEADERBOARD');
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-colors"
            >
              <span>Lihat Papan Skor (Leaderboard)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-400">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Options with tallies and correct answer highlighted */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              const isCorrect = idx === currentQ.correctAnswer;
              const style = OPTION_STYLES[idx];
              const count = answerTally[idx];
              const percentage = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl transition-all border-2 ${
                    isCorrect
                      ? 'bg-emerald-600/90 border-white text-white shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center font-bold text-sm shrink-0">
                        {style.shape}
                      </div>
                      <span className="font-semibold text-sm">
                        {option}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold">{count} mhs</div>
                      <div className="text-[10px] font-mono text-slate-300">({percentage}%)</div>
                    </div>
                  </div>

                  {isCorrect && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-xs font-bold text-white">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Jawaban Benar</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Callout */}
          <div className="p-4 bg-sky-950/30 border border-sky-800/40 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Penjelasan & Materi Dosen:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        </div>
      )}

      {/* STAGE 5: LEADERBOARD SEMENTARA */}
      {activeSession.stage === 'LEADERBOARD' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs text-sky-400 uppercase font-mono tracking-wider">
                Papan Skor Sementara · Putaran {currentIndex + 1}
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Klasemen Mahasiswa Teratas
              </h3>
            </div>

            <button
              onClick={() => {
                soundManager.playTap();
                if (isLastQuestion) {
                  endGame();
                } else {
                  nextQuestion();
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{isLastQuestion ? 'Lihat Podium Pemenang 🏆' : 'Soal Selanjutnya ⏩'}</span>
            </button>
          </div>

          {/* Top Leaderboard List */}
          <div className="space-y-2.5 max-w-2xl mx-auto">
            {sortedPlayers.slice(0, 7).map((p, rank) => {
              const isTop3 = rank < 3;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                    rank === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-lg shadow-amber-500/10'
                      : rank === 1
                      ? 'bg-slate-300/10 border-slate-400/40 text-white'
                      : rank === 2
                      ? 'bg-amber-700/10 border-amber-700/40 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 text-center font-mono font-extrabold text-sm text-slate-400">
                      {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                    </span>
                    <span className="text-2xl">{p.avatar}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.streak >= 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono">
                            🔥 {p.streak}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.nim || (p.isBot ? 'Bot Mahasiswa' : 'Mahasiswa')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold font-mono text-sky-400">
                      {p.score.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </div>
                    {p.lastPointsEarned && p.lastPointsEarned > 0 && (
                      <div className="text-[10px] text-emerald-400 font-mono">
                        +{p.lastPointsEarned.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGE 6: PODIUM PEMENANG */}
      {activeSession.stage === 'PODIUM' && (
        <div className="space-y-8 py-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Kuis Pemrograman Web Selesai</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Podium Juara Kuis
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Selamat kepada para juara! Skor dan catatan evaluasi telah terekam di sistem.
            </p>
          </div>

          {/* 3D-like Step Podium */}
          <div className="flex items-end justify-center gap-3 sm:gap-6 pt-10 pb-6 max-w-xl mx-auto">
            {/* Rank 2 (Silver) */}
            {sortedPlayers[1] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="text-3xl mb-1">{sortedPlayers[1].avatar}</div>
                <div className="text-xs font-bold text-white text-center truncate max-w-[100px] mb-1">
                  {sortedPlayers[1].name}
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-400 mb-2">
                  {sortedPlayers[1].score.toLocaleString()} pts
                </div>
                <div className="w-full h-36 bg-gradient-to-t from-slate-800 to-slate-700 border-t-4 border-slate-300 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-xl">
                  <span className="text-3xl font-black text-slate-300">2</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Juara II</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {sortedPlayers[0] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="text-4xl mb-1 animate-bounce">👑</div>
                <div className="text-4xl mb-1">{sortedPlayers[0].avatar}</div>
                <div className="text-sm font-bold text-amber-300 text-center truncate max-w-[120px] mb-1">
                  {sortedPlayers[0].name}
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 mb-2">
                  {sortedPlayers[0].score.toLocaleString()} pts
                </div>
                <div className="w-full h-48 bg-gradient-to-t from-amber-700/80 to-amber-500/80 border-t-4 border-yellow-300 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/20">
                  <Trophy className="w-8 h-8 text-yellow-200 mb-1" />
                  <span className="text-4xl font-black text-yellow-100">1</span>
                  <span className="text-[10px] uppercase tracking-wider text-yellow-200 font-bold">Juara Utama</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {sortedPlayers[2] && (
              <div className="flex-1 flex flex-col items-center">
                <div className="text-3xl mb-1">{sortedPlayers[2].avatar}</div>
                <div className="text-xs font-bold text-white text-center truncate max-w-[100px] mb-1">
                  {sortedPlayers[2].name}
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-500 mb-2">
                  {sortedPlayers[2].score.toLocaleString()} pts
                </div>
                <div className="w-full h-28 bg-gradient-to-t from-amber-950 to-amber-900 border-t-4 border-amber-600 rounded-t-2xl flex flex-col items-center justify-center p-2 shadow-xl">
                  <span className="text-3xl font-black text-amber-400">3</span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold">Juara III</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Rank Table */}
          <div className="max-w-2xl mx-auto bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Daftar Lengkap Skor Seluruh Mahasiswa
            </h4>
            <div className="space-y-1.5 divide-y divide-slate-800/50">
              {sortedPlayers.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 w-5">#{idx + 1}</span>
                    <span>{p.avatar}</span>
                    <span className="text-white font-medium">{p.name}</span>
                    {p.nim && <span className="text-slate-500 text-[10px]">({p.nim})</span>}
                  </div>
                  <div className="font-mono font-bold text-sky-400">
                    {p.score.toLocaleString()} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to complete session */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={() => {
                soundManager.playTap();
                window.location.reload(); // Clean session reset
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Selesai & Buat Sesi Kuis Baru</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
