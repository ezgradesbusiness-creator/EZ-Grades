import { NextApiRequest, NextApiResponse } from 'next'
import { AnalyticsAPI, QuestionAPI } from '../../../lib/studyhub_complete_api'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const supabase = createServerSupabaseClient({ req, res })
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { exam_id, days = '30' } = req.query
      const dayCount = parseInt(days as string)

      // Get overall study statistics
      const studyStats = await AnalyticsAPI.getUserStudyStats(user.id, dayCount)

      // Get topic progress for specific exam or all exams
      const topicProgress = await QuestionAPI.getUserTopicProgress(
        user.id,
        typeof exam_id === 'string' ? exam_id : undefined
      )

      // Get achievements
      const achievements = await AnalyticsAPI.getUserAchievements(user.id)

      res.status(200).json({
        success: true,
        data: {
          study_statistics: studyStats,
          topic_progress: topicProgress,
          achievements: achievements,
          period_days: dayCount
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
