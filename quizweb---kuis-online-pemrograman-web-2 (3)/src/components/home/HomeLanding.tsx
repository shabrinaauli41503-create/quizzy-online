import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { 
  Smartphone, Monitor, Sparkles, Play, Award, 
  Layers, CheckCircle2, ArrowRight, BookOpen, Users, FileSpreadsheet
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export const HomeLanding: React.FC = () => {
  const { setRole, createSession, addSimulatedStudents, joinSession } = useQuiz();

  // One-click quick demo setup
  const handleQuickDemo = () => {
    soundManager.playStart();
    const pin = createSession({
      title: 'Demo UAS Pemrograman Web 2 (Kahoot Style)',
      questionCount: 10,
      timePerQuestion: 20,
      shuffleQuestions: true,
    });
    // Add 6 classmates
    setTimeout(() => {
      addSimulatedStudents(6);
      // Join as player
      joinSession(pin, 'Shabrina Aulia', '2110512015', '💙');
      setRole('MAHASISWA');
    }, 150);
  };

  return (
    <div className="space-y-16 py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Game Kuis Online Interaktif · Sensasi Seru Ala Kahoot!</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white leading-tight">
          Quizzy<span className="text-amber-400">!</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400">
            Kuis Kelas Jadi Seru!
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Platform kuis interaktif serentak ala <strong>Kahoot</strong>. Dosen/Host memegang kendali di layar proyektor, mahasiswa menekan tombol buzzer 4 warna di HP masing-masing, kumpulkan bonus kecepatan, combo streak 🔥, dan raih posisi juara di podium!
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => {
              soundManager.playTap();
              setRole('MAHASISWA');
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-600/25 flex items-center gap-2 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Gabung Kuis di HP (Input PIN)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole('DOSEN');
            }}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <Monitor className="w-4 h-4 text-indigo-400" />
            <span>Panel Dosen (Host Proyektor)</span>
          </button>

          <button
            onClick={handleQuickDemo}
            className="px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Demo Kilat 1-Klik (Dengan Bot Siswa)</span>
          </button>
        </div>
      </div>

      {/* Two Roles Split Cards (Directly matching PDF Use Case Diagram) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Role 1: Dosen / Admin */}
        <div className="p-7 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-3xl space-y-5 transition-all shadow-xl group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Monitor className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Aktor 1</div>
            <h3 className="text-xl font-bold font-display text-white">Admin / Dosen Pengampu</h3>
            <p className="text-xs text-slate-400">
              Sesuai Use Case Diagram: mengelola bank soal, membuat sesi PIN, mengendalikan jalannya kuis, dan merekap nilai.
            </p>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Kelola Data Soal:</strong> CRUD 35+ soal Pemrograman Web, kode JS/HTML/SQL, filter kategori & tingkat kesulitan.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Buat Sesi & PIN:</strong> Generate kode PIN 6 digit unik untuk kuis serentak di kelas.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Kontrol Jalannya Kuis:</strong> Buka waiting room, countdown soal, reveal jawaban, leaderboard, podium.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>Rekap Nilai & Laporan:</strong> Ekspor nilai mahasiswa dan akurasi ke format CSV / Excel.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole('DOSEN');
            }}
            className="w-full py-2.5 px-4 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Masuk ke Panel Dosen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Role 2: Mahasiswa / Player */}
        <div className="p-7 bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 rounded-3xl space-y-5 transition-all shadow-xl group">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">Aktor 2</div>
            <h3 className="text-xl font-bold font-display text-white">Mahasiswa / Player</h3>
            <p className="text-xs text-slate-400">
              Sesuai Activity Diagram: memasukkan PIN & Nama, menunggu di waiting room, menjawab soal di HP, dan melihat skor.
            </p>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>Gabung Kuis via PIN:</strong> Input PIN, Nama Lengkap, NIM, serta memilih avatar avatar karakter unik.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>Waiting Room Interaktif:</strong> Melihat daftar rekan sekelas yang bergabung secara real-time.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>Jawab Soal Web di HP:</strong> Countdown waktu, pilihan jawaban 4 warna, bonus kecepatan & combo streak.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span><strong>Podium & Pembahasan:</strong> Peringkat juara 1-2-3 dan review penjelasan soal untuk bahan belajar.</span>
            </li>
          </ul>

          <button
            onClick={() => {
              soundManager.playTap();
              setRole('MAHASISWA');
            }}
            className="w-full py-2.5 px-4 bg-sky-600/30 hover:bg-sky-600 border border-sky-500/40 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Gabung Sebagai Mahasiswa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Topics Covered Grid */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-bold font-display text-white">
            Cakupan Materi Pemrograman Web 2 (35+ Soal Lengkap)
          </h3>
          <p className="text-xs text-slate-400">
            Disusun sesuai silabus kurikulum mata kuliah Pemrograman Web 2 (Frontend, Backend, Database, Security).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'HTML & CSS Modern', desc: 'Flexbox, Grid Layout, Semantic HTML, Responsive' },
            { label: 'JavaScript ES6+ & DOM', desc: 'Arrow Functions, Destructuring, Spread, QuerySelector' },
            { label: 'React & Frontend', desc: 'useState, useEffect, Virtual DOM, Components' },
            { label: 'Node.js & Express', desc: 'Middlewares, Dynamic Routing, req.params, REST' },
            { label: 'Async & REST API', desc: 'Promises, Async/Await, Fetch API, WebSocket' },
            { label: 'Database & Storage', desc: 'MySQL JOIN, MongoDB BSON, LocalStorage, Cookies' },
            { label: 'Web Security & HTTP', desc: 'JWT, CORS, XSS, CSRF, HttpOnly SameSite' },
            { label: 'Web Architecture', desc: 'SPA vs MPA, Environment Vars (.env), Web Performance' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <div className="font-bold text-sky-400">{item.label}</div>
              <div className="text-[11px] text-slate-400 leading-snug">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-900">
        <div>Aplikasi Tugas UAS Pemrograman Web 2 · Berbasis React, TypeScript & Tailwind CSS</div>
        <div className="mt-1">Dibuat khusus untuk kebutuhan ujian interaktif dosen & mahasiswa</div>
      </div>

    </div>
  );
};
