import { DateTime } from 'luxon'

import { getAnalysis } from './myhabit'
import { tweet } from './twitter'

export async function buildDailyMessage(): Promise<string> {
  const analysis = await getAnalysis()
  const target = analysis.daily
  const ratio = (target.completed / target.total) * 100
  const targetDate = DateTime.fromJSDate(analysis.currentTime).setZone(
    'Asia/Tokyo'
  )
  const freshness = analysis.freshness
  const freshnessPercentage = Math.round(freshness * 100)

  const completedActions = analysis.daily.completed + analysis.others.completed
  const tobeTotal = analysis.daily.total + analysis.others.total
  const overdoingActions = analysis.daily.overdoing + analysis.others.overdoing
  const actionsInDay = analysis.actionsInDay
  const freshnessText =
    freshness > 0 ? `+${freshnessPercentage}%` : `${freshnessPercentage}%`
  let message = `#ゆいてすと日課 (${targetDate.toISO()}) の達成状況
(完了 / 全タスク) = (${target.completed} / ${target.total}) = ${ratio.toFixed(
    1
  )}%
今日の行動数: ${actionsInDay} 回
鮮度: ${freshnessText} (${completedActions} / ${tobeTotal})
`

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
