import { describe, it, expect } from '@jest/globals'

import { buildCorpus } from './corpus'

describe('buildCorpus', () => {
  it('returns a corpus', () => {
    const corpus = buildCorpus()
    expect(corpus).toHaveProperty('random-messages')
  })

  it('すべてのメッセージは 140 文字以下である', () => {
    const corpus = buildCorpus()
    for (const message of corpus['random-messages']) {
      console.log(message)
      expect(message.replace('\r\n', '\n').length).toBeLessThanOrEqual(140)
    }
  })
})
