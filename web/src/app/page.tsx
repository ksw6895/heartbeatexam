import Link from "next/link";

const FEATURES = [
  {
    title: "플래시카드 모드",
    description: "명칭↔소리 두 가지 방향의 카드와 사이드바 목록으로 원하는 사운드를 빠르게 학습하세요.",
    href: "/flashcards",
  },
  {
    title: "4지선다 퀴즈",
    description: "심음·폐음 모든 항목을 기반으로 문제를 생성하고, 즉시 정답과 해설을 확인할 수 있습니다.",
    href: "/quiz",
  },
];

export default function HomePage() {
  return (
    <section className="flex flex-col gap-10">
      <div className="rounded-3xl bg-white/90 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-900">심음 · 폐음 학습 도구</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          제공된 녹음 자료를 활용해 플래시카드와 4지선다 퀴즈를 빠르게 생성하는 웹 애플리케이션입니다. 학습
          목표에 맞는 모드를 선택해 반복 학습과 복습을 효율적으로 진행하세요.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">{feature.title}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            <span className="mt-auto text-sm font-semibold text-blue-600 group-hover:text-blue-500">
              바로 이동하기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
