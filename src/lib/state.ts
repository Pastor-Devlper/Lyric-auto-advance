import { AppState } from "./types";

const STATE_KEY = "autoscroller_state";

export const defaultState: AppState = {
  currentSongId: null,
  currentLineIndex: 0,
  isPlaying: false,
  speedMultiplier: 1.0,
  timestamp: 0,
};

export function readState(): AppState {
  if (typeof window === "undefined") return { ...defaultState };
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return { ...defaultState };
    return JSON.parse(raw) as AppState;
  } catch {
    return { ...defaultState };
  }
}

export function writeState(state: AppState): void {
  if (typeof window === "undefined") return;
  const updated: AppState = { ...state, timestamp: Date.now() };
  localStorage.setItem(STATE_KEY, JSON.stringify(updated));
  // Dispatch a storage event so same-tab listeners are notified
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: STATE_KEY,
      newValue: JSON.stringify(updated),
    })
  );
}

export function updateState(partial: Partial<AppState>): AppState {
  const current = readState();
  const next: AppState = { ...current, ...partial, timestamp: Date.now() };
  writeState(next);
  return next;
}
