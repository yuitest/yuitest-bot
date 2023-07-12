import Twitter from 'twitter'

export function getClientFromEnv() {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY || '',
    consumer_secret: process.env.CONSUMER_SECRET || '',
    access_token_key: process.env.ACCESS_TOKEN_KEY || '',
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || '',
  })
}

export async function tweet(text: string): Promise<void> {
  const client = getClientFromEnv()
  return new Promise((resolve, reject) => {
    client.post(
      'statuses/update',
      { status: text },
      (error, _tweet, _response) => {
        if (error) reject(error)
        resolve()
      }
    )
  })
}
