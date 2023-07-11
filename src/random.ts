import fs from 'fs'

import { tweet } from '.'

function buildCorpus(): string[] {
  const text = fs.readFileSync('./corpus.txt', 'utf-8')
  const lines = text.split('\n')
  return lines.map((line) => line.replace('\\r\\n', '\r\n'))
}

function pickRandom<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function randomTweet() {
  const corpus = buildCorpus()
  const text = pickRandom(corpus)
  tweet(text)
}

if (require.main === module) {
  randomTweet()
}
