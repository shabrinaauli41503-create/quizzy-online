export type QuestionCategory = 
  | 'HTML & CSS Modern' 
  | 'JavaScript ES6+ & DOM' 
  | 'Async & REST API' 
  | 'React & Frontend' 
  | 'Node.js & Express' 
  | 'Database & Web Storage' 
  | 'Web Security & HTTP';

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit';

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string]; // 4 options A, B, C, D
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  timeLimitSeconds?: number;
}

export interface Player {
  id: string;
  name: string;
  nim?: string;
  avatar: string;
  isBot?: boolean;
  score: number;
  streak: number;
  lastAnswerCorrect?: boolean;
  lastPointsEarned?: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeTakenSeconds: number;
    pointsEarned: number;
  }[];
}

export type GameStage = 
  | 'LOBBY' 
  | 'COUNTDOWN' 
  | 'QUESTION' 
  | 'ANSWER_REVEAL' 
  | 'LEADERBOARD' 
  | 'PODIUM';

export interface QuizSession {
  pin: string;
  title: string;
  createdAt: number;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  questionIds: string[];
  currentQuestionIndex: number;
  timePerQuestion: number; // default 20s
  stage: GameStage;
  stageStartTime: number;
  players: Player[];
  showExplanation: boolean;
  shuffleQuestions: boolean;
}

export type AppRole = 'HOME' | 'DOSEN' | 'MAHASISWA' | 'SOLO';
