import { QuizSession, Player } from '../types/quiz';

// Dedicated KVDB bucket for Quizzy real-time cross-device sync
const KV_BASE_URL = 'https://kvdb.io/SD5rB2EnXG638DRd1MuuTp';

// 1. Host publishes session state (only Host writes this)
export async function pushSessionToCloud(session: QuizSession): Promise<boolean> {
  try {
    const res = await fetch(`${KV_BASE_URL}/qz_session_${session.pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] pushSession failed:', err);
    return false;
  }
}

// 2. Student or Host fetches active session state
export async function fetchSessionFromCloud(pin: string): Promise<QuizSession | null> {
  try {
    const cleanPin = pin.trim();
    const res = await fetch(`${KV_BASE_URL}/qz_session_${cleanPin}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.pin ? data : null;
  } catch (err) {
    console.warn('[CloudSync] fetchSession failed:', err);
    return null;
  }
}

// 3. Student registers or updates their player status (Each student writes to their OWN isolated key)
// This completely avoids race conditions and overwrites when multiple students join/answer!
export async function savePlayerToCloud(pin: string, player: Player): Promise<boolean> {
  try {
    const cleanPin = pin.trim();
    const res = await fetch(`${KV_BASE_URL}/qz_player_${cleanPin}_${player.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    return res.ok;
  } catch (err) {
    console.warn('[CloudSync] savePlayer failed:', err);
    return false;
  }
}

// 4. Host polls all players for the room in ONE single call via prefix listing
export async function fetchAllPlayersForPin(pin: string): Promise<Player[]> {
  try {
    const cleanPin = pin.trim();
    // KVDB prefix listing with values=true returns [ [key, value_string], ... ]
    const res = await fetch(
      `${KV_BASE_URL}/?prefix=qz_player_${cleanPin}_&format=json&values=true&t=${Date.now()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    const players: Player[] = [];
    for (const item of items) {
      if (Array.isArray(item) && item.length >= 2) {
        try {
          const val = typeof item[1] === 'string' ? JSON.parse(item[1]) : item[1];
          if (val && val.id && val.name) {
            players.push(val as Player);
          }
        } catch {
          // ignore corrupted single entry
        }
      }
    }

    return players;
  } catch (err) {
    console.warn('[CloudSync] fetchAllPlayers failed:', err);
    return [];
  }
}
