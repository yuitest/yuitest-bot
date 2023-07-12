import fs from 'fs'

import JSON5 from 'json5'

import { tweet } from '.'

interface Corpus {
  'random-messages': string[]
}

function buildCorpus(): Corpus {
  const rawContent = fs.readFileSync('./data/corpus.json5', 'utf-8')
  const corpus = JSON5.parse(rawContent) as Corpus
  return corpus
}

function pickRandom<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function randomTweet() {
  const corpus = buildCorpus()
  const text = pickRandom(corpus['random-messages'])
  tweet(text)
}

if (require.main === module) {
  randomTweet()
}
