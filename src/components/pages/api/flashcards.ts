import { NextApiRequest, NextApiResponse } from 'next'
import { FlashcardAPI } from '../../lib/studyhub_complete_api'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res })
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const { exam, topic, set_id } = req.query

      if (set_id && typeof set_id === 'string') {
        // Get flashcards in a specific set
        const flashcards = await FlashcardAPI.getFlashcards(set_id)
        return res.status(200).json({
          success: true,
          data: flashcards
        })
      } else {
        // Get flashcard sets for user
        const sets = await FlashcardAPI.getFlashcardSets(user.id, true)

        // Filter by exam/topic if provided
        let filteredSets = sets
        if (exam && typeof exam === 'string') {
          filteredSets = sets.filter(set => set.exam_id === exam)
        }
        if (topic && typeof topic === 'string') {
          filteredSets = filteredSets.filter(set => set.topic_id === topic)
        }

        return res.status(200).json({
          success: true,
          data: filteredSets
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { exam_id, topic_id, difficulty, count = 20 } = req.body

      if (!exam_id) {
        return res.status(400).json({ error: 'Exam ID is required' })
      }

      const result = await FlashcardAPI.generateFlashcardsFromQuestions(
        user.id,
        exam_id,
        topic_id,
        difficulty,
        count
      )

      res.status(201).json({
        success: true,
        message: 'Flashcards generated successfully',
        data: result
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}