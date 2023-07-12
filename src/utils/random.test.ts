import { describe, it, expect } from '@jest/globals'

import { pickRandom } from './random'

describe('pickRandom', () => {
  it('should return a random element from an array', () => {
    const array = ['a', 'b', 'c'] as const
    const element = pickRandom(array)
    expect(array).toContain(element)

    const array2 = [1, 2, 3] as const
    const element2 = pickRandom(array2)
    expect(array2).toContain(element2)

    const counter = {
      a: 0,
      b: 0,
      c: 0,
    }
    for (let i = 0; i < 1000; i++) {
      const element = pickRandom(array)
      counter[element] += 1
    }
    expect(counter.a).toBeGreaterThan(0)
    expect(counter.a).toBeLessThan(500)
    expect(counter.b).toBeGreaterThan(0)
    expect(counter.b).toBeLessThan(500)
    expect(counter.c).toBeGreaterThan(0)
    expect(counter.c).toBeLessThan(500)
  })
})
