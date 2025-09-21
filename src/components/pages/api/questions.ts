import { NextApiRequest, NextApiResponse } from 'next'
import { QuestionAPI } from '../../lib/studyhub_complete_api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { exam, topic, difficulty, limit, random } = req.query

      const filters = {
        exam_id: typeof exam === 'string' ? exam : undefined,
        topic_id: typeof topic === 'string' ? topic : undefined,
        difficulty: typeof difficulty === 'string' ? difficulty as 'easy' | 'medium' | 'hard' : undefined,
        limit: typeof limit === 'string' ? parseInt(limit) : undefined,
        random: random === 'true'
      }

      const questions = await QuestionAPI.getQuestions(filters)

      res.status(200).json({
        success: true,
        data: questions,
        count: questions.length,
        filters: filters
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