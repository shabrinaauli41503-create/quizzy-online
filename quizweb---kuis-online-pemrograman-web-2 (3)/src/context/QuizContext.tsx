import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { QuizQuestion, QuizSession, Player, AppRole, GameStage } from '../types/quiz';
import { 
  getStoredQuestions, 
  saveStoredQuestions, 
  resetStoredQuestions, 
  getStoredSessionByPin, 
  saveStoredSession, 
  saveRecapRecord, 
  getStoredRecap,
  RecapRecord 
} from '../utils/storage';
import { soundManager } from '../utils/soundEffects';
import { SIMULATED_STUDENTS } from '../data/avatars';
import { 
  pushSessionToCloud, 
  fetchSessionFromCloud, 
  savePlayerToCloud, 
  fetchAllPlayersForPin 
} from '../utils/cloudSync';

interface QuizContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  questions: QuizQuestion[];
  addQuestion: (q: Omit<QuizQuestion, 'id'>) => void;
  updateQuestion: (q: QuizQuestion) => void;
  deleteQuestion: (id: string) => void;
  resetQuestions: () => void;
  
  // Host / Dosen methods
  activeSession: QuizSession | null;
  createSession: (options: {
    title: string;
    questionCount: number;
    timePerQuestion: number;
    selectedCategory?: string;
    shuffleQuestions?: boolean;
  }) => string; // returns PIN
  setGameStage: (stage: GameStage) => void;
  nextQuestion: () => void;
  endGame: () => void;
  addSimulatedStudents: (count?: number) => void;
  kickPlayer: (playerId: string) => void;
  
  // Mahasiswa / Player methods
  currentPlayer: Player | null;
  joinSession: (pin: string, name: string, nim?: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  submitAnswer: (optionIndex: number, timeSpentSec: number) => void;
  leaveSession: () => void;
  syncWithCloud: () => Promise<void>;

  // Sound & Recaps
  isMuted: boolean;
  toggleMute: () => void;
  recaps: RecapRecord[];
  refreshRecaps: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('HOME');
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getStoredQuestions());
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [recaps, setRecaps] = useState<RecapRecord[]>(() => getStoredRecap());

  const channelRef = useRef<BroadcastChannel | null>(null);
  const botTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Setup BroadcastChannel for cross-tab local sync
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('quizweb_sync_v3');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SESSION_UPDATED') {
          setActiveSession(payload);
          if (currentPlayer) {
            const updated = payload.players?.find((p: Player) => p.id === currentPlayer.id);
            if (updated) setCurrentPlayer(updated);
          }
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [currentPlayer]);

  // Broadcast session changes locally and push to Cloud (Only Host writes the session)
  const broadcastSession = useCallback((session: QuizSession) => {
    saveStoredSession(session);
    pushSessionToCloud(session);
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({ type: 'SESSION_UPDATED', payload: session });
      } catch {
        // broadcast fallback silent
      }
    }
  }, []);

  // HOST POLLER: Poll cloud for newly joined students or submitted answers
  useEffect(() => {
    if (role !== 'DOSEN' || !activeSession || !activeSession.pin) return;
    const pin = activeSession.pin;

    const pollInterval = setInterval(async () => {
      try {
        const cloudPlayers = await fetchAllPlayersForPin(pin);
        if (!cloudPlayers || cloudPlayers.length === 0) return;

        setActiveSession(prev => {
          if (!prev || prev.pin !== pin) return prev;

          let hasChanges = false;
          const currentList = [...prev.players];

          for (const cp of cloudPlayers) {
            const idx = currentList.findIndex(
              p => p.id === cp.id || p.name.trim().toLowerCase() === cp.name.trim().toLowerCase()
            );

            if (idx === -1) {
              // New student joined from external device!
              currentList.push(cp);
              hasChanges = true;
            } else {
              // Existing student submitted answer or gained points
              const existing = currentList[idx];
              if (
                cp.answers.length > existing.answers.length ||
                cp.score !== existing.score ||
                cp.streak !== existing.streak
              ) {
                currentList[idx] = {
                  ...existing,
                  ...cp,
                  isBot: existing.isBot || cp.isBot,
                };
                hasChanges = true;
              }
            }
          }

          if (!hasChanges) return prev;

          const updated: QuizSession = {
            ...prev,
            players: currentList,
          };

          saveStoredSession(updated);
          pushSessionToCloud(updated); // Sync back so all students see updated roster & leaderboard
          return updated;
        });
      } catch (err) {
        // silent polling catch
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [role, activeSession?.pin]);

  // STUDENT POLLER: Poll cloud session for stage updates from Dosen (Countdown -> Question -> Reveal -> Leaderboard -> Podium)
  useEffect(() => {
    if (role !== 'MAHASISWA' || !activeSession || !activeSession.pin) return;
    const pin = activeSession.pin;

    const pollInterval = setInterval(async () => {
      try {
        const cloudSession = await fetchSessionFromCloud(pin);
        if (!cloudSession) return;

        setActiveSession(prev => {
          if (!prev) return cloudSession;

          const stageChanged = cloudSession.stage !== prev.stage;
          const qIndexChanged = cloudSession.currentQuestionIndex !== prev.currentQuestionIndex;
          const playerCountChanged = cloudSession.players.length !== prev.players.length;

          if (stageChanged || qIndexChanged || playerCountChanged) {
            saveStoredSession(cloudSession);
            return cloudSession;
          }
          return prev;
        });

        // Sync currentPlayer score and rank
        if (currentPlayer) {
          const me = cloudSession.players.find(
            p => p.id === currentPlayer.id || p.name.trim().toLowerCase() === currentPlayer.name.trim().toLowerCase()
          );
          if (me && (me.score !== currentPlayer.score || me.answers.length !== currentPlayer.answers.length)) {
            setCurrentPlayer(me);
          }
        }
      } catch (err) {
        // silent catch
      }
    }, 800);

    return () => clearInterval(pollInterval);
  }, [role, activeSession?.pin, currentPlayer?.id]);

  const syncWithCloud = async () => {
    if (!activeSession || !activeSession.pin) return;
    try {
      const cloudSession = await fetchSessionFromCloud(activeSession.pin);
      if (cloudSession) {
        setActiveSession(cloudSession);
        saveStoredSession(cloudSession);
        if (currentPlayer) {
          const me = cloudSession.players.find(
            p => p.id === currentPlayer.id || p.name.trim().toLowerCase() === currentPlayer.name.trim().toLowerCase()
          );
          if (me) setCurrentPlayer(me);
        }
      }
    } catch {
      // silent
    }
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const refreshRecaps = () => {
    setRecaps(getStoredRecap());
  };

  // Question bank CRUD
  const addQuestion = (newQ: Omit<QuizQuestion, 'id'>) => {
    const id = `web-custom-${Date.now()}`;
    const questionWithId: QuizQuestion = { ...newQ, id };
    const updated = [questionWithId, ...questions];
    setQuestions(updated);
    saveStoredQuestions(updated);
  };

  const updateQuestion = (updatedQ: QuizQuestion) => {
    const updated = questions.map(q => q.id === updatedQ.id ? updatedQ : q);
    setQuestions(updated);
    saveStoredQuestions(updated);
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    saveStoredQuestions(updated);
  };

  const resetQuestions = () => {
    const defaultQs = resetStoredQuestions();
    setQuestions(defaultQs);
  };

  // Create game session
  const createSession = ({
    title,
    questionCount,
    timePerQuestion,
    selectedCategory,
    shuffleQuestions = true,
  }: {
    title: string;
    questionCount: number;
    timePerQuestion: number;
    selectedCategory?: string;
    shuffleQuestions?: boolean;
  }): string => {
    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
    let pool = [...questions];
    if (selectedCategory && selectedCategory !== 'Semua') {
      pool = pool.filter(q => q.category === selectedCategory);
    }
    if (pool.length === 0) pool = [...questions];

    if (shuffleQuestions) {
      pool.sort(() => Math.random() - 0.5);
    }

    const selectedIds = pool.slice(0, Math.min(questionCount, pool.length)).map(q => q.id);

    const newSession: QuizSession = {
      pin,
      title: title || 'Quizzy! - Kuis Interaktif Pemrograman Web',
      createdAt: Date.now(),
      status: 'WAITING',
      questionIds: selectedIds,
      currentQuestionIndex: 0,
      timePerQuestion: timePerQuestion || 20,
      stage: 'LOBBY',
      stageStartTime: Date.now(),
      players: [],
      showExplanation: true,
      shuffleQuestions: !!shuffleQuestions,
    };

    setActiveSession(newSession);
    broadcastSession(newSession);
    return pin;
  };

  // Add simulated classmates to make demo lively
  const addSimulatedStudents = (count: number = 6) => {
    if (!activeSession) return;
    const available = SIMULATED_STUDENTS.filter(
      b => !activeSession.players.some(p => p.name === b.name)
    );
    const toAdd = available.slice(0, count);

    const newBots: Player[] = toAdd.map(b => ({
      id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: b.name,
      nim: b.nim,
      avatar: b.avatar,
      isBot: true,
      score: 0,
      streak: 0,
      answers: [],
    }));

    const updatedSession: QuizSession = {
      ...activeSession,
      players: [...activeSession.players, ...newBots],
    };

    setActiveSession(updatedSession);
    broadcastSession(updatedSession);
  };

  // Remove player from session
  const kickPlayer = (playerId: string) => {
    if (!activeSession) return;
    const updatedSession: QuizSession = {
      ...activeSession,
      players: activeSession.players.filter(p => p.id !== playerId),
    };
    setActiveSession(updatedSession);
    broadcastSession(updatedSession);
  };

  // Trigger bots to answer during QUESTION stage
  const simulateBotAnswers = useCallback((session: QuizSession) => {
    botTimersRef.current.forEach(t => clearTimeout(t));
    botTimersRef.current = [];

    const currentQId = session.questionIds[session.currentQuestionIndex];
    const currentQ = questions.find(q => q.id === currentQId);
    if (!currentQ) return;

    const bots = session.players.filter(p => p.isBot);
    bots.forEach(bot => {
      const maxDelay = Math.max(3000, (session.timePerQuestion - 3) * 1000);
      const delay = Math.floor(2500 + Math.random() * (maxDelay - 2500));

      const timer = setTimeout(() => {
        setActiveSession(prev => {
          if (!prev || prev.stage !== 'QUESTION') return prev;
          const botPlayer = prev.players.find(p => p.id === bot.id);
          if (!botPlayer || botPlayer.answers.some(a => a.questionId === currentQId)) return prev;

          const isCorrect = Math.random() < 0.78;
          let selectedOption = currentQ.correctAnswer;
          if (!isCorrect) {
            const wrongOptions = [0, 1, 2, 3].filter(idx => idx !== currentQ.correctAnswer);
            selectedOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
          }

          const timeTaken = delay / 1000;
          let points = 0;
          let newStreak = 0;

          if (isCorrect) {
            const speedRatio = Math.max(0, (session.timePerQuestion - timeTaken) / session.timePerQuestion);
            points = Math.round(1000 + speedRatio * 500 + Math.min(botPlayer.streak * 100, 500));
            newStreak = botPlayer.streak + 1;
          }

          const updatedPlayers = prev.players.map(p => {
            if (p.id === bot.id) {
              return {
                ...p,
                score: p.score + points,
                streak: newStreak,
                lastAnswerCorrect: isCorrect,
                lastPointsEarned: points,
                answers: [
                  ...p.answers,
                  {
                    questionId: currentQId,
                    selectedOption,
                    isCorrect,
                    timeTakenSeconds: timeTaken,
                    pointsEarned: points,
                  }
                ]
              };
            }
            return p;
          });

          const nextSession = { ...prev, players: updatedPlayers };
          broadcastSession(nextSession);
          return nextSession;
        });
      }, delay);

      botTimersRef.current.push(timer);
    });
  }, [questions, broadcastSession]);

  // Set game stage
  const setGameStage = (stage: GameStage) => {
    if (!activeSession) return;
    const now = Date.now();
    let updatedStatus = activeSession.status;
    if (stage === 'QUESTION' || stage === 'COUNTDOWN') {
      updatedStatus = 'IN_PROGRESS';
    } else if (stage === 'PODIUM') {
      updatedStatus = 'COMPLETED';
    }

    const updatedSession: QuizSession = {
      ...activeSession,
      stage,
      status: updatedStatus,
      stageStartTime: now,
    };

    setActiveSession(updatedSession);
    broadcastSession(updatedSession);

    if (stage === 'COUNTDOWN') {
      soundManager.playStart();
    } else if (stage === 'PODIUM') {
      soundManager.playVictory();
      const sortedPlayers = [...updatedSession.players].sort((a, b) => b.score - a.score);
      const totalScore = sortedPlayers.reduce((acc, p) => acc + p.score, 0);
      const avg = sortedPlayers.length > 0 ? Math.round(totalScore / sortedPlayers.length) : 0;
      const recap: RecapRecord = {
        id: `recap-${updatedSession.pin}-${Date.now()}`,
        pin: updatedSession.pin,
        sessionTitle: updatedSession.title,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        totalQuestions: updatedSession.questionIds.length,
        playersCount: updatedSession.players.length,
        averageScore: avg,
        players: sortedPlayers,
      };
      saveRecapRecord(recap);
      refreshRecaps();
    } else if (stage === 'QUESTION') {
      simulateBotAnswers(updatedSession);
    }
  };

  // Move to next question or end kuis
  const nextQuestion = () => {
    if (!activeSession) return;
    const nextIdx = activeSession.currentQuestionIndex + 1;
    if (nextIdx < activeSession.questionIds.length) {
      const updatedSession: QuizSession = {
        ...activeSession,
        currentQuestionIndex: nextIdx,
        stage: 'COUNTDOWN',
        stageStartTime: Date.now(),
      };
      setActiveSession(updatedSession);
      broadcastSession(updatedSession);
      soundManager.playStart();
    } else {
      setGameStage('PODIUM');
    }
  };

  const endGame = () => {
    setGameStage('PODIUM');
  };

  // Student join method with Cloud Fallback
  const joinSession = async (pin: string, name: string, nim?: string, avatar: string = '💙'): Promise<{ success: boolean; error?: string }> => {
    const cleanPin = pin.trim();
    let session = activeSession && activeSession.pin === cleanPin ? activeSession : getStoredSessionByPin(cleanPin);

    // If not found in local browser storage, fetch from global cloud storage!
    if (!session) {
      const cloudSession = await fetchSessionFromCloud(cleanPin);
      if (cloudSession) {
        session = cloudSession;
      }
    }

    if (!session) {
      return { success: false, error: `PIN "${cleanPin}" tidak ditemukan. Pastikan Dosen sudah membuat sesi dan membagikan PIN di layar.` };
    }

    if (session.status === 'COMPLETED') {
      return { success: false, error: 'Sesi kuis ini sudah selesai.' };
    }

    // Check if player name already taken
    const existing = session.players.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    let player: Player;

    if (existing) {
      player = existing;
    } else {
      player = {
        id: `mhs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        nim: nim?.trim() || undefined,
        avatar,
        score: 0,
        streak: 0,
        answers: [],
      };
    }

    // Write to student's isolated cloud key so Host picks it up immediately
    await savePlayerToCloud(cleanPin, player);

    const updatedPlayers = session.players.some(p => p.id === player.id)
      ? session.players
      : [...session.players, player];

    const updatedSession: QuizSession = {
      ...session,
      players: updatedPlayers,
    };

    setActiveSession(updatedSession);
    setCurrentPlayer(player);
    saveStoredSession(updatedSession);
    soundManager.playTap();

    return { success: true };
  };

  const submitAnswer = (optionIndex: number, timeSpentSec: number) => {
    if (!activeSession || !currentPlayer) return;
    const currentQId = activeSession.questionIds[activeSession.currentQuestionIndex];
    const currentQ = questions.find(q => q.id === currentQId);
    if (!currentQ) return;

    // Check if player already answered this question
    const alreadyAnswered = currentPlayer.answers.some(a => a.questionId === currentQId);
    if (alreadyAnswered) return;

    const isCorrect = optionIndex === currentQ.correctAnswer;
    let pointsEarned = 0;
    let newStreak = 0;

    if (isCorrect) {
      const speedRatio = Math.max(0, (activeSession.timePerQuestion - timeSpentSec) / activeSession.timePerQuestion);
      pointsEarned = Math.round(1000 + speedRatio * 500 + Math.min(currentPlayer.streak * 100, 500));
      newStreak = currentPlayer.streak + 1;
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const newAnswer = {
      questionId: currentQId,
      selectedOption: optionIndex,
      isCorrect,
      timeTakenSeconds: timeSpentSec,
      pointsEarned,
    };

    const updatedPlayer: Player = {
      ...currentPlayer,
      score: currentPlayer.score + pointsEarned,
      streak: newStreak,
      lastAnswerCorrect: isCorrect,
      lastPointsEarned: pointsEarned,
      answers: [...currentPlayer.answers, newAnswer],
    };

    setCurrentPlayer(updatedPlayer);

    // Save student's answer to cloud so Host picks it up on the big screen!
    savePlayerToCloud(activeSession.pin, updatedPlayer);
  };

  const leaveSession = () => {
    setCurrentPlayer(null);
    setRole('HOME');
  };

  return (
    <QuizContext.Provider
      value={{
        role,
        setRole,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        resetQuestions,
        activeSession,
        createSession,
        setGameStage,
        nextQuestion,
        endGame,
        addSimulatedStudents,
        kickPlayer,
        currentPlayer,
        joinSession,
        submitAnswer,
        leaveSession,
        syncWithCloud,
        isMuted,
        toggleMute,
        recaps,
        refreshRecaps,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
