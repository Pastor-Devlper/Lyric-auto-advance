"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  speedMultiplier: number;
  bpm: number;
  currentLine: number;
  totalLines: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevLine: () => void;
  onNextLine: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlayerControls({
  isPlaying,
  speedMultiplier,
  bpm,
  currentLine,
  totalLines,
  onPlay,
  onPause,
  onPrevLine,
  onNextLine,
  onRestart,
  onSpeedChange,
}: PlayerControlsProps) {
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex flex-col gap-3">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{
              width:
                totalLines > 0
                  ? `${((currentLine + 1) / totalLines) * 100}%`
                  : "0%",
            }}
          />
        </div>
        <span className="text-gray-400 text-xs tabular-nums min-w-[3rem] text-right">
          {currentLine + 1} / {totalLines}
        </span>
      </div>

      {/* Main controls row */}
      <div className="flex items-center justify-between gap-2">
        {/* Playback buttons */}
        <div className="flex items-center gap-1">
          {/* Restart */}
          <button
            onClick={onRestart}
            title="처음부터"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          {/* Prev line */}
          <button
            onClick={onPrevLine}
            title="이전 줄"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" transform="rotate(180 12 12)" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            title={isPlaying ? "일시정지" : "재생"}
            className={`p-2.5 rounded-xl transition-colors font-medium ${
              isPlaying
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next line */}
          <button
            onClick={onNextLine}
            title="다음 줄"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zm7.5 6h2V6h-2v12z" />
            </svg>
          </button>
        </div>

        {/* BPM display */}
        {bpm > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-blue-400 text-sm font-bold">{bpm}</span>
            <span className="text-gray-500 text-xs">BPM</span>
          </div>
        )}

        {/* Speed control */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">속도</span>
            <span className="text-white text-xs font-medium w-8 text-center">
              {speedMultiplier}x
            </span>
          </div>
          <div className="flex gap-0.5">
            {speedOptions.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                  speedMultiplier === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
