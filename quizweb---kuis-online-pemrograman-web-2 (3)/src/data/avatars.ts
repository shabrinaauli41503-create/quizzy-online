export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
  bgColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'web-dev', emoji: '🌐', label: 'Web Architect', bgColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40' },
  { id: 'js-ninja', emoji: '⚡', label: 'JS Ninja', bgColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'react-pro', emoji: '⚛️', label: 'React Pro', bgColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { id: 'code-master', emoji: '💻', label: 'Coder Pro', bgColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
  { id: 'rocket-pilot', emoji: '🚀', label: 'Rocket Dev', bgColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { id: 'pixel-wizard', emoji: '⚡', label: 'Fast Hacker', bgColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { id: 'brain-genius', emoji: '🧠', label: 'Algo Brain', bgColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
  { id: 'star-student', emoji: '⭐', label: 'Star Player', bgColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
];

export const SIMULATED_STUDENTS = [
  { name: 'Aditya Pratama', nim: '2110512001', avatar: '💙' },
  { name: 'Nabila Putri S.', nim: '2110512014', avatar: '⚡' },
  { name: 'Rian Hidayat', nim: '2110512028', avatar: '🎯' },
  { name: 'Siti Rahmadani', nim: '2110512035', avatar: '🧠' },
  { name: 'Budi Santoso', nim: '2110512042', avatar: '🚀' },
  { name: 'Dewi Lestari', nim: '2110512050', avatar: '⭐' },
  { name: 'Fajar Nugraha', nim: '2110512063', avatar: '📱' },
  { name: 'Anisa Maharani', nim: '2110512079', avatar: '💻' },
];
