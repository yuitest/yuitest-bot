import { buildCorpus, type Corpus } from './corpus'
import { tweet } from './twitter'
import { pickRandom } from './utils/random'

async function randomTweet(corpus: Corpus) {
  const text = pickRandom(corpus['random-messages'])
  await tweet(text)
}

if (require.main === module) {
  ;(async () => {
    const corpus = buildCorpus()
    await randomTweet(corpus)
  })()
}
