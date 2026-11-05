import { QuizQuestion, QuizSession, Player } from '../types/quiz';
import { INITIAL_WEB_QUESTIONS } from '../data/webQuestions';

const QUESTIONS_KEY = 'quizweb_questions_v2';
const SESSIONS_KEY = 'quizweb_sessions_v2';
const RECAP_KEY = 'quizweb_recap_records_v2';
const ACTIVE_PIN_KEY = 'quizweb_current_pin';

export interface RecapRecord {
  id: string;
  pin: string;
  sessionTitle: string;
  date: string;
  totalQuestions: number;
  playersCount: number;
  averageScore: number;
  players: Player[];
}

export function getStoredQuestions(): QuizQuestion[] {
  try {
    const data = localStorage.getItem(QUESTIONS_KEY);
    if (!data) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_WEB_QUESTIONS));
      return INITIAL_WEB_QUESTIONS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WEB_QUESTIONS;
  } catch {
    return INITIAL_WEB_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: QuizQuestion[]): void {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions to localStorage', err);
  }
}

export function resetStoredQuestions(): QuizQuestion[] {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_WEB_QUESTIONS));
  return INITIAL_WEB_QUESTIONS;
}

export function getStoredSessions(): Record<string, QuizSession> {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveStoredSession(session: QuizSession): void {
  try {
    const sessions = getStoredSessions();
    sessions[session.pin] = session;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    localStorage.setItem(ACTIVE_PIN_KEY, session.pin);
  } catch (err) {
    console.error('Failed to save session', err);
  }
}

export function getStoredSessionByPin(pin: string): QuizSession | null {
  const sessions = getStoredSessions();
  return sessions[pin] || null;
}

export function getStoredRecap(): RecapRecord[] {
  try {
    const data = localStorage.getItem(RECAP_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRecapRecord(record: RecapRecord): void {
  try {
    const recaps = getStoredRecap();
    const existingIndex = recaps.findIndex(r => r.id === record.id || r.pin === record.pin);
    if (existingIndex >= 0) {
      recaps[existingIndex] = record;
    } else {
      recaps.unshift(record);
    }
    localStorage.setItem(RECAP_KEY, JSON.stringify(recaps));
  } catch (err) {
    console.error('Failed to save recap', err);
  }
}
