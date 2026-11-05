import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { AVATAR_OPTIONS } from '../../data/avatars';
import { Smartphone, Sparkles, ArrowRight, CheckCircle2, User, Hash, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const MahasiswaJoin: React.FC = () => {
  const { activeSession, joinSession, setRole } = useQuiz();

  const [pin, setPin] = useState(activeSession ? activeSession.pin : '');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('💙');
  const [errorMsg, setErrorMsg] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pin.trim()) {
      setErrorMsg('Masukkan 6-digit PIN kuis yang diberikan oleh Dosen!');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Masukkan Nama Lengkap Anda!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await joinSession(pin, name, nim, selectedAvatar);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal bergabung ke sesi kuis.');
      }
    } catch {
      setErrorMsg('Koneksi terputus. Pastikan perangkat Anda terhubung ke internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickJoinDemo = () => {
    soundManager.playTap();
    if (activeSession) {
      setPin(activeSession.pin);
      setName('Muhammad Farhan');
      setNim('2110512099');
      setSelectedAvatar('💙');
    } else {
      setErrorMsg('Belum ada sesi kuis yang aktif. Buka "Panel Dosen" terlebih dahulu untuk membuat sesi.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25 text-white font-black text-xl">
            Q!
          </div>
          <h2 className="text-2xl font-black font-display text-white">
            Gabung Game Quizzy<span className="text-amber-400">!</span>
          </h2>
          <p className="text-xs text-slate-400">
            Masukkan Game PIN dari layar host proyektor dan pilih avatar karaktermu.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Game PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Game PIN (6 Digit)</span>
              {activeSession && (
                <button
                  type="button"
                  onClick={() => setPin(activeSession.pin)}
                  className="text-[11px] text-sky-400 hover:underline normal-case"
                >
                  Gunakan PIN Aktif ({activeSession.pin})
                </button>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Misal: 849201"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xl tracking-widest text-center text-sky-400 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Lengkap Mahasiswa
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Shabrina Aulia"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* NIM */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 2110512012"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Pilih Avatar Karakter
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => {
                    soundManager.playTap();
                    setSelectedAvatar(av.emoji);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedAvatar === av.emoji
                      ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-500/40 scale-105'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                  <span className="text-[10px] text-slate-300 truncate w-full text-center">
                    {av.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Masuk ke Waiting Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quickfill */}
        <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
          <button
            type="button"
            onClick={handleQuickJoinDemo}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Isi Otomatis Data Mahasiswa Demo</span>
          </button>
          
          <div>
            <button
              onClick={() => {
                soundManager.playTap();
                setRole('SOLO');
              }}
              className="text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              Atau coba <strong>Mode Latihan Mandiri (Solo)</strong> tanpa perlu PIN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
