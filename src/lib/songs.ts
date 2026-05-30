import { Song } from "./types";
import { sampleSongs } from "./sampleSongs";

const SONGS_KEY = "autoscroller_songs";

function initSongs(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(SONGS_KEY);
  if (!existing) {
    localStorage.setItem(SONGS_KEY, JSON.stringify(sampleSongs));
  }
}

export function getAllSongs(): Song[] {
  if (typeof window === "undefined") return [];
  initSongs();
  try {
    const raw = localStorage.getItem(SONGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Song[];
  } catch {
    return [];
  }
}

export function getSongById(id: string): Song | null {
  const songs = getAllSongs();
  return songs.find((s) => s.id === id) ?? null;
}

export function saveSong(song: Song): void {
  if (typeof window === "undefined") return;
  const songs = getAllSongs();
  const idx = songs.findIndex((s) => s.id === song.id);
  if (idx >= 0) {
    songs[idx] = song;
  } else {
    songs.push(song);
  }
  localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
}

export function deleteSong(id: string): void {
  if (typeof window === "undefined") return;
  const songs = getAllSongs().filter((s) => s.id !== id);
  localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
}

export function generateId(): string {
  return `song-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function resetToSamples(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SONGS_KEY, JSON.stringify(sampleSongs));
}

export function getFlatLines(
  song: Song
): Array<{
  text: string;
  duration: number;
  sectionName: string;
  sectionIndex: number;
  lineIndexInSection: number;
  globalIndex: number;
}> {
  const flat: ReturnType<typeof getFlatLines> = [];
  let globalIndex = 0;
  song.sections.forEach((section, sectionIndex) => {
    section.lines.forEach((line, lineIndexInSection) => {
      flat.push({
        text: line.text,
        duration: line.duration,
        sectionName: section.name,
        sectionIndex,
        lineIndexInSection,
        globalIndex,
      });
      globalIndex++;
    });
  });
  return flat;
}
