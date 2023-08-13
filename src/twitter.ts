import { TwitterApi } from 'twitter-api-v2'

function getClientFromEnv() {
  const tempClient = new TwitterApi({
    appKey: process.env.CONSUMER_KEY || '',
    appSecret: process.env.CONSUMER_SECRET || '',
    accessToken: process.env.ACCESS_TOKEN_KEY || '',
    accessSecret: process.env.ACCESS_TOKEN_SECRET || '',
  })
  return tempClient
}

export async function tweet(text: string): Promise<void> {
  const client = getClientFromEnv()
  const isProduction = process.env.NODE_ENV === 'production'
  if (!isProduction) {
    console.log(`ツイート内容:\n${text}`)
    return
  }
  await client.v2.tweet(text)
}
