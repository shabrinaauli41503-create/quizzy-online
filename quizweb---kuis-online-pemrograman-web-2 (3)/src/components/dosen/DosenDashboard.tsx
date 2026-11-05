import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { QuizQuestion, QuestionCategory, DifficultyLevel } from '../../types/quiz';
import { 
  Play, Plus, Trash2, Edit3, RotateCcw, Download, Search, 
  Users, CheckCircle2, Clock, Smartphone, 
  AlertCircle, Sparkles, Layers, FileSpreadsheet
} from 'lucide-react';
import { HostGameView } from './HostGameView';
import { soundManager } from '../../utils/soundEffects';

const CATEGORIES: QuestionCategory[] = [
  'HTML & CSS Modern',
  'JavaScript ES6+ & DOM',
  'Async & REST API',
  'React & Frontend',
  'Node.js & Express',
  'Database & Web Storage',
  'Web Security & HTTP',
];

export const DosenDashboard: React.FC = () => {
  const { 
    questions, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    resetQuestions,
    activeSession,
    createSession,
    recaps,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'SESI' | 'BANK_SOAL' | 'REKAP'>('SESI');
  
  // Create session form states
  const [sessionTitle, setSessionTitle] = useState('UAS Pemrograman Web 2 (Full-Stack & API)');
  const [questionCount, setQuestionCount] = useState(15);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  // Bank Soal filter & search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [difficultyFilter, setDifficultyFilter] = useState('Semua');

  // Modal edit/tambah soal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Form question modal fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formCategory, setFormCategory] = useState<QuestionCategory>('HTML & CSS Modern');
  const [formDifficulty, setFormDifficulty] = useState<DifficultyLevel>('Sedang');

  // Open modal for new question
  const handleOpenAddModal = () => {
    soundManager.playTap();
    setEditingQuestion(null);
    setFormQuestion('');
    setFormCode('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormCategory('HTML & CSS Modern');
    setFormDifficulty('Sedang');
    setShowQuestionModal(true);
  };

  // Open modal for editing question
  const handleOpenEditModal = (q: QuizQuestion) => {
    soundManager.playTap();
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setFormCode(q.codeSnippet || '');
    setFormOptions([...q.options]);
    setFormCorrectIndex(q.correctAnswer);
    setFormExplanation(q.explanation);
    setFormCategory(q.category);
    setFormDifficulty(q.difficulty);
    setShowQuestionModal(true);
  };

  // Save question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || formOptions.some(opt => !opt.trim())) {
      alert('Mohon isi teks pertanyaan dan keempat opsi jawaban!');
      return;
    }

    if (editingQuestion) {
      updateQuestion({
        ...editingQuestion,
        question: formQuestion.trim(),
        codeSnippet: formCode.trim() || undefined,
        options: formOptions,
        correctAnswer: formCorrectIndex,
        explanation: formExplanation.trim() || 'Jawaban benar.',
        category: formCategory,
        difficulty: formDifficulty,
      });
    } else {
      addQuestion({
        question: formQuestion.trim(),
        codeSnippet: formCode.trim() || undefined,
        options: formOptions,
        correctAnswer: formCorrectIndex,
        explanation: formExplanation.trim() || 'Jawaban benar.',
        category: formCategory,
        difficulty: formDifficulty,
      });
    }

    setShowQuestionModal(false);
    soundManager.playTap();
  };

  // Handle start session
  const handleCreateNewSession = () => {
    soundManager.playStart();
    createSession({
      title: sessionTitle,
      questionCount,
      timePerQuestion,
      selectedCategory: selectedCategoryFilter,
      shuffleQuestions,
    });
  };

  // Export recap as CSV
  const handleExportCSV = (recordId?: string) => {
    const recordsToExport = recordId ? recaps.filter(r => r.id === recordId) : recaps;
    if (recordsToExport.length === 0) {
      alert('Belum ada data rekap nilai untuk di-export.');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID Sesi,PIN,Judul Kuis,Tanggal,Nama Mahasiswa,NIM,Skor Akhir,Benar,Salah,Akurasi (%)\n';

    recordsToExport.forEach(rec => {
      rec.players.forEach(p => {
        const correctCount = p.answers.filter(a => a.isCorrect).length;
        const totalAnswered = p.answers.length;
        const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
        const row = [
          `"${rec.id}"`,
          `"${rec.pin}"`,
          `"${rec.sessionTitle.replace(/"/g, '""')}"`,
          `"${rec.date}"`,
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.nim || '-'}"`,
          p.score,
          correctCount,
          totalAnswered - correctCount,
          `${accuracy}%`,
        ].join(',');
        csvContent += row + '\n';
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_KuisMobile_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.codeSnippet && q.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'Semua' || q.category === categoryFilter;
    const matchesDiff = difficultyFilter === 'Semua' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Header & Tab Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <span>Panel Dosen & Penguji</span>
              <span>·</span>
              <span>UAS Pemrograman Web 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Ruang Kendali Kuis Interaktif
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Kelola bank soal Pemrograman Web, buka sesi kuis dengan PIN unik, dan pantau hasil secara real-time.
            </p>
          </div>

          {/* Segmented Tab Buttons */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => {
                soundManager.playTap();
                setActiveTab('SESI');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'SESI' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              Sesi & Kontrol
              {activeSession && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                setActiveTab('BANK_SOAL');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'BANK_SOAL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Bank Soal ({questions.length})
            </button>

            <button
              onClick={() => {
                soundManager.playTap();
                setActiveTab('REKAP');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'REKAP' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Rekap & Nilai
            </button>
          </div>
        </div>

        {/* TAB 1: SESI & KONTROL (HOST VIEW / BUAT SESI) */}
        {activeTab === 'SESI' && (
          <div>
            {activeSession ? (
              <HostGameView />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Setup Sesi Baru */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold font-display text-white">Buat Sesi Kuis Baru</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Sistem akan menghasilkan PIN permainan 6-angka untuk dibagikan ke mahasiswa.
                      </p>
                    </div>
                    <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                      <Smartphone className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Judul Sesi / Mata Kuliah
                      </label>
                      <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Contoh: Kuis Pemrograman Web - Full-Stack & API"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Jumlah Soal Ditampilkan
                        </label>
                        <select
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value={5}>5 Soal (Uji Coba Kilat)</option>
                          <option value={10}>10 Soal (Kuis Standar)</option>
                          <option value={15}>15 Soal (Rekomendasi UAS)</option>
                          <option value={20}>20 Soal (Lengkap)</option>
                          <option value={questions.length}>Semua Soal Tersedia ({questions.length})</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Waktu Tiap Soal
                        </label>
                        <select
                          value={timePerQuestion}
                          onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value={15}>15 Detik (Super Cepat)</option>
                          <option value={20}>20 Detik (Ideal Kahoot)</option>
                          <option value={30}>30 Detik (Santai & Penuh Pemikiran)</option>
                          <option value={45}>45 Detik (Analisis Kode)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Kategori Materi Soal
                        </label>
                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Semua">Semua Materi (HTML, CSS, JS, React, Node, DB)</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <label className="relative flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={shuffleQuestions}
                            onChange={(e) => setShuffleQuestions(e.target.checked)}
                            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-0 focus:ring-offset-0"
                          />
                          <span>Acak Urutan Soal</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateNewSession}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Buat Sesi & Buka Waiting Room
                  </button>
                </div>

                {/* Right Side: Quick info & Activity Flow */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      Alur Kuis (Berdasarkan PDF UAS)
                    </h3>
                    <ol className="space-y-3 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                        <span>Dosen membuat sesi dan menampilkan <strong>PIN Kuis</strong> di layar / proyektor.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                        <span>Mahasiswa memasukkan PIN & Nama dari HP masing-masing dan berkumpul di <strong>Waiting Room</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                        <span>Dosen menekan tombol <strong>Mulai Kuis</strong>. Soal Pemrograman Web muncul serentak di HP mahasiswa dengan hitung mundur waktu.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                        <span>Sistem otomatis menghitung poin berdasarkan ketepatan dan kecepatan menjawab.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                        <span>Di akhir kuis, <strong>Podium Juara 1, 2, 3</strong> dan rekap nilai otomatis ditampilkan dan dapat di-export ke CSV/Excel!</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Total Soal Siap Pakai</div>
                      <div className="text-2xl font-bold font-mono text-white mt-0.5">{questions.length} Soal</div>
                      <div className="text-[11px] text-slate-500">Mencakup Frontend, Backend, REST API, Database & Security</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('BANK_SOAL')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium transition-colors"
                    >
                      Lihat Soal
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: BANK SOAL FLUTTER */}
        {activeTab === 'BANK_SOAL' && (
          <div className="space-y-6">
            {/* Filter and Action bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kata kunci soal..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Semua">Semua Kategori</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Difficulty */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Semua">Semua Tingkat</option>
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang</option>
                  <option value="Sulit">Sulit</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (confirm('Kembalikan bank soal ke 35 soal standar Pemrograman Web?')) {
                      resetQuestions();
                      soundManager.playTap();
                    }
                  }}
                  title="Reset ke 35 soal standar Pemrograman Web"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Default
                </button>

                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Soal Baru
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Tidak ada soal yang sesuai dengan filter pencarian.</p>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono font-bold text-sky-400">#{idx + 1}</span>
                          <span>·</span>
                          <span className="text-slate-300 font-medium">{q.category}</span>
                          <span>·</span>
                          <span className={`font-medium ${
                            q.difficulty === 'Mudah' ? 'text-emerald-400' :
                            q.difficulty === 'Sedang' ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                          {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Soal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus soal ini dari bank soal?')) {
                              deleteQuestion(q.id);
                              soundManager.playTap();
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Hapus Soal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {q.codeSnippet && (
                      <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl overflow-x-auto">
                        <pre className="text-xs font-mono text-emerald-400">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        const label = ['A', 'B', 'C', 'D'][optIdx];
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs border ${
                              isCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                                : 'bg-slate-800/40 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                              isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {label}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="pt-1 text-xs text-slate-400 border-t border-slate-800/60 flex items-start gap-2">
                      <span className="font-semibold text-slate-300 shrink-0">Pembahasan:</span>
                      <span className="italic">{q.explanation}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REKAP NILAI & LAPORAN */}
        {activeTab === 'REKAP' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Laporan & Rekap Nilai Mahasiswa</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arsip otomatis semua sesi kuis yang telah selesai. Siap diekspor ke format CSV / Excel.
                </p>
              </div>
              <button
                onClick={() => handleExportCSV()}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                Export Semua Nilai (CSV)
              </button>
            </div>

            {recaps.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300">Belum Ada Sesi Kuis yang Selesai</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Mulai sesi kuis di tab &quot;Sesi & Kontrol&quot;, jalankan kuis hingga selesai, maka hasil nilai mahasiswa akan otomatis terekam di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {recaps.map(rec => (
                  <div key={rec.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono font-bold text-sky-400">PIN: {rec.pin}</span>
                          <span>·</span>
                          <span>{rec.date}</span>
                          <span>·</span>
                          <span>{rec.totalQuestions} Soal</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{rec.sessionTitle}</h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Rata-rata Skor</div>
                          <div className="text-sm font-bold font-mono text-emerald-400">{rec.averageScore.toLocaleString()} pts</div>
                        </div>
                        <button
                          onClick={() => handleExportCSV(rec.id)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                          title="Export Sesi Ini Saja"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Table of students */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                            <th className="py-2.5 px-3">Peringkat</th>
                            <th className="py-2.5 px-3">Mahasiswa</th>
                            <th className="py-2.5 px-3">NIM</th>
                            <th className="py-2.5 px-3 text-right">Skor Total</th>
                            <th className="py-2.5 px-3 text-center">Benar / Soal</th>
                            <th className="py-2.5 px-3 text-center">Akurasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {rec.players.map((p, pIdx) => {
                            const correct = p.answers.filter(a => a.isCorrect).length;
                            const total = p.answers.length;
                            const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
                            return (
                              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold">
                                  {pIdx === 0 ? '🥇 1' : pIdx === 1 ? '🥈 2' : pIdx === 2 ? '🥉 3' : `#${pIdx + 1}`}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                                  <span>{p.avatar}</span>
                                  <span>{p.name}</span>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-400">{p.nim || '-'}</td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-sky-400">
                                  {p.score.toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                                  {correct} / {rec.totalQuestions}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono">
                                  <span className={`font-semibold ${
                                    acc >= 80 ? 'text-emerald-400' :
                                    acc >= 60 ? 'text-amber-400' : 'text-rose-400'
                                  }`}>
                                    {acc}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: TAMBAH / EDIT SOAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-display text-white">
                {editingQuestion ? 'Edit Soal Pemrograman Web' : 'Tambah Soal Baru'}
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pertanyaan Kuis
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Contoh: Tag HTML manakah yang digunakan untuk menampilkan video?"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Potongan Kode JS / HTML / SQL (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Contoh: const [count, setCount] = useState(0);"
                  className="w-full px-3.5 py-2.5 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as QuestionCategory)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tingkat Kesulitan</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              {/* 4 Options */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  4 Pilihan Jawaban (Pilih radio button untuk jawaban yang BENAR)
                </label>
                {([0, 1, 2, 3] as const).map((idx) => {
                  const label = ['A', 'B', 'C', 'D'][idx];
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-700 focus:ring-0"
                      />
                      <span className="w-6 text-xs font-bold font-mono text-slate-400">{label}.</span>
                      <input
                        type="text"
                        value={formOptions[idx]}
                        onChange={(e) => {
                          const nextOpts: [string, string, string, string] = [...formOptions];
                          nextOpts[idx] = e.target.value;
                          setFormOptions(nextOpts);
                        }}
                        placeholder={`Pilihan ${label}`}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pembahasan / Penjelasan Jawaban
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Mengapa pilihan tersebut benar..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl font-bold transition-colors shadow-md shadow-indigo-600/30"
                >
                  {editingQuestion ? 'Perbarui Soal' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
