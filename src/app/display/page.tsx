"use client";

import { useEffect, useState, useCallback } from "react";
import LyricDisplay from "@/components/LyricDisplay";
import { readState } from "@/lib/state";
import { getSongById, getFlatLines } from "@/lib/songs";
import { AppState, FlatLine, Song } from "@/lib/types";

const POLL_INTERVAL = 200;

export default function DisplayPage() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [flatLines, setFlatLines] = useState<FlatLine[]>([]);

  const sync = useCallback(() => {
    const state = readState();
    setAppState((prev) => {
      if (
        prev &&
        prev.currentSongId === state.currentSongId &&
        prev.currentLineIndex === state.currentLineIndex &&
        prev.isPlaying === state.isPlaying &&
        prev.timestamp === state.timestamp
      ) {
        return prev;
      }
      return state;
    });

    if (state.currentSongId) {
      const s = getSongById(state.currentSongId);
      setSong(s);
      if (s) {
        setFlatLines(getFlatLines(s));
      }
    } else {
      setSong(null);
      setFlatLines([]);
    }
  }, []);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [sync]);

  // Derive display values
  if (!appState || !song || flatLines.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center select-none">
        <p className="text-gray-700 text-2xl font-light tracking-widest">
          AUTO SCROLLER
        </p>
        <p className="text-gray-800 text-sm mt-3 tracking-wide">
          컨트롤러에서 곡을 선택하세요
        </p>
      </div>
    );
  }

  const idx = Math.min(appState.currentLineIndex, flatLines.length - 1);
  const currentLine = flatLines[idx];
  const nextLine = idx + 1 < flatLines.length ? flatLines[idx + 1] : null;

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <LyricDisplay
        currentText={currentLine?.text ?? ""}
        nextText={nextLine?.text ?? null}
        sectionName={currentLine?.sectionName ?? ""}
        songTitle={song.title}
        isPlaying={appState.isPlaying}
      />
    </div>
  );
}
