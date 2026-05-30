import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8 px-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Auto Scroller
        </h1>
        <p className="mt-2 text-gray-400 text-base">
          교회 예배 찬양 가사 자동 스크롤러
        </p>
      </div>

      {/* Main action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link
          href="/display"
          className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-10 bg-black border-2 border-gray-700 rounded-2xl hover:border-white transition-all duration-200 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
            📺
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">송출 화면</div>
            <div className="text-sm text-gray-500 mt-1">프로젝터 전체화면</div>
          </div>
          <div className="text-xs text-gray-600 font-mono">/display</div>
        </Link>

        <Link
          href="/control"
          className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-10 bg-blue-950 border-2 border-blue-700 rounded-2xl hover:border-blue-400 transition-all duration-200 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
            🎛️
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">컨트롤러</div>
            <div className="text-sm text-blue-300 mt-1">가사 제어 패널</div>
          </div>
          <div className="text-xs text-blue-600 font-mono">/control</div>
        </Link>
      </div>

      {/* Song manager link */}
      <Link
        href="/songs"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-150 text-sm font-medium"
      >
        <span>🎵</span>
        <span>곡 관리</span>
        <span className="text-gray-500 font-mono text-xs">/songs</span>
      </Link>

      {/* Instructions */}
      <div className="max-w-md text-center text-gray-600 text-sm leading-relaxed">
        <p>
          <span className="text-gray-400 font-medium">송출 화면</span>을 프로젝터에,{" "}
          <span className="text-gray-400 font-medium">컨트롤러</span>를 인도자 기기에서 여세요.
          같은 브라우저 또는 동일 기기에서 localStorage로 동기화됩니다.
        </p>
      </div>
    </div>
  );
}
