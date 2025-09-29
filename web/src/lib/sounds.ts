import rawData from "@/data/processedSounds.json";
import { SOUND_CATEGORIES, SoundCategory, SoundItem } from "./types";

type RawDataset = Record<SoundCategory, SoundItem[]>;

const dataset = rawData as RawDataset;

const soundsByCategory: Record<SoundCategory, SoundItem[]> = Object.fromEntries(
  SOUND_CATEGORIES.map((category) => [category, dataset[category].map((item) => ({ ...item }))]),
) as Record<SoundCategory, SoundItem[]>;

const soundIndex = new Map<string, { category: SoundCategory; sound: SoundItem }>();

for (const category of SOUND_CATEGORIES) {
  for (const sound of soundsByCategory[category]) {
    soundIndex.set(`${category}:${sound.id}`, { category, sound });
  }
}

export function getSounds(category: SoundCategory): SoundItem[] {
  return soundsByCategory[category];
}

export function getSound(category: SoundCategory, id: string): SoundItem | undefined {
  return soundsByCategory[category].find((sound) => sound.id === id);
}

export function getAllSounds(): Array<{ category: SoundCategory; sound: SoundItem }> {
  return Array.from(soundIndex.values());
}
