"use client";

interface LyricDisplayProps {
  currentText: string;
  nextText: string | null;
  sectionName: string;
  songTitle: string;
  isPlaying: boolean;
}

export default function LyricDisplay({
  currentText,
  nextText,
  sectionName,
  songTitle,
  isPlaying,
}: LyricDisplayProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black select-none overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-8 pt-6 z-10">
        <span className="text-gray-500 text-xl font-medium tracking-widest uppercase">
          {sectionName}
        </span>
        <span className="text-gray-600 text-lg font-light tracking-wide text-right max-w-xs truncate">
          {songTitle}
        </span>
      </div>

      {/* Lyric content */}
      <div className="flex flex-col items-center justify-center w-full px-12 gap-8">
        {/* Current line */}
        <div
          className={`text-center transition-opacity duration-300 ${
            currentText ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className="text-white font-bold leading-tight text-center"
            style={{ fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: "1.15" }}
          >
            {currentText || " "}
          </p>
        </div>

        {/* Next line */}
        {nextText && (
          <div className="text-center opacity-40">
            <p
              className="text-gray-300 font-normal leading-tight text-center"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 4rem)", lineHeight: "1.2" }}
            >
              {nextText}
            </p>
          </div>
        )}
      </div>

      {/* Playing indicator */}
      {!isPlaying && currentText && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-gray-700 text-sm tracking-widest uppercase">
            일시정지
          </span>
        </div>
      )}

      {/* Bottom gradient for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
