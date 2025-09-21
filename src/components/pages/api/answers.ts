import { NextApiRequest, NextApiResponse } from 'next'
import { QuestionAPI, AnalyticsAPI } from '../../lib/studyhub_complete_api'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const supabase = createServerSupabaseClient({ req, res })
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { 
        question_id, 
        user_answer, 
        session_type = 'practice',
        time_taken 
      } = req.body

      if (!question_id || !user_answer) {
        return res.status(400).json({ 
          error: 'Question ID and user answer are required' 
        })
      }

      const result = await QuestionAPI.submitAnswer(
        user.id,
        question_id,
        user_answer,
        session_type,
        time_taken
      )

      // Record study session activity
      await AnalyticsAPI.recordStudySession(user.id, {
        session_type: 'practice_questions',
        duration_minutes: time_taken ? Math.ceil(time_taken / 60) : 1,
        questions_answered: 1,
        correct_answers: result.isCorrect ? 1 : 0,
        points_earned: result.isCorrect ? 10 : 0
      })

      res.status(200).json({
        success: true,
        data: {
          answer: result.answer,
          is_correct: result.isCorrect,
          points_earned: result.isCorrect ? 10 : 0
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}