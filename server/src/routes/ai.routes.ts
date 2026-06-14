import { Router } from 'express'
import { optionalAuth } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'
import type { Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '../config/db'

const router = Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function toGeminiHistory(messages: ChatMessage[]) {
  // Gemini history must start with a user turn and alternate user/model
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }))

  while (history.length > 0 && history[0].role !== 'user') {
    history.shift()
  }

  return history
}

router.post('/chat', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body as { messages?: ChatMessage[] }

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' })
      return
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user' || !lastMessage.content?.trim()) {
      res.status(400).json({ error: 'Last message must be a non-empty user message' })
      return
    }

    const userId = req.user?.userId
    let skinType: string | null = null
    let triggerNames: string[] = []

    if (userId) {
      const [profile, triggers] = await Promise.all([
        prisma.userProfile.findUnique({ where: { user_id: userId } }),
        prisma.userTrigger.findMany({
          where: { user_id: userId },
          include: { ingredient: { select: { inci_name: true } } }
        })
      ])

      skinType = profile?.skin_type ?? null
      triggerNames = triggers.map(t => t.ingredient.inci_name)
    }

    const systemPrompt = `You are GlowLogic's AI skin consultant — a knowledgeable, friendly, and honest skincare advisor. Help users understand ingredients and build safe skincare routines. Keep responses concise — 2-4 paragraphs maximum. Always end with a practical tip.
${skinType ? `This user has ${skinType.replace('_', ' ').toLowerCase()} skin.` : ''}
${triggerNames.length > 0 ? `This user wants to avoid these ingredients: ${triggerNames.join(', ')}.` : ''}`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    })

    const history = toGeminiHistory(messages)
    const chat = model.startChat({ history })

    const result = await chat.sendMessage(lastMessage.content)
    const reply = result.response.text()

    res.json({ reply })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('AI chat error:', message)
    res.status(500).json({
      error: 'AI service unavailable',
      detail: message
    })
  }
})

export default router
