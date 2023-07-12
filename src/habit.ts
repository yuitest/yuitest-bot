import { getTodaysJournal, summarizeJournal } from './habitify'
import { tweet } from './twitter'

if (require.main === module) {
  ;(async () => {
    const data = await getTodaysJournal(process.env.HABITIFY_API_KEY || '')
    const summary = summarizeJournal(data)
    const ratio = (summary.completedTasks / summary.allOfTasks) * 100
    let message = `#ゆいてすと日課 現在の日課の達成状況
(完了 / 全タスク) = (${summary.completedTasks} / ${
      summary.allOfTasks
    }) = ${ratio.toFixed(1)}%`

    if (summary.failedTasks > 0) {
      message += `\n失敗: ${summary.failedTasks}件`
    }
    if (summary.skippedTasks > 0) {
      message += `\nスキップ: ${summary.skippedTasks}件`
    }
    tweet(message)
  })()
}
