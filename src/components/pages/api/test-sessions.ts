import { NextApiRequest, NextApiResponse } from 'next'
import { TestSessionAPI } from '../../lib/studyhub_complete_api'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const {
        exam_id,
        session_type = 'practice',
        question_count = 10,
        time_limit,
        topic_ids,
        difficulty
      } = req.body

      if (!exam_id) {
        return res.status(400).json({ error: 'Exam ID is required' })
      }

      const result = await TestSessionAPI.startTestSession(
        user.id,
        exam_id,
        session_type,
        question_count,
        time_limit,
        topic_ids,
        difficulty
      )

      res.status(201).json({
        success: true,
        data: result
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { session_id, ...updates } = req.body

      if (!session_id) {
        return res.status(400).json({ error: 'Session ID is required' })
      }

      const result = await TestSessionAPI.updateTestSession(session_id, updates)

      res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else if (req.method === 'GET') {
    try {
      const { exam_id } = req.query

      const sessions = await TestSessionAPI.getUserTestSessions(
        user.id,
        typeof exam_id === 'string' ? exam_id : undefined
      )

      res.status(200).json({
        success: true,
        data: sessions
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}
