import { NextApiRequest, NextApiResponse } from 'next'
import { AIHelperAPI } from '../../lib/studyhub_complete_api'
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
        message, 
        conversation_id,
        exam_context_id,
        topic_context_id 
      } = req.body

      if (!message) {
        return res.status(400).json({ error: 'Message is required' })
      }

      let conversationId = conversation_id

      // Create new conversation if not provided
      if (!conversationId) {
        const conversation = await AIHelperAPI.createConversation(
          user.id,
          exam_context_id,
          topic_context_id
        )
        conversationId = conversation.id
      }

      const result = await AIHelperAPI.sendMessage(conversationId, message)

      res.status(200).json({
        success: true,
        data: {
          conversation_id: conversationId,
          user_message: result.userMessage,
          ai_response: result.aiMessage
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