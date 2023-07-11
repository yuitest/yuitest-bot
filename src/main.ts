import fs from 'fs'

import Twitter from 'twitter'

function getClientFromEnv() {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY || '',
    consumer_secret: process.env.CONSUMER_SECRET || '',
    access_token_key: process.env.ACCESS_TOKEN_KEY || '',
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || '',
  })
}

function buildCorpus(): string[] {
  const text = fs.readFileSync('./corpus.txt', 'utf-8')
  const lines = text.split('\n')
  return lines.map((line) => line.replace('\\r\\n', '\r\n'))
}

function tweet(text: string) {
  const client = getClientFromEnv()
  client.post(
    'statuses/update',
    { status: text },
    (error, _tweet, _response) => {
      if (error) throw error
    }
  )
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
