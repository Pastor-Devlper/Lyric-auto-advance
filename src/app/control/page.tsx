"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import SongList from "@/components/SongList";
import PlayerControls from "@/components/PlayerControls";
import { readState, updateState } from "@/lib/state";
import { getAllSongs, getFlatLines } from "@/lib/songs";
import { AppState, FlatLine, Song } from "@/lib/types";

export default function ControlPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [appState, setAppState] = useState<AppState>({
    currentSongId: null,
    currentLineIndex: 0,
    isPlaying: false,
    speedMultiplier: 1.0,
    timestamp: 0,
  });
  const [flatLines, setFlatLines] = useState<FlatLine[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Timer ref for auto-advance
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(appState);
  stateRef.current = appState;

  const flatLinesRef = useRef(flatLines);
  flatLinesRef.current = flatLines;

  // Load songs on mount
  useEffect(() => {
    const loaded = getAllSongs();
    setSongs(loaded);
    const state = readState();
    setAppState(state);
    if (state.currentSongId) {
      const song = loaded.find((s) => s.id === state.currentSongId) ?? null;
      setCurrentSong(song);
      if (song) setFlatLines(getFlatLines(song));
    }
  }, []);

  // Rebuild flatlines when currentSong changes
  useEffect(() => {
    if (currentSong) {
      setFlatLines(getFlatLines(currentSong));
    } else {
      setFlatLines([]);
    }
  }, [currentSong]);

  // Auto-advance timer
  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const state = stateRef.current;
    const lines = flatLinesRef.current;
    if (!state.isPlaying || lines.length === 0) return;

    const idx = state.currentLineIndex;
    if (idx >= lines.length - 1) {
      // End of song — stop
      const next = { ...stateRef.current, isPlaying: false };
      setAppState(next);
      updateState(next);
      return;
    }

    const line = lines[idx];
    const delay = (line.duration / state.speedMultiplier) * 1000;

    timerRef.current = setTimeout(() => {
      const currentState = stateRef.current;
      if (!currentState.isPlaying) return;

      const nextIdx = currentState.currentLineIndex + 1;
      if (nextIdx >= flatLinesRef.current.length) {
        const next = { ...currentState, isPlaying: false };
        setAppState(next);
        updateState(next);
        return;
      }
      const next = { ...currentState, currentLineIndex: nextIdx };
      setAppState(next);
      updateState(next);
    }, delay);
  }, []);

  // Re-schedule whenever state changes
  useEffect(() => {
    if (appState.isPlaying) {
      scheduleNext();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [appState.isPlaying, appState.currentLineIndex, appState.speedMultiplier, scheduleNext]);

  // Line ref for auto-scroll
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = lineRefs.current[appState.currentLineIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [appState.currentLineIndex]);

  // Handlers
  const handleSelectSong = (song: Song) => {
    const next = updateState({
      currentSongId: song.id,
      currentLineIndex: 0,
      isPlaying: false,
    });
    setAppState(next);
    setCurrentSong(song);
  };

  const handlePlay = () => {
    const next = updateState({ isPlaying: true });
    setAppState(next);
  };

  const handlePause = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = updateState({ isPlaying: false });
    setAppState(next);
  };

  const handlePrevLine = () => {
    const newIdx = Math.max(0, appState.currentLineIndex - 1);
    const next = updateState({ currentLineIndex: newIdx });
    setAppState(next);
  };

  const handleNextLine = () => {
    const newIdx = Math.min(flatLines.length - 1, appState.currentLineIndex + 1);
    const next = updateState({ currentLineIndex: newIdx });
    setAppState(next);
  };

  const handleRestart = () => {
    const next = updateState({ currentLineIndex: 0, isPlaying: false });
    setAppState(next);
  };

  const handleSpeedChange = (speed: number) => {
    const next = updateState({ speedMultiplier: speed });
    setAppState(next);
  };

  const handleLineClick = (idx: number) => {
    const next = updateState({ currentLineIndex: idx });
    setAppState(next);
  };

  // Group flatLines back by section for display
  const sectionGroups: { name: string; lines: FlatLine[] }[] = [];
  flatLines.forEach((line) => {
    const last = sectionGroups[sectionGroups.length - 1];
    if (!last || last.name !== line.sectionName) {
      sectionGroups.push({ name: line.sectionName, lines: [line] });
    } else {
      last.lines.push(line);
    }
  });

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← 홈
          </Link>
          <span className="text-gray-700">|</span>
          <span className="text-white font-semibold text-sm">컨트롤러</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/songs"
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition-colors"
          >
            곡 관리
          </Link>
          <Link
            href="/display"
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition-colors"
          >
            송출 화면 열기 ↗
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - song list */}
        <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-3 py-2 border-b border-gray-800">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
              곡 목록
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <SongList
              songs={songs}
              currentSongId={appState.currentSongId}
              onSelectSong={handleSelectSong}
            />
          </div>
        </aside>

        {/* Main - lyrics view */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!currentSong ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <div className="text-5xl mb-4">🎵</div>
              <p className="text-lg font-medium text-gray-500">곡을 선택하세요</p>
              <p className="text-sm mt-1">왼쪽 목록에서 찬양곡을 선택하세요</p>
            </div>
          ) : (
            <>
              {/* Song title header */}
              <div className="px-5 py-3 bg-gray-900 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {currentSong.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      {currentSong.bpm > 0 && (
                        <span className="text-xs text-blue-400 font-medium">
                          ♩ {currentSong.bpm} BPM
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {flatLines.length}줄 · {currentSong.sections.length}섹션
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      appState.isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-600"
                    }`}
                    title={appState.isPlaying ? "재생 중" : "정지"}
                  />
                </div>
              </div>

              {/* Lyrics scroll area */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 lyric-scroll"
              >
                {sectionGroups.map((group) => (
                  <div key={group.name} className="mb-4">
                    {/* Section label */}
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2 px-2">
                      {group.name}
                    </div>
                    {/* Lines */}
                    <div className="flex flex-col gap-0.5">
                      {group.lines.map((line) => {
                        const isActive = line.globalIndex === appState.currentLineIndex;
                        return (
                          <div
                            key={line.globalIndex}
                            ref={(el) => {
                              lineRefs.current[line.globalIndex] = el;
                            }}
                            onClick={() => handleLineClick(line.globalIndex)}
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                              isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                          >
                            <span
                              className={`text-sm leading-snug ${
                                isActive ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {line.text}
                            </span>
                            <span
                              className={`text-xs ml-3 flex-shrink-0 ${
                                isActive ? "text-blue-200" : "text-gray-600 group-hover:text-gray-500"
                              }`}
                            >
                              {line.duration}s
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Player controls */}
              <PlayerControls
                isPlaying={appState.isPlaying}
                speedMultiplier={appState.speedMultiplier}
                bpm={currentSong.bpm}
                currentLine={appState.currentLineIndex}
                totalLines={flatLines.length}
                onPlay={handlePlay}
                onPause={handlePause}
                onPrevLine={handlePrevLine}
                onNextLine={handleNextLine}
                onRestart={handleRestart}
                onSpeedChange={handleSpeedChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
