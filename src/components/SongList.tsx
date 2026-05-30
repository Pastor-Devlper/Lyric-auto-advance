"use client";

import { Song } from "@/lib/types";

interface SongListProps {
  songs: Song[];
  currentSongId: string | null;
  onSelectSong: (song: Song) => void;
}

export default function SongList({
  songs,
  currentSongId,
  onSelectSong,
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm text-center">
        <p>곡이 없습니다</p>
        <p className="mt-1 text-xs">곡 관리에서 추가하세요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {songs.map((song) => {
        const isActive = song.id === currentSongId;
        const totalLines = song.sections.reduce(
          (acc, s) => acc + s.lines.length,
          0
        );
        return (
          <button
            key={song.id}
            onClick={() => onSelectSong(song)}
            className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-150 group ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm truncate">{song.title}</span>
              <div className="flex gap-2 text-xs opacity-60">
                <span>{song.sections.length}섹션</span>
                <span>·</span>
                <span>{totalLines}줄</span>
                {song.bpm > 0 && (
                  <>
                    <span>·</span>
                    <span>♩{song.bpm}</span>
                  </>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
