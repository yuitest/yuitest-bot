import { buildCorpus, Corpus } from './corpus'
import { pickRandom } from './utils/random'

import { tweet } from './twitter'

function randomTweet(corpus: Corpus) {
  const text = pickRandom(corpus['random-messages'])
  tweet(text)
}

if (require.main === module) {
  const corpus = buildCorpus()
  randomTweet(corpus)
}
