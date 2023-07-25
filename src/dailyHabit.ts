import { DateTime } from 'luxon'

import { Client, summarizeDailyJournal, Summary } from './habitify'
import { tweet } from './twitter'

export function buildDailyMessage(
  summary: Summary,
  targetDate: string,
  targetTime: string
): string {
  const ratio = (summary.completedTasks / summary.allOfTasks) * 100
  let message = `#ゆいてすと日課 現在 (${targetDate} ${targetTime}) の日課の達成状況
(完了 / 全タスク) = (${summary.completedTasks} / ${
    summary.allOfTasks
  }) = ${ratio.toFixed(1)}%`

  if (summary.failedTasks > 0) {
    message += `\n失敗: ${summary.failedTasks} 件`
  }
  if (summary.skippedTasks > 0) {
    message += `\nスキップ: ${summary.skippedTasks} 件`
  }
  if (ratio >= 100) {
    message += '\n素晴らしいです ! ぜんぶ完了です。ぜんぶぜんぶぜんぶ !'
  }
  return message
}

if (require.main === module) {
  ;(async () => {
    const client = Client.getClientFromEnv()
    const baseDate = DateTime.now().setZone('Asia/Tokyo')
    const targetDate = baseDate.toFormat('yyyy-MM-dd')
    const targetTime = baseDate.toFormat('HH:mm:ss')
    const timeLimit = '23:59:59'
    const queryDate = `${targetDate}T${timeLimit}+09:00`
    const data = await client.fetchJournal(queryDate)
    const summary = summarizeDailyJournal(data)
    const message = buildDailyMessage(summary, targetDate, targetTime)
    tweet(message)
  })()
}
