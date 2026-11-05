import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Users, Clock, Sparkles, LogOut, ShieldCheck, RotateCw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const MahasiswaWaitingRoom: React.FC = () => {
  const { activeSession, currentPlayer, leaveSession, syncWithCloud } = useQuiz();
  const [isSyncing, setIsSyncing] = useState(false);

  if (!activeSession || !currentPlayer) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setTimeout(() => setIsSyncing(false), 500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        
        {/* Top Tag & Refresh */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terhubung ke Sesi PIN: {activeSession.pin}</span>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title="Segarkan data ruang"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-sky-400' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {/* Player Profile Hero */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <div className="text-6xl animate-bounce">{currentPlayer.avatar}</div>
          <h2 className="text-xl font-bold font-display text-white">
            {currentPlayer.name}
          </h2>
          {currentPlayer.nim && (
            <div className="text-xs font-mono text-slate-400">
              NIM: {currentPlayer.nim}
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Status: Terhubung & Siap Kuis</span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Clock className="w-4 h-4 text-sky-400 animate-spin" />
            <span>Menunggu Dosen Memulai Kuis di Layar Proyektor...</span>
          </div>
          <p className="text-xs text-slate-400">
            Soal Pemrograman Web akan muncul otomatis di layar HP Anda ketika Dosen menekan tombol <strong>Mulai Kuis</strong>.
          </p>
        </div>

        {/* Other participants in the lobby */}
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              Peserta yang Sudah Masuk ({activeSession.players.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
            {activeSession.players.map((p) => {
              const isSelf = p.id === currentPlayer.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border ${
                    isSelf 
                      ? 'bg-sky-500/20 border-sky-400 text-white font-bold' 
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <span>{p.avatar}</span>
                  <span className="truncate max-w-[120px]">{p.name} {isSelf && '(Anda)'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-xs text-amber-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Tips Skor Maksimal:</strong> Jawab dengan cepat dan akurat untuk meraih poin tertinggi (+1500 poin) & combo streak!
          </span>
        </div>

        {/* Leave session button */}
        <div className="pt-2 border-t border-slate-800 flex justify-center">
          <button
            onClick={() => {
              soundManager.playTap();
              leaveSession();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Ruang Kuis</span>
          </button>
        </div>

      </div>
    </div>
  );
};
