export const SOUND_CATEGORIES = ["heart", "lung"] as const;
export type SoundCategory = (typeof SOUND_CATEGORIES)[number];

export interface SoundItem {
  id: string;
  problemNumber: string;
  name: string;
  description: string;
  audio: string[];
}

export type FlashcardMode = "name-first" | "audio-first";

export interface FlashcardItem {
  id: string;
  category: SoundCategory;
  mode: FlashcardMode;
  problemNumber: string;
  name: string;
  description: string;
  audio: string[];
}
export type QuizMode = "name-to-audio" | "audio-to-name";

export interface QuizOption {
  id: string;
  name: string;
  audio: string[];
}

export interface QuizQuestion {
  id: string;
  category: SoundCategory;
  prompt: string;
  mode: QuizMode;
  answerId: string;
  options: QuizOption[];
  explanation: string;
  promptAudio?: string[];
}
