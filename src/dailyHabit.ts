import { DateTime } from 'luxon'

import { getAnalysis } from './myhabit'
import { tweet } from './twitter'

export async function buildDailyMessage(): Promise<string> {
  const analysis = await getAnalysis()
  const target = analysis.daily
  const ratio = (target.completed / target.total) * 100
  const targetDate = DateTime.fromJSDate(analysis.currentTime).toLocal()
  let message = `#ゆいてすと日課 (${targetDate.toISO()}) の日課の達成状況
(完了 / 全タスク) = (${target.completed} / ${target.total}) = ${ratio.toFixed(
    1
  )}%`

  if (ratio >= 100) {
    message += '\n素晴らしいです ! ぜんぶ完了です。ぜんぶぜんぶぜんぶ !'
  }
  return message
}

if (require.main === module) {
  ;(async () => {
    const message = await buildDailyMessage()
    tweet(message)
  })()
}
