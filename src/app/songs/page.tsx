"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getAllSongs, saveSong, deleteSong, generateId, resetToSamples } from "@/lib/songs";
import { Song } from "@/lib/types";

type ViewMode = "list" | "add-json" | "add-form" | "import-url";

const EMPTY_FORM: Omit<Song, "id"> = {
  title: "",
  artist: "",
  bpm: 80,
  sections: [
    {
      name: "1절",
      lines: [
        { text: "", duration: 4 },
      ],
    },
  ],
};

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formArtist, setFormArtist] = useState("");
  const [formBpm, setFormBpm] = useState(80);
  const [formSections, setFormSections] = useState(EMPTY_FORM.sections);

  const successTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    if (successTimeout.current) clearTimeout(successTimeout.current);
    successTimeout.current = setTimeout(() => setSuccessMsg(""), 3000);
  };

  const loadSongs = () => {
    setSongs(getAllSongs());
  };

  useEffect(() => {
    loadSongs();
  }, []);

  // JSON import
  const handleJsonImport = () => {
    setJsonError("");
    try {
      const parsed = JSON.parse(jsonInput);
      const song: Song = {
        ...parsed,
        id: parsed.id || generateId(),
      };
      if (!song.title || !Array.isArray(song.sections)) {
        throw new Error("title과 sections 필드가 필요합니다.");
      }
      saveSong(song);
      loadSongs();
      setJsonInput("");
      setViewMode("list");
      showSuccess(`"${song.title}" 곡을 추가했습니다.`);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "JSON 파싱 오류");
    }
  };

  // URL import
  const handleUrlImport = async () => {
    setUrlError("");
    setUrlLoading(true);
    try {
      const res = await fetch(urlInput);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = JSON.parse(text);

      // Could be array or single song
      const items: Song[] = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach((item) => {
        saveSong({ ...item, id: item.id || generateId() });
      });
      loadSongs();
      setUrlInput("");
      setViewMode("list");
      showSuccess(`${items.length}개 곡을 가져왔습니다.`);
    } catch (e) {
      setUrlError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setUrlLoading(false);
    }
  };

  // Form helpers
  const addSection = () => {
    setFormSections((prev) => [
      ...prev,
      { name: "", lines: [{ text: "", duration: 4 }] },
    ]);
  };

  const removeSection = (si: number) => {
    setFormSections((prev) => prev.filter((_, i) => i !== si));
  };

  const updateSectionName = (si: number, name: string) => {
    setFormSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, name } : s))
    );
  };

  const addLine = (si: number) => {
    setFormSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? { ...s, lines: [...s.lines, { text: "", duration: 4 }] }
          : s
      )
    );
  };

  const removeLine = (si: number, li: number) => {
    setFormSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, lines: s.lines.filter((_, j) => j !== li) } : s
      )
    );
  };

  const updateLine = (
    si: number,
    li: number,
    field: "text" | "duration",
    value: string | number
  ) => {
    setFormSections((prev) =>
      prev.map((s, i) =>
        i === si
          ? {
              ...s,
              lines: s.lines.map((l, j) =>
                j === li ? { ...l, [field]: value } : l
              ),
            }
          : s
      )
    );
  };

  const handleFormSubmit = () => {
    if (!formTitle.trim()) {
      alert("곡 제목을 입력하세요.");
      return;
    }
    const song: Song = {
      id: generateId(),
      title: formTitle.trim(),
      artist: formArtist.trim(),
      bpm: formBpm,
      sections: formSections.filter(
        (s) => s.name.trim() && s.lines.some((l) => l.text.trim())
      ),
    };
    if (song.sections.length === 0) {
      alert("최소 하나의 섹션과 가사 줄이 필요합니다.");
      return;
    }
    saveSong(song);
    loadSongs();
    // reset form
    setFormTitle("");
    setFormArtist("");
    setFormBpm(80);
    setFormSections(EMPTY_FORM.sections);
    setViewMode("list");
    showSuccess(`"${song.title}" 곡을 추가했습니다.`);
  };

  const handleDelete = (id: string) => {
    deleteSong(id);
    loadSongs();
    setDeleteConfirm(null);
    showSuccess("곡을 삭제했습니다.");
  };

  const handleResetSamples = () => {
    if (confirm("샘플 곡으로 초기화하시겠습니까? 기존 곡이 모두 삭제됩니다.")) {
      resetToSamples();
      loadSongs();
      showSuccess("샘플 곡으로 초기화했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            ← 홈
          </Link>
          <span className="text-gray-700">|</span>
          <h1 className="text-white font-semibold">곡 관리</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/control"
            className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs transition-colors"
          >
            컨트롤러
          </Link>
        </div>
      </header>

      {/* Success banner */}
      {successMsg && (
        <div className="mx-6 mt-4 px-4 py-2 bg-green-900/60 border border-green-700 rounded-lg text-green-300 text-sm">
          {successMsg}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setViewMode(viewMode === "add-json" ? "list" : "add-json")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "add-json"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            + JSON으로 추가
          </button>
          <button
            onClick={() => setViewMode(viewMode === "add-form" ? "list" : "add-form")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "add-form"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            + 직접 입력
          </button>
          <button
            onClick={() => setViewMode(viewMode === "import-url" ? "list" : "import-url")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "import-url"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            URL에서 가져오기
          </button>
          <div className="flex-1" />
          <button
            onClick={handleResetSamples}
            className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors"
          >
            샘플 초기화
          </button>
        </div>

        {/* JSON add panel */}
        {viewMode === "add-json" && (
          <div className="mb-6 bg-gray-900 rounded-xl border border-gray-700 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              JSON 붙여넣기
            </h2>
            <textarea
              className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono resize-y focus:outline-none focus:border-blue-500"
              placeholder={'{\n  "title": "곡 제목",\n  "bpm": 80,\n  "sections": [\n    {\n      "name": "1절",\n      "lines": [\n        { "text": "가사 내용", "duration": 4 }\n      ]\n    }\n  ]\n}'}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError("");
              }}
            />
            {jsonError && (
              <p className="mt-2 text-red-400 text-xs">{jsonError}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleJsonImport}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setViewMode("list");
                  setJsonInput("");
                  setJsonError("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* URL import panel */}
        {viewMode === "import-url" && (
          <div className="mb-6 bg-gray-900 rounded-xl border border-gray-700 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">
              URL에서 JSON 가져오기
            </h2>
            <input
              type="url"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/songs.json"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError("");
              }}
            />
            {urlError && (
              <p className="mt-2 text-red-400 text-xs">{urlError}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUrlImport}
                disabled={urlLoading || !urlInput.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {urlLoading ? "불러오는 중..." : "가져오기"}
              </button>
              <button
                onClick={() => {
                  setViewMode("list");
                  setUrlInput("");
                  setUrlError("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Form add panel */}
        {viewMode === "add-form" && (
          <div className="mb-6 bg-gray-900 rounded-xl border border-gray-700 p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">
              새 곡 직접 입력
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">곡 제목 *</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="예: 주님의 사랑"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">아티스트</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  placeholder="선택사항"
                  value={formArtist}
                  onChange={(e) => setFormArtist(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">BPM</label>
                <input
                  type="number"
                  min={40}
                  max={200}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                  value={formBpm}
                  onChange={(e) => setFormBpm(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {formSections.map((section, si) => (
                <div
                  key={si}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="섹션 이름 (예: 1절, 코러스)"
                      value={section.name}
                      onChange={(e) => updateSectionName(si, e.target.value)}
                    />
                    {formSections.length > 1 && (
                      <button
                        onClick={() => removeSection(si)}
                        className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
                      >
                        섹션 삭제
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {section.lines.map((line, li) => (
                      <div key={li} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                          placeholder="가사 내용"
                          value={line.text}
                          onChange={(e) =>
                            updateLine(si, li, "text", e.target.value)
                          }
                        />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm text-gray-200 text-center focus:outline-none focus:border-blue-500"
                          title="지속시간(초)"
                          value={line.duration}
                          onChange={(e) =>
                            updateLine(si, li, "duration", Number(e.target.value))
                          }
                        />
                        <span className="text-gray-600 text-xs">초</span>
                        {section.lines.length > 1 && (
                          <button
                            onClick={() => removeLine(si, li)}
                            className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addLine(si)}
                    className="mt-2 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    + 줄 추가
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addSection}
              className="mt-3 text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              + 섹션 추가
            </button>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setViewMode("list");
                  setFormTitle("");
                  setFormArtist("");
                  setFormBpm(80);
                  setFormSections(EMPTY_FORM.sections);
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Song list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-400">
              전체 {songs.length}곡
            </h2>
          </div>

          {songs.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              <p className="text-4xl mb-3">🎵</p>
              <p>곡이 없습니다</p>
              <p className="text-sm mt-1">위에서 곡을 추가하거나 샘플을 초기화하세요</p>
            </div>
          ) : (
            songs.map((song) => {
              const totalLines = song.sections.reduce(
                (acc, s) => acc + s.lines.length,
                0
              );
              return (
                <div
                  key={song.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-start justify-between gap-4 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{song.title}</h3>
                    {song.artist && (
                      <p className="text-gray-500 text-xs mt-0.5">{song.artist}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {song.sections.map((section, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-xs"
                        >
                          {section.name} ({section.lines.length}줄)
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-gray-600">
                      {song.bpm > 0 && <span>♩ {song.bpm} BPM</span>}
                      <span>{song.sections.length}섹션</span>
                      <span>{totalLines}줄 전체</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {deleteConfirm === song.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs transition-colors"
                        >
                          삭제 확인
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(song.id)}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-red-900 text-gray-500 hover:text-red-400 text-xs transition-colors opacity-0 group-hover:opacity-100"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
