import { getSounds } from "./sounds";
import { FlashcardItem, FlashcardMode, SoundCategory } from "./types";

export function getFlashcards(category: SoundCategory, mode: FlashcardMode): FlashcardItem[] {
  return getSounds(category).map((sound) => ({
    id: `${sound.id}-${mode}`,
    category,
    mode,
    name: sound.name,
    description: sound.description,
    audio: sound.audio,
  }));
}
