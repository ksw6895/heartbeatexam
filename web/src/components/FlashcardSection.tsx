"use client";

import { useEffect, useMemo, useState } from "react";

import AudioStack from "@/components/AudioStack";
import { getFlashcards } from "@/lib/flashcards";
import { SOUND_CATEGORIES, FlashcardItem, FlashcardMode, SoundCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<SoundCategory, string> = {
  heart: "심음",
  lung: "폐음",
};

const FLASHCARD_MODES: Array<{ value: FlashcardMode; label: string; helper: string }> = [
  {
    value: "name-first",
    label: "명칭 → 소리",
    helper: "명칭을 보고 소리를 들으며 특징을 떠올립니다.",
  },
  {
    value: "audio-first",
    label: "소리 → 명칭",
    helper: "소리만 듣고 명칭과 설명을 맞춰봅니다.",
  },
];

function getPrimaryLabel(
  mode: FlashcardMode,
  card: FlashcardItem,
  index: number,
) {
  if (mode === "name-first") {
    return card.name;
  }
  if (card.problemNumber) {
    return `소리 ${card.problemNumber}`;
  }
  return `소리 #${index + 1}`;
}

export default function FlashcardSection() {
  const [category, setCategory] = useState<SoundCategory>("heart");
  const [mode, setMode] = useState<FlashcardMode>("name-first");
  const [flipped, setFlipped] = useState(false);
  const cards = useMemo(() => getFlashcards(category, mode), [category, mode]);
  const [selectedId, setSelectedId] = useState<string | null>(cards[0]?.id ?? null);

  useEffect(() => {
    setSelectedId(cards[0]?.id ?? null);
    setFlipped(false);
  }, [cards]);

  const current = cards.find((card) => card.id === selectedId) ?? cards[0];
  const currentIndex = current ? cards.findIndex((card) => card.id === current.id) : -1;

  const move = (direction: "prev" | "next") => {
    if (!current) return;
    if (!cards.length) return;
    const nextIndex = (() => {
      if (direction === "prev") {
        return currentIndex <= 0 ? cards.length - 1 : currentIndex - 1;
      }
      return currentIndex >= cards.length - 1 ? 0 : currentIndex + 1;
    })();
    setSelectedId(cards[nextIndex]?.id ?? null);
    setFlipped(false);
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">플래시카드 학습</h1>
        <p className="text-sm text-slate-600">
          사이드바에서 원하는 사운드를 선택해 즉시 학습하고, 카드를 뒤집어 설명을 확인하세요.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-900">분류 선택</h2>
            <div className="flex flex-wrap gap-2">
              {SOUND_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === item
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {CATEGORY_LABELS[item]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-900">학습 모드</h2>
            <div className="flex flex-wrap gap-2">
              {FLASHCARD_MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    mode === item.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="hidden text-[11px] text-slate-500 sm:block">{item.helper}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              {mode === "name-first" ? "심·폐음 명칭 목록" : "사운드 목록"}
            </h2>
            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-2 text-sm">
              {cards.map((card, index) => {
                const primary = getPrimaryLabel(mode, card, index);
                const secondary = mode === "name-first" ? card.problemNumber : card.name;
                const isActive = card.id === current?.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(card.id);
                      setFlipped(false);
                    }}
                    className={`w-full rounded-2xl border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-[13px] font-semibold">{primary}</div>
                    {secondary && (
                      <div className="text-[11px] text-slate-500">{secondary}</div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              총 {cards.length}개의 {CATEGORY_LABELS[category]} 카드
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          {current ? (
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
                {!flipped ? (
                  <div className="flex flex-col gap-4">
                    {mode === "name-first" ? (
                      <>
                        <h3 className="text-xl font-semibold text-slate-900">{current.name}</h3>
                        <p className="text-sm text-slate-600">
                          소리를 듣고 특징을 떠올려 보세요. 설명은 카드를 뒤집어 확인합니다.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-slate-900">소리를 듣고 명칭을 추측해보세요</h3>
                        <p className="text-sm text-slate-600">카드를 뒤집기 전까지 명칭과 설명이 숨겨져 있습니다.</p>
                      </>
                    )}
                    <AudioStack audio={current.audio} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {mode === "audio-first" ? current.name : "설명"}
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {current.description.trim()}
                    </p>
                    {mode === "name-first" && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">소리 복습</h4>
                        <AudioStack audio={current.audio} hideLabels />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move("prev")}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipped((prev) => !prev)}
                    className="rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    카드 뒤집기
                  </button>
                  <button
                    type="button"
                    onClick={() => move("next")}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
                  >
                    다음
                  </button>
                </div>
                <div className="text-sm text-slate-600">
                  {currentIndex + 1} / {cards.length}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">선택한 조건에 해당하는 카드가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
