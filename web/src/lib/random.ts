export function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function sample<T>(items: T[], count: number): T[] {
  if (count >= items.length) {
    return shuffle(items);
  }
  const shuffled = shuffle(items);
  return shuffled.slice(0, count);
}
