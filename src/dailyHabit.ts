import { DateTime } from 'luxon'

import { getAnalysis } from './myhabit'
import { tweet } from './twitter'

export async function buildDailyMessage(): Promise<string> {
  const analysis = await getAnalysis()
  const targetDate = DateTime.fromISO(analysis.currentDate).setZone(
    'Asia/Tokyo'
  )

  const dailyCompleted = analysis.summary.daily.completed
  const dailyTotal = analysis.summary.daily.total
  let dailyRatio = (dailyCompleted / dailyTotal) * 100
  if (dailyCompleted === dailyTotal) {
    dailyRatio = 100
  } else {
    dailyRatio = Math.round(dailyRatio)
  }
  const freshness = analysis.summary.all.freshness / analysis.summary.all.total
  const freshnessPercentage = Math.round(freshness * 100)
  const allCompleted = analysis.summary.all.completed
  const allTotal = analysis.summary.all.total
  const allRatio = Math.round((allCompleted / allTotal) * 100)

  const freshnessText =
    freshness > 0 ? `${freshnessPercentage}%` : `${freshnessPercentage}%`
  let message = `#ゆいてすと日課 (${targetDate.toISO()}) の達成状況 (v2025.4.28)
(完了) / (総数)
Daily: ${dailyCompleted} / ${dailyTotal} = ${dailyRatio}%
All: ${allCompleted} / ${allTotal} = ${allRatio}%
鮮度: ${freshnessText}
`

  if (dailyRatio >= 100) {
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
