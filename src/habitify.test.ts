import fs from 'fs'

import { summarizeDailyJournal } from './habitify'

describe('summarizeJournal', () => {
  it('returns a summary', () => {
    const rawContent = fs.readFileSync('./data/example.habits.json', 'utf-8')
    const data = JSON.parse(rawContent)
    const summary = summarizeDailyJournal(data)
    expect(summary).toStrictEqual({
      allOfTasks: 2,
      completedTasks: 1,
      failedTasks: 0,
      inProgressTasks: 1,
      skippedTasks: 0,
    })
  })
})
