/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Header } from './components/common/Header';
import { HomeLanding } from './components/home/HomeLanding';
import { DosenDashboard } from './components/dosen/DosenDashboard';
import { MahasiswaJoin } from './components/mahasiswa/MahasiswaJoin';
import { MahasiswaWaitingRoom } from './components/mahasiswa/MahasiswaWaitingRoom';
import { MahasiswaPlayView } from './components/mahasiswa/MahasiswaPlayView';
import { MahasiswaLeaderboardView } from './components/mahasiswa/MahasiswaLeaderboardView';
import { MahasiswaPodiumView } from './components/mahasiswa/MahasiswaPodiumView';
import { SoloPlayView } from './components/solo/SoloPlayView';

const MainRouter: React.FC = () => {
  const { role, currentPlayer, activeSession } = useQuiz();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* HOME VIEW */}
        {role === 'HOME' && <HomeLanding />}

        {/* DOSEN PANEL */}
        {role === 'DOSEN' && <DosenDashboard />}

        {/* MAHASISWA ROLE */}
        {role === 'MAHASISWA' && (
          <div>
            {!currentPlayer ? (
              <MahasiswaJoin />
            ) : !activeSession || activeSession.stage === 'LOBBY' ? (
              <MahasiswaWaitingRoom />
            ) : activeSession.stage === 'COUNTDOWN' ? (
              <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-sky-400">
                    Bersiaplah! Soal {activeSession.currentQuestionIndex + 1}
                  </div>
                  <div className="text-8xl sm:text-9xl font-black font-display text-white animate-bounce">
                    ⚡
                  </div>
                  <p className="text-sm text-slate-300">
                    Soal Pemrograman Web muncul di layar HP Anda dalam hitungan detik!
                  </p>
                </div>
              </div>
            ) : activeSession.stage === 'QUESTION' || activeSession.stage === 'ANSWER_REVEAL' ? (
              <MahasiswaPlayView />
            ) : activeSession.stage === 'LEADERBOARD' ? (
              <MahasiswaLeaderboardView />
            ) : activeSession.stage === 'PODIUM' ? (
              <MahasiswaPodiumView />
            ) : (
              <MahasiswaWaitingRoom />
            )}
          </div>
        )}

        {/* SOLO PRACTICE MODE */}
        {role === 'SOLO' && <SoloPlayView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <MainRouter />
    </QuizProvider>
  );
}
