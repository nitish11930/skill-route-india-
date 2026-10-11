import ReactMarkdown from 'react-markdown'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import type { ChatMessage, GroundedEvidence, Role } from '../types'
import { api } from '../services/api'

interface AICareerCoachViewProps {
  currentRole: Role | null
  initialPrompt?: string
  onClearInitialPrompt?: () => void
}

export const AICareerCoachView: React.FC<AICareerCoachViewProps> = ({
  currentRole,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am Lumina, your AI Career Coach & GCC Talent Advisor at SkillRoute India. I analyze your profile through the lens of our Neo4j Prerequisite Knowledge Graph. How can I guide your technical roadmap today?`,
      timestamp: 'Just now'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeEvidence, setActiveEvidence] = useState<GroundedEvidence | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'What should I learn first?',
    'Why do I need Docker before Kubernetes?',
    'What is my shortest prerequisite path to ₹24L CTC?',
    'How do Tier-1 GCCs evaluate System Design?'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim()
      if (!query || loading) return

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages((prev) => [...prev, userMessage])
      if (!textToSend) setInput('')
      setLoading(true)

      try {
        const response = await api.chatWithCoach(query, currentRole?.id)
        const assistantMessage: ChatMessage = {
          id: `coach-${Date.now()}`,
          sender: 'assistant',
          text: response.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDemoMode: response.isDemoMode,
          groundedEvidence: response.groundedEvidence
        }
        setMessages((prev) => [...prev, assistantMessage])
        if (response.groundedEvidence) {
          setActiveEvidence(response.groundedEvidence)
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: `⚠️ Coaching service temporarily offline: ${err?.message || 'Network error'}. Please retry shortly.`,
            timestamp: 'Now'
          }
        ])
      } finally {
        setLoading(false)
      }
    },
    [input, loading, currentRole]
  )

  // If an initial prompt was passed from another view
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt)
      if (onClearInitialPrompt) onClearInitialPrompt()
    }
  }, [initialPrompt, handleSend, onClearInitialPrompt])

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-3xl border border-[#E6E8F2] shadow-card flex flex-col overflow-hidden">
        {/* Coach Header */}
        <div className="p-4 border-b border-[#E6E8F2] flex items-center justify-between bg-gradient-to-r from-white to-[#F8F9FD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F6FED] to-[#7C5CFC] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#1E2238]">Lumina Career Coach</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A]">
                  Graph Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#8B90A7]">
                Advising on target role: <strong className="text-[#1E2238]">{currentRole?.title}</strong>
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#626784] bg-[#F4F5FB] px-2.5 py-1 rounded-xl hidden sm:flex items-center gap-1.5 border border-[#E6E8F2]">
            <span className="material-symbols-outlined text-[14px] text-[#2F6FED]">shield</span>
            <span>Zero Hallucination Guardrail</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto custom-scroll flex flex-col gap-4 bg-[#FAFBFF]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] text-[#2F6FED] flex items-center justify-center shrink-0 mt-1">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-[#2F6FED] to-[#4F46E5] text-white rounded-tr-xs shadow-md shadow-blue-500/10'
                      : 'bg-white text-[#1E2238] rounded-tl-xs border border-[#E6E8F2] shadow-xs'
                  }`}
                >
                  <div className="coach-markdown">{msg.sender === 'assistant' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}</div>

                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] pt-1 border-t ${
                      isUser ? 'border-white/20 text-white/70' : 'border-[#E6E8F2] text-[#8B90A7]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.isDemoMode !== undefined && (
                      <span className="ml-2 font-medium">
                        {msg.isDemoMode ? 'Demo Graph Grounding' : 'Live Gemini Model'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] items-center">
              <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] text-[#2F6FED] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E6E8F2] rounded-2xl text-xs text-[#626784] flex items-center gap-2">
                <span>Traversing prerequisite graph evidence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#E6E8F2] bg-white flex items-center gap-2 overflow-x-auto custom-scroll">
          <span className="text-[11px] font-bold text-[#8B90A7] shrink-0">Quick prompts:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#F4F5FB] hover:bg-[#EEF2FF] hover:text-[#2F6FED] text-[#626784] transition-all shrink-0 border border-[#E6E8F2]/60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[#E6E8F2] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Lumina about prerequisite sequencing, CTC benchmarks, or interview triage..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#F4F5FB] border border-[#E6E8F2] rounded-xl text-xs font-medium focus:outline-none focus:border-[#2F6FED] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 bg-[#2F6FED] hover:bg-[#255CD0] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-pill flex items-center gap-1.5 transition-all"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Grounded Evidence Drawer (Right Panel) */}
      <div className="w-full lg:w-80 bg-white rounded-3xl border border-[#E6E8F2] shadow-card p-5 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scroll">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E6E8F2]">
          <span className="material-symbols-outlined text-[20px] text-[#2F6FED]">fact_check</span>
          <h4 className="font-bold text-sm text-[#1E2238]">Active Graph Evidence</h4>
        </div>

        {activeEvidence ? (
          <div className="flex flex-col gap-4 text-xs">
            {/* Target Role & Readiness */}
            <div className="p-3 bg-[#F8F9FD] rounded-2xl border border-[#E6E8F2]/60 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase text-[#8B90A7]">Target Role</span>
              <div className="font-bold text-[#1E2238]">{activeEvidence.targetRole}</div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-[#626784]">Readiness Score:</span>
                <strong className="text-[#2F6FED] font-bold">{activeEvidence.readinessScore}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#626784]">Salary estimate:</span>
                <span className="font-semibold text-[#16A34A]">{activeEvidence.targetCtcRange}</span>
              </div>
            </div>

            {/* Ready to Learn Skills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase text-[#16A34A] tracking-wider">
                Ready to Learn (Prerequisites Met)
              </span>
              {activeEvidence.readyToLearn.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {activeEvidence.readyToLearn.map((r, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl text-[11px] font-semibold text-[#065F46] flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#8B90A7]">All immediate skills completed!</p>
              )}
            </div>

            {/* Blocked Skills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase text-[#EA580C] tracking-wider">
                Prerequisite Blockers
              </span>
              {activeEvidence.blockedSkills.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {activeEvidence.blockedSkills.map((b, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#FFF7ED] border border-[#F59E0B]/30 rounded-xl text-[11px] text-[#9A3412]"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#8B90A7]">No blockers detected.</p>
              )}
            </div>

            {/* Curated Recommendations */}
            {activeEvidence.recommendedResources.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase text-[#7C5CFC] tracking-wider">
                  Graph-Linked Resources
                </span>
                <div className="flex flex-col gap-1">
                  {activeEvidence.recommendedResources.map((res, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#F2EFFF] border border-[#7C5CFC]/30 rounded-xl text-[11px] text-[#5A45CB]"
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-[#8B90A7] text-xs">
            <span className="material-symbols-outlined text-[32px] text-[#CBD5E1] block mb-2">
              insights
            </span>
            Ask a question to see real-time prerequisite evidence extracted from the graph.
          </div>
        )}
      </div>
    </div>
  )
}
