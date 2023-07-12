import fs from 'fs'

import JSON5 from 'json5'

export interface Corpus {
  'random-messages': string[]
}

export function buildCorpus(): Corpus {
  const rawContent = fs.readFileSync('./data/corpus.json5', 'utf-8')
  const corpus = JSON5.parse(rawContent) as Corpus
  return corpus
}
