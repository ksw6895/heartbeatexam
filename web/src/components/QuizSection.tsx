"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AudioStack from "@/components/AudioStack";
import { generateQuizQuestions } from "@/lib/quiz";
import { shuffle } from "@/lib/random";
import { SOUND_CATEGORIES, QuizMode, QuizQuestion, SoundCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<SoundCategory, string> = {
  heart: "심음",
  lung: "폐음",
};

const QUIZ_MODES: Array<{ value: QuizMode; label: string; helper: string }> = [
  {
    value: "name-to-audio",
    label: "명칭 → 소리 선택",
    helper: "명칭을 보고 네 개의 소리 중 정답을 고릅니다.",
  },
  {
    value: "audio-to-name",
    label: "소리 → 명칭 선택",
    helper: "소리를 듣고 올바른 명칭을 고릅니다.",
  },
];

interface ScoreBoard {
  correct: number;
  answered: number;
}

function OptionButton({
  question,
  option,
  index,
  isSelected,
  disabled,
  onSelect,
}: {
  question: QuizQuestion;
  option: QuizQuestion["options"][number];
  index: number;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const isCorrect = option.id === question.answerId;
  const showName = question.mode === "audio-to-name";
  const label = showName ? option.name : `보기 ${index + 1}`;
  const baseClasses = "flex flex-col gap-2 rounded-2xl border p-4 text-left transition-colors";
  const stateClass = !disabled
    ? "border-slate-200 hover:border-blue-400"
    : isSelected
      ? isCorrect
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50"
      : isCorrect
        ? "border-green-500"
        : "border-slate-200";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`${baseClasses} ${stateClass}`}
    >
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      {question.mode === "name-to-audio" && <AudioStack audio={option.audio} hideLabels />}
    </button>
  );
}

export default function QuizSection() {
  const [category, setCategory] = useState<SoundCategory>("heart");
  const [mode, setMode] = useState<QuizMode>("name-to-audio");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreBoard>({ correct: 0, answered: 0 });
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const completedAll = score.answered === totalQuestions && totalQuestions > 0;

  const scoreRate = useMemo(() => {
    if (!score.answered) return 0;
    return Math.round((score.correct / score.answered) * 100);
  }, [score]);

  const regenerate = useCallback(() => {
    try {
      const generated = generateQuizQuestions(category, mode);
      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedId(null);
      setScore({ correct: 0, answered: 0 });
      setError(null);
    } catch (err) {
      setQuestions([]);
      setCurrentIndex(0);
      setSelectedId(null);
      setScore({ correct: 0, answered: 0 });
      setError(err instanceof Error ? err.message : "문제를 생성하지 못했습니다.");
    }
  }, [category, mode]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const handleSelect = (optionId: string) => {
    if (!currentQuestion || selectedId) return;
    const isCorrect = optionId === currentQuestion.answerId;
    setSelectedId(optionId);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      answered: prev.answered + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedId(null);
    }
  };

  const handleShuffleAll = () => {
    if (!questions.length) return;
    setQuestions((prev) => {
      const shuffled = shuffle(prev);
      return shuffled.map((question, idx) => ({ ...question, id: `${question.id}__shuffled-${idx}` }));
    });
    setCurrentIndex(0);
    setSelectedId(null);
    setScore({ correct: 0, answered: 0 });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">4지선다 퀴즈</h1>
        <p className="text-sm text-slate-600">
          분류와 유형을 선택하면 JSON 데이터에 포함된 모든 항목으로 문제가 생성됩니다. 해설은 보기를 고르는 즉시
          확인할 수 있습니다.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {SOUND_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  category === item
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {CATEGORY_LABELS[item]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {QUIZ_MODES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={`rounded-full border px-4 py-2 text-xs sm:text-sm transition-colors ${
                  mode === item.value
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <div className="font-medium">{item.label}</div>
                <div className="hidden text-[11px] text-slate-500 sm:block">{item.helper}</div>
              </button>
            ))}
          </div>

          <div className="grid gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <div className="text-sm text-slate-600">
              정답 {score.correct} / {score.answered}
              {score.answered > 0 && <span className="ml-2">({scoreRate}%)</span>}
              <span className="ml-2 text-slate-500">총 {totalQuestions}문제</span>
            </div>
            <button
              type="button"
              onClick={handleShuffleAll}
              disabled={!questions.length}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                questions.length
                  ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-500"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              전체 셔플
            </button>
            <button
              type="button"
              onClick={regenerate}
              className="rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              새 문제 생성
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      {currentQuestion ? (
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
            <div className="text-sm font-medium text-slate-500">
              문제 {currentIndex + 1} / {totalQuestions}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{currentQuestion.prompt}</h2>
            {currentQuestion.mode === "audio-to-name" && currentQuestion.promptAudio && (
              <div className="mt-4">
                <AudioStack audio={currentQuestion.promptAudio} />
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, idx) => (
                <OptionButton
                  key={option.id}
                  question={currentQuestion}
                  option={option}
                  index={idx}
                  disabled={Boolean(selectedId)}
                  isSelected={selectedId === option.id}
                  onSelect={() => handleSelect(option.id)}
                />
              ))}
            </div>

            {selectedId && (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
                <div className="font-semibold text-blue-700">해설</div>
                <p className="mt-2 whitespace-pre-wrap">{currentQuestion.explanation.trim()}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedId || currentIndex >= totalQuestions - 1}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                currentIndex >= totalQuestions - 1
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              다음 문제
            </button>
            {completedAll && (
              <div className="rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                모든 문제를 완료했습니다!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600">
          문제를 불러오는 중이거나 생성할 수 없습니다.
        </div>
      )}
    </section>
  );
}
