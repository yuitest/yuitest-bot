import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

interface V2Analysis {
  version: number
  currentDate: string
  summary: {
    all: V2AnalysisSegment
    daily: V2AnalysisSegment
    nonDaily: V2AnalysisSegment
    tags: Record<string, V2AnalysisSegment>
  }
}
interface V2AnalysisSegment {
  total: number
  completed: number
  freshness: number
}

export const getAnalysis = async (): Promise<V2Analysis> => {
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
    Key: 'analysis.v2.json',
  })
  const downloading = s3Client.send(getCommand)
  const downloaded = await downloading
  const body = await downloaded.Body?.transformToString()
  const analysis = JSON.parse(body || '') as V2Analysis
  return {
    ...analysis,
  }
}
