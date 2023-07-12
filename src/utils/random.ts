export function pickRandom<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
