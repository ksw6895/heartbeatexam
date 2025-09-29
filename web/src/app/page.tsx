import FlashcardSection from "@/components/FlashcardSection";
import QuizSection from "@/components/QuizSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">심음 · 폐음 학습 도구</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              제공된 녹음 자료를 활용해 플래시카드와 4지선다 퀴즈를 빠르게 생성합니다. 명칭과 소리를 모두
              익히며 반복 학습해 보세요.
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <li>• 플래시카드: 명칭→소리, 소리→명칭 두 가지 방향을 지원합니다.</li>
            <li>• 4지선다: 분류와 유형을 고르면 10개의 문제가 즉시 생성됩니다.</li>
            <li>• 모든 해설은 원본 자료의 설명을 그대로 활용합니다.</li>
            <li>• 모든 사운드는 앱 내에서 바로 재생할 수 있도록 연결되어 있습니다.</li>
          </ul>
        </header>

        <FlashcardSection />
        <QuizSection />
      </main>
    </div>
  );
}
