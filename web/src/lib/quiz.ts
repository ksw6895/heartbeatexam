import { getSounds } from "./sounds";
import { shuffle } from "./random";
import { QuizMode, QuizQuestion, SoundCategory, SoundItem } from "./types";

const DEFAULT_QUESTION_COUNT = 10;
const OPTION_COUNT = 4;

function pickDistractors(pool: SoundItem[], correctId: string, count: number): SoundItem[] {
  const candidates = pool.filter((item) => item.id !== correctId);
  if (candidates.length < count) {
    throw new Error("Not enough unique sounds to build options");
  }
  return shuffle(candidates).slice(0, count);
}

function buildQuestion(
  category: SoundCategory,
  mode: QuizMode,
  index: number,
  correct: SoundItem,
  pool: SoundItem[],
): QuizQuestion {
  const distractors = pickDistractors(pool, correct.id, OPTION_COUNT - 1);
  const options = shuffle([...distractors, correct]).map((sound) => ({
    id: sound.id,
    name: sound.name,
    audio: sound.audio,
  }));

  const base: QuizQuestion = {
    id: `${mode}-${category}-${index}-${correct.id}`,
    category,
    mode,
    prompt: "",
    answerId: correct.id,
    options,
    explanation: correct.description,
  };

  if (mode === "name-to-audio") {
    base.prompt = `"${correct.name}" 음에 해당하는 소리를 고르세요.`;
  } else {
    base.prompt = "소리를 듣고 해당하는 명칭을 고르세요.";
    base.promptAudio = correct.audio;
  }

  return base;
}

export function generateQuizQuestions(
  category: SoundCategory,
  mode: QuizMode,
  count: number = DEFAULT_QUESTION_COUNT,
): QuizQuestion[] {
  const sounds = getSounds(category);
  if (sounds.length < OPTION_COUNT) {
    throw new Error("해당 분류에 대한 사운드 데이터가 충분하지 않습니다.");
  }

  const order = shuffle(sounds);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i += 1) {
    const correct = order[i % order.length];
    questions.push(buildQuestion(category, mode, i, correct, sounds));
  }

  return questions;
}
