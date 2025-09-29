# 심음·폐음 학습 도구

심음(`heart`)과 폐음(`lung`) 음원을 이용해 플래시카드와 4지선다 퀴즈를 학습할 수 있는 Next.js 웹 애플리케이션입니다. 모든 설명은 `files.json` 자료에 담긴 메모를 기반으로 하며, 각 사운드는 `public/audio/heart`, `public/audio/lung`에 연결되어 있습니다.

## 핵심 기능

- **플래시카드**: 명칭→소리, 소리→명칭 두 방향 모두 지원. 설명은 카드를 뒤집어 확인합니다.
- **4지선다 퀴즈**: 분류(심음/폐음)와 문제 유형(명칭→소리, 소리→명칭)을 선택하면 10개의 문제가 즉시 생성됩니다.
- **자동 데이터 매핑**: `scripts/buildDataset.mjs`가 원본 `files.json`과 음원 파일명을 매칭해 `src/data/processedSounds.json`을 생성합니다.

## 폴더 구조 하이라이트

```
web/
├─ public/
│  └─ audio/
│     ├─ heart/  # 심음 음원
│     └─ lung/   # 폐음 음원
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  └─ page.tsx          # 메인 UI (플래시카드 + 퀴즈)
│  ├─ components/
│  │  ├─ AudioStack.tsx
│  │  ├─ FlashcardSection.tsx
│  │  └─ QuizSection.tsx
│  ├─ data/
│  │  ├─ processedSounds.json
│  │  └─ sounds.json        # 원본 자료 복사본
│  └─ lib/
│     ├─ flashcards.ts
│     ├─ quiz.ts
│     ├─ random.ts
│     └─ types.ts
└─ scripts/
   └─ buildDataset.mjs
```

## 설치 및 개발 서버 실행

```bash
cd web
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 앱을 확인할 수 있습니다.

## 데이터 재생성

음원 파일이나 `files.json`이 변경되었을 경우 다음 명령으로 매핑 데이터를 다시 생성하세요.

```bash
npm run generate:dataset
```

생성 결과는 `src/data/processedSounds.json`에 저장됩니다.

## 품질 확인

```bash
npm run lint   # ESLint 검사
npm run build  # 프로덕션 빌드(Next.js)
```

## 배포 권장: Vercel

Next.js App Router 기반 프로젝트이므로 **Vercel**에 배포하는 것이 가장 간단하고 빠릅니다. Vercel은 Next.js 공식 배포 플랫폼으로, 사운드 파일과 정적 자산을 자동으로 최적화합니다.

### GitHub 연동 배포 절차

1. 이 프로젝트를 Git 저장소로 초기화하고 GitHub에 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인 후 **Add New → Project**를 선택합니다.
3. GitHub 리포지터리를 연결하고, 루트 디렉터리를 `web`으로 지정합니다.
4. Build Command는 `npm run build`, Output Directory는 기본값(`.vercel/output` 자동 처리)으로 두면 됩니다.
5. 배포가 완료되면 제공된 URL에서 웹 앱을 바로 확인할 수 있습니다.

> Render의 경우 정적 파일 서빙과 Next.js App Router(Edge/Server Functions) 설정을 별도로 해주어야 하므로, 빠른 배포와 유지보수를 위해 Vercel 사용을 권장합니다.

## 유지 보수 팁

- 새로운 음원을 추가할 때는 `public/audio/<category>/`에 파일을 넣고 JSON 데이터에 명칭과 설명을 추가한 뒤 `npm run generate:dataset`을 실행하세요.
- 퀴즈와 플래시카드는 모든 사운드가 1:1로 매칭되어 있을 때 가장 잘 작동합니다. 매핑되지 않은 항목이 있으면 스크립트가 경고를 출력합니다.
- Tailwind CSS 4를 사용하므로 스타일은 유틸리티 클래스로 빠르게 조정할 수 있습니다.
