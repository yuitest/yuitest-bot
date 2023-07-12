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

// export const getTodaysJournal = async (apiKey: string) => {
export async function getTodaysJournal(
  apiKey: string
): Promise<JournalAPIResult> {
  const query = new URLSearchParams({
    target_date: '2023-07-12T00:00:00+09:00',
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

export function summarizeJournal(data: JournalAPIResult): Summary {
  const summary = {
    completedTasks: 0,
    skippedTasks: 0,
    failedTasks: 0,
    allOfTasks: 0,
    inProgressTasks: 0,
  }
  for (const journal of data.data) {
    summary.allOfTasks += 1
    switch (journal.status) {
      case 'completed':
        summary.completedTasks += 1
        break
      case 'skipped':
        summary.skippedTasks += 1
        break
      case 'failed':
        summary.failedTasks += 1
        break
      case 'in_progress':
        summary.inProgressTasks += 1
        break
    }
  }
  return summary
}
