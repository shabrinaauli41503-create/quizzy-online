import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Trophy, Award, CheckCircle2, XCircle, RotateCcw, ChevronDown, ChevronUp, BookOpen, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

export const MahasiswaPodiumView: React.FC = () => {
  const { activeSession, currentPlayer, questions, leaveSession } = useQuiz();
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // silent
    }
  }, []);

  if (!activeSession || !currentPlayer) return null;

  const sortedPlayers = [...activeSession.players].sort((a, b) => b.score - a.score);
  const myRank = sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1;
  const isWinner = myRank === 1;

  // Personal statistics
  const totalQuestions = activeSession.questionIds.length;
  const correctCount = currentPlayer.answers.filter(a => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let gradeBadge = 'C';
  let gradeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  if (accuracy >= 85) {
    gradeBadge = 'A (Sangat Memuaskan)';
    gradeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  } else if (accuracy >= 70) {
    gradeBadge = 'B (Baik)';
    gradeColor = 'text-sky-400 border-sky-500/40 bg-sky-500/10';
  } else if (accuracy >= 55) {
    gradeBadge = 'C (Cukup)';
    gradeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  } else {
    gradeBadge = 'D (Perlu Belajar Lagi)';
    gradeColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* Trophy & Result Hero */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-4xl">
          {myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎖️'}
        </div>

        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Hasil Akhir Kuis
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white mt-1">
            {isWinner ? 'Selamat, Anda Juara 1!' : `Peringkat #${myRank} dari ${sortedPlayers.length} Mahasiswa`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {activeSession.title}
          </p>
        </div>

        {/* Score & Accuracy Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <div className="text-[10px] text-slate-400 font-mono">Skor Akhir</div>
            <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">
              {currentPlayer.score.toLocaleString()}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <div className="text-[10px] text-slate-400 font-mono">Jawaban Benar</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {correctCount} / {totalQuestions}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-center">
            <div className="text-[10px] text-slate-400 font-mono">Akurasi</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Predikat */}
        <div className={`p-3 rounded-xl border text-xs font-bold inline-block ${gradeColor}`}>
          Predikat Nilai: {gradeBadge}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Podium Top 3 Kelas</span>
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {sortedPlayers.slice(0, 3).map((p, idx) => (
            <div
              key={p.id}
              className={`p-3 rounded-xl border text-center space-y-1 ${
                idx === 0 
                  ? 'bg-amber-500/10 border-amber-500/40' 
                  : idx === 1 
                  ? 'bg-slate-300/10 border-slate-400/40' 
                  : 'bg-amber-700/10 border-amber-700/40'
              }`}
            >
              <div className="text-2xl">{p.avatar}</div>
              <div className="text-xs font-bold text-white truncate">{p.name}</div>
              <div className="text-[10px] font-mono text-slate-400">
                {idx === 0 ? 'Juara 1' : idx === 1 ? 'Juara 2' : 'Juara 3'}
              </div>
              <div className="text-xs font-mono font-bold text-sky-400">
                {p.score.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Review Pembahasan */}
      <div className="space-y-4">
        <button
          onClick={() => {
            soundManager.playTap();
            setShowReview(!showReview);
          }}
          className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Lihat Pembahasan & Kunci Jawaban Lengkap ({totalQuestions} Soal)</span>
          </span>
          {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showReview && (
          <div className="space-y-4 pt-2">
            {activeSession.questionIds.map((qId, qIdx) => {
              const q = questions.find(item => item.id === qId);
              if (!q) return null;
              const myAnswer = currentPlayer.answers.find(a => a.questionId === qId);
              const isAnsCorrect = myAnswer?.isCorrect || false;

              return (
                <div
                  key={qId}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-mono font-bold text-sky-400">Soal #{qIdx + 1}</span>
                        <span>·</span>
                        <span>{q.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    <div className="shrink-0">
                      {isAnsCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Salah
                        </span>
                      )}
                    </div>
                  </div>

                  {q.codeSnippet && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                      <pre className="font-mono text-emerald-400 text-[11px]">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Options status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isKunci = optIdx === q.correctAnswer;
                      const isMyPick = myAnswer?.selectedOption === optIdx;

                      let colorStyle = 'bg-slate-950 border-slate-800 text-slate-400';
                      if (isKunci) {
                        colorStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold';
                      } else if (isMyPick && !isKunci) {
                        colorStyle = 'bg-rose-500/15 border-rose-500/40 text-rose-300 line-through';
                      }

                      return (
                        <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${colorStyle}`}>
                          <span>{['A', 'B', 'C', 'D'][optIdx]}. {opt}</span>
                          {isKunci && <span className="text-[10px] text-emerald-400 font-bold shrink-0">Kunci</span>}
                          {isMyPick && !isKunci && <span className="text-[10px] text-rose-400 font-bold shrink-0">Pilihan Anda</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-slate-300 space-y-1">
                    <div className="font-bold text-sky-400 text-[11px]">Pembahasan:</div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            soundManager.playTap();
            leaveSession();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Kembali ke Halaman Awal</span>
        </button>
      </div>

    </div>
  );
};
