import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

interface StepAnalysis {
  total: number
  completed: number
  incompletes: number
  isCompleted: boolean
  isIncomplete: boolean
  isMultiple: boolean
  isSingle: boolean
}

interface RawAggregateHabitAnalysis {
  daily: StepAnalysis
  others: StepAnalysis
  freshness: number
  currentTime: string // ISO 8601
  totalSteps: number
}

interface AggregateHabitAnalysis {
  daily: StepAnalysis
  others: StepAnalysis
  freshness: number
  currentTime: Date
  totalSteps: number
}

export const getAnalysis = async (): Promise<AggregateHabitAnalysis> => {
  const bucketName = process.env.HABIT_ANALYSIS_S3_BUCKET ?? ''
  const accessKeyId = process.env.HABIT_ANALYSIS_AWS_ACCESS_KEY_ID ?? ''
  const secretAccessKey = process.env.HABIT_ANALYSIS_AWS_SECRET_ACCESS_KEY ?? ''
  const region = process.env.HABIT_ANALYSIS_AWS_DEFAULT_REGION ?? ''
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: 'analysis.latest.json',
  })
  const downloading = s3Client.send(getCommand)
  const downloaded = await downloading
  const body = await downloaded.Body?.transformToString()
  const analysis = JSON.parse(body || '') as RawAggregateHabitAnalysis
  const currentTime = new Date(analysis.currentTime)
  return {
    ...analysis,
    currentTime,
  }
}
