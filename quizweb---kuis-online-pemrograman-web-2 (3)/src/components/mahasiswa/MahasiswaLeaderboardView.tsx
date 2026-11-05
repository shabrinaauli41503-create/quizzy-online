import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Trophy, Flame, TrendingUp, Sparkles, Award } from 'lucide-react';

export const MahasiswaLeaderboardView: React.FC = () => {
  const { activeSession, currentPlayer } = useQuiz();

  if (!activeSession || !currentPlayer) return null;

  const sortedPlayers = [...activeSession.players].sort((a, b) => b.score - a.score);
  const myRank = sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1;
  const isTop3 = myRank <= 3 && myRank > 0;
  const leaderScore = sortedPlayers[0]?.score || 0;
  const scoreDiff = leaderScore - currentPlayer.score;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Personal Rank Highlight Card */}
      <div className={`p-6 rounded-3xl border text-center space-y-3 shadow-2xl relative overflow-hidden ${
        myRank === 1 
          ? 'bg-amber-500/10 border-amber-500/50 shadow-amber-500/10'
          : myRank === 2
          ? 'bg-slate-300/10 border-slate-400/50 shadow-slate-400/10'
          : myRank === 3
          ? 'bg-amber-700/10 border-amber-700/50 shadow-amber-700/10'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="text-5xl">{currentPlayer.avatar}</div>

        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Posisi Anda Saat Ini
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
            {myRank === 1 ? '🥇 Peringkat 1 (Memimpin!)' :
             myRank === 2 ? '🥈 Peringkat 2' :
             myRank === 3 ? '🥉 Peringkat 3' :
             `Peringkat #${myRank} dari ${sortedPlayers.length} Mahasiswa`}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="text-center px-4 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Skor</div>
            <div className="text-lg font-bold font-mono text-sky-400">
              {currentPlayer.score.toLocaleString()} <span className="text-xs font-normal text-slate-400">pts</span>
            </div>
          </div>

          {currentPlayer.streak >= 2 && (
            <div className="text-center px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/30">
              <div className="text-[10px] text-rose-400 uppercase font-mono flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>Streak</span>
              </div>
              <div className="text-lg font-bold font-mono text-rose-300">
                {currentPlayer.streak}x Combo
              </div>
            </div>
          )}

          {myRank > 1 && (
            <div className="text-center px-4 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Selisih ke Juara 1</div>
              <div className="text-lg font-bold font-mono text-amber-400">
                -{scoreDiff.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-2.5">
          <span>Top Mahasiswa</span>
          <span>Skor</span>
        </div>

        <div className="space-y-2">
          {sortedPlayers.slice(0, 6).map((p, idx) => {
            const isSelf = p.id === currentPlayer.id;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-xl text-xs transition-colors border ${
                  isSelf
                    ? 'bg-sky-500/20 border-sky-400 text-white font-bold ring-2 ring-sky-500/30'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold w-6 text-center text-slate-400">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <span className="text-lg">{p.avatar}</span>
                  <div className="truncate">
                    <span className="truncate">{p.name}</span>
                    {isSelf && <span className="ml-1 text-sky-400">(Anda)</span>}
                  </div>
                </div>

                <div className="font-mono font-bold text-sky-400">
                  {p.score.toLocaleString()} pts
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-400" />
        <span>Menunggu Dosen melanjutkan ke soal berikutnya...</span>
      </div>

    </div>
  );
};
