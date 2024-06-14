import { type Corpus, buildCorpus } from './corpus'
import { tweet } from './twitter'

async function keepAliveTweet(corpus: Corpus) {
  const text = corpus['keep-alive-message']
  await tweet(text)
}

if (require.main === module) {
  ;(async () => {
    const corpus = buildCorpus()
    await keepAliveTweet(corpus)
  })()
}
