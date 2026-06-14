import { useState, useRef, useEffect } from 'react'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiError'
import { toastError } from '../store/toastStore'

interface Message {
  role: 'user' | 'assistant'
  content: string
  localOnly?: boolean
}

const SUGGESTED_QUESTIONS = [
  'What skin type do I have?',
  'Can I use retinol and AHA together?',
  'What ingredients should I avoid for acne?',
  'How do I build a basic skincare routine?',
]

export default function AiChat() {
  const { user, accessToken } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [messages, isOpen])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const { data } = await api.post('/ai/chat', {
        messages: newMessages
          .filter(m => !m.localOnly)
          .map(m => ({ role: m.role, content: m.content })),
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      toastError(getApiErrorMessage(err, 'AI chat is unavailable right now.'))
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.'
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleOpen() {
    setIsOpen(true)
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        localOnly: true,
        content: user
          ? `Hi! I'm your GlowLogic skin consultant 🌸 I know your skin profile, so I can give you personalised advice. What would you like to know?`
          : `Hi! I'm your GlowLogic skin consultant 🌸 I can help you understand ingredients, build routines, and find solutions for your skin concerns. What would you like to know?`
      }])
    }
  }

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '70vh', height: 520 }}
        >
          {/* Header */}
          <div className="bg-gl-nightbloom px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gl-wildrose flex items-center justify-center text-sm">
                🌸
              </div>
              <div>
                <p className="text-gl-petalmist text-sm font-medium">Skin Consultant</p>
                <p className="text-gl-stone text-xs">AI powered by GlowLogic</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gl-stone hover:text-gl-petalmist transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            style={{ background: '#F7F0EE' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gl-wildrose flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-1">
                    🌸
                  </div>
                )}
                <div
                  className={`max-w-[80%] text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gl-plum text-gl-petalmist rounded-br-sm'
                      : 'bg-white text-gl-ink rounded-bl-sm border border-gl-pebble'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gl-wildrose flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-1">
                  🌸
                </div>
                <div className="bg-white border border-gl-pebble px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gl-dustypetal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gl-dustypetal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gl-dustypetal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {showSuggestions && messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-gl-stone">Suggested questions:</p>
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs bg-white border border-gl-dustypetal text-gl-plum px-3 py-2 rounded-lg hover:bg-gl-softbloom hover:border-gl-wildrose transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gl-pebble px-3 py-3 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about ingredients, routines..."
              className="flex-1 text-sm bg-gl-petalmist border border-gl-pebble rounded-lg px-3 py-2 text-gl-ink placeholder:text-gl-stone focus:outline-none focus:border-gl-wildrose"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="bg-gl-plum text-gl-petalmist text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-40 flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`fixed right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          accessToken ? 'bottom-20 md:bottom-4' : 'bottom-4'
        }`}
        style={{ background: 'linear-gradient(135deg, #7A3548 0%, #A85068 100%)' }}
      >
        {isOpen ? (
          <span className="text-gl-petalmist text-xl leading-none">×</span>
        ) : (
          <span className="text-xl">🌸</span>
        )}
      </button>
    </>
  )
}