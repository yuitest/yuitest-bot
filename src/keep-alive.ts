import { buildCorpus, Corpus } from './corpus'

import { tweet } from './twitter'

function keepAliveTweet(corpus: Corpus) {
  const text = corpus['keep-alive-message']
  tweet(text)
}

if (require.main === module) {
  const corpus = buildCorpus()
  keepAliveTweet(corpus)
}
