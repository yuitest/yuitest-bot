import { buildWeeklyMessage } from './weeklyHabit'

describe('buildMessage', () => {
  it('should return a message', () => {
    const summary = {
      completedTasks: 4,
      allOfTasks: 10,
      failedTasks: 3,
      skippedTasks: 1,
      inProgressTasks: 2,
    }
    const targetDate = '2023-01-01'
    const targetTime = '00:00:00'
    const expected = `#ゆいてすと日課 今日 (2023-01-01 00:00:00) の週単位のタスクの達成状況
(完了 / 全タスク) = (4 / 10) = 40.0%
失敗: 3 件
スキップ: 1 件`
    const actual = buildWeeklyMessage(summary, targetDate, targetTime)
    expect(actual).toEqual(expected)
  })
})
