import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { Volume2, VolumeX, Smartphone, Monitor, BookOpen, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const Header: React.FC = () => {
  const { role, setRole, activeSession, isMuted, toggleMute } = useQuiz();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            soundManager.playTap();
            setRole('HOME');
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform text-white font-black text-lg">
            Q!
          </div>
          <div>
            <span className="text-xl font-black font-display tracking-tight text-white block leading-none">
              Quizzy<span className="text-amber-400">!</span>
            </span>
            <span className="text-[11px] font-semibold text-sky-400 block leading-tight tracking-wide">
              Live Quiz Game · Kahoot Style
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              soundManager.playTap();
              setRole('HOME');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              role === 'HOME' ? 'text-white bg-slate-800' : 'hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Beranda
          </button>
          
          <button
            onClick={() => {
              soundManager.playTap();
              setRole('DOSEN');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              role === 'DOSEN' ? 'text-white bg-indigo-600/30 border border-indigo-500/40 text-indigo-300' : 'hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-400" />
            Layar Host (Proyektor)
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole('MAHASISWA');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              role === 'MAHASISWA' ? 'text-white bg-sky-600/30 border border-sky-500/40 text-sky-300' : 'hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            Gabung Kuis (HP)
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole('SOLO');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              role === 'SOLO' ? 'text-white bg-amber-600/30 border border-amber-500/40 text-amber-300' : 'hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Latihan Mandiri
          </button>
        </nav>

        {/* Zone 3: Active PIN indicator & Sound control */}
        <div className="flex items-center gap-3 shrink-0">
          {activeSession && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-mono">
              <span className="text-slate-400">PIN:</span>
              <span className="font-bold tracking-wider text-sky-400">{activeSession.pin}</span>
              <span className="text-slate-500 text-[10px]">({activeSession.players.length} Mhs)</span>
            </div>
          )}

          <button
            onClick={toggleMute}
            title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole(role === 'DOSEN' ? 'MAHASISWA' : 'DOSEN');
            }}
            className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all whitespace-nowrap"
          >
            {role === 'DOSEN' ? 'Beralih ke Mahasiswa' : 'Mode Dosen'}
          </button>
        </div>
      </div>
    </header>
  );
};
