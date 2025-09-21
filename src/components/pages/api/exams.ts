import { NextApiRequest, NextApiResponse } from 'next'
import { ExamAPI } from '../../lib/studyhub_complete_api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { category } = req.query

      let exams
      if (category && typeof category === 'string') {
        exams = await ExamAPI.getExamsByCategory(category)
      } else {
        exams = await ExamAPI.getAllExams()
      }

      res.status(200).json({
        success: true,
        data: exams,
        count: exams.length
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