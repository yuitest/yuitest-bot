export { Client } from 'habitify-api'
import { JournalAPIResult, JournalContent } from 'habitify-api'

export interface Summary {
  completedTasks: number
  skippedTasks: number
  failedTasks: number
  inProgressTasks: number
  allOfTasks: number
}

function summaryFromJournal(journals: JournalContent[]): Summary {
  const summary = {
    completedTasks: 0,
    skippedTasks: 0,
    failedTasks: 0,
    allOfTasks: 0,
    inProgressTasks: 0,
  }
  for (const journal of journals) {
    if (journal.is_archived) {
      continue
    }
    const targetValue = journal.progress.target_value
    const currentValue = journal.progress.current_value
    const remainValue = targetValue - currentValue
    summary.allOfTasks += targetValue
    switch (journal.status) {
      case 'completed':
        summary.completedTasks += targetValue
        break
      case 'skipped':
        summary.completedTasks += currentValue
        summary.skippedTasks += targetValue
        break
      case 'failed':
        summary.completedTasks += currentValue
        summary.failedTasks += targetValue
        break
      case 'in_progress':
        summary.completedTasks += currentValue
        summary.inProgressTasks += remainValue
        break
    }
  }
  return summary
}

function filterJournals(
  journals: JournalContent[],
  condition: (journal: JournalContent) => boolean
): JournalContent[] {
  const filteredJournals = []
  for (const journal of journals) {
    if (condition(journal)) {
      filteredJournals.push(journal)
    }
  }
  return filteredJournals
}

export function summarizeDailyJournal(data: JournalAPIResult): Summary {
  const journals = filterJournals(data.data, (journal) => {
    return journal.goal.periodicity === 'daily' && !journal.is_archived
  })
  return summaryFromJournal(journals)
}

export function summarizeWeeklyJournal(data: JournalAPIResult): Summary {
  const journals = filterJournals(data.data, (journal) => {
    return journal.goal.periodicity === 'weekly' && !journal.is_archived
  })
  return summaryFromJournal(journals)
}

export function summarizeMonthlyJournal(data: JournalAPIResult): Summary {
  const journals = filterJournals(data.data, (journal) => {
    return journal.goal.periodicity === 'monthly' && !journal.is_archived
  })
  return summaryFromJournal(journals)
}
