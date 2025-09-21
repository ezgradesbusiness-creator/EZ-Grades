import { NextApiRequest, NextApiResponse } from 'next'
import { ExamAPI } from '../../../lib/studyhub_complete_api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid exam ID' })
      }

      const topics = await ExamAPI.getExamTopics(id)

      res.status(200).json({
        success: true,
        data: topics
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
