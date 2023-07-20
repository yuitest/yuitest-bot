const HABITIFY_API_BASE_URL = 'https://api.habitify.me'
const HABITIFY_API_JOURNAL_URL = `${HABITIFY_API_BASE_URL}/journal`

// https://docs.habitify.me/core-resources/journal
export interface JournalAPIResult {
  errors: unknown[]
  message: string
  data: JournalContent[]
  version: string
  status: boolean
}

export interface JournalContent {
  id: IDString
  name: string
  is_archived: boolean
  start_date: DateString
  time_of_day: TimeOfDay[]
  goal: GoalItem
  goal_history_items: GoalItem[]
  log_method: LogMethod
  recurrence: Recurrence
  remind: Remind[]
  area: Area
  created_date: DateString
  priority: number
  status: Status
  progress: Progress
  habit_type: number
}

export interface GoalItem {
  unit_type: UnitType
  value: number
  periodicity: Periodicity
}

export interface Area {
  id: IDString
  name: string
  priority: string
}

export interface Progress {
  current_value: number
  target_value: number
  unit_type: UnitType
  periodicity: Periodicity
  reference_date: DateString
}

export type Remind = unknown // TODO
export type Status = 'in_progress' | 'completed' | 'failed' | 'skipped'
// https://docs.habitify.me/enum/time-of-day
export type TimeOfDay = 'any_time' | 'morning' | 'afternoon' | 'evening'
export type UnitType = 'rep' // https://docs.habitify.me/enum/unit-type#scalar
export type Priority = 'U' | 'B' | '9' | '2' | '4' | '1' // ???
export type Periodicity = 'daily' | 'weekly' | 'monthly'
// https://docs.habitify.me/enum/log-method
export type LogMethod = 'manual' | 'appleHealth' | 'googleFit' | 'samsungHealth'
export type DateString = string
export type Recurrence = string
export type IDString = string

export interface Summary {
  completedTasks: number
  skippedTasks: number
  failedTasks: number
  inProgressTasks: number
  allOfTasks: number
}

export async function getTodaysJournal(
  apiKey: string,
  targetDate: DateString
): Promise<JournalAPIResult> {
  const query = new URLSearchParams({
    target_date: targetDate,
  })
  const url = `${HABITIFY_API_JOURNAL_URL}?${query}`
  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  })
  // TODO
  const data = (await response.json()) as JournalAPIResult
  return data
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
