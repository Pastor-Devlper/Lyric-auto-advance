export interface LyricLine {
  text: string;
  duration: number; // seconds per line at 1x speed
}

export interface Section {
  name: string;
  lines: LyricLine[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  sections: Section[];
}

export interface AppState {
  currentSongId: string | null;
  currentLineIndex: number; // global line index across all sections
  isPlaying: boolean;
  speedMultiplier: number; // 0.5 to 2.0
  timestamp: number; // for sync detection
}

export interface FlatLine {
  text: string;
  duration: number;
  sectionName: string;
  sectionIndex: number;
  lineIndexInSection: number;
  globalIndex: number;
}
