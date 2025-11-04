import { useState, useRef, useEffect } from 'react'
import { FaRobot, FaUser, FaTimes } from 'react-icons/fa'

const faqData = [
  { q: 'How do I request a feature?', a: 'Send us a message using the form and include as much context as possible.' },
  { q: 'Where can I report a bug?', a: 'Describe the issue in the message form; we will follow up via email.' },
  { q: 'Do you offer onboarding help?', a: 'Yes, we can assist founders with setting up verification and first pitch meets.' },
  { q: 'How do I verify my startup?', a: 'You can verify your startup through the verification page using MCA datasets and CIN number.' },
  { q: 'How do I find investors?', a: 'Use the AI matching feature in the entrepreneur dashboard to find investors based on your domain.' },
  { q: 'How do I schedule a meeting?', a: 'Go to the Meetings section in your dashboard and click "Schedule Meeting" to set up a video call.' },
  { q: 'How do I add a pitch deck?', a: 'In the Pitch Events section, you can upload and register your pitch deck for events.' },
  { q: 'How does freelancer validation work?', a: 'Freelancers are validated using AI models that check their details and portfolio authenticity.' }
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m here to help with FAQs. Ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function findAnswer(question) {
    const lowerQuestion = question.toLowerCase()
    for (const faq of faqData) {
      const lowerQ = faq.q.toLowerCase()
      if (lowerQuestion.includes(lowerQ.split(' ')[0]) || 
          lowerQ.split(' ').some(word => lowerQuestion.includes(word))) {
        return faq.a
      }
    }
    // Simple keyword matching
    if (lowerQuestion.includes('feature') || lowerQuestion.includes('request')) {
      return faqData[0].a
    }
    if (lowerQuestion.includes('bug') || lowerQuestion.includes('report')) {
      return faqData[1].a
    }
    if (lowerQuestion.includes('onboard') || lowerQuestion.includes('help')) {
      return faqData[2].a
    }
    if (lowerQuestion.includes('verify') || lowerQuestion.includes('startup')) {
      return faqData[3].a
    }
    if (lowerQuestion.includes('investor') || lowerQuestion.includes('find')) {
      return faqData[4].a
    }
    if (lowerQuestion.includes('meeting') || lowerQuestion.includes('schedule')) {
      return faqData[5].a
    }
    if (lowerQuestion.includes('pitch') || lowerQuestion.includes('deck')) {
      return faqData[6].a
    }
    if (lowerQuestion.includes('freelancer') || lowerQuestion.includes('validate')) {
      return faqData[7].a
    }
    return 'I\'m sorry, I don\'t have an answer for that. Please use the contact form to reach out directly, or try asking about features, bugs, verification, investors, meetings, or pitch decks.'
  }

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { type: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate bot thinking
    setTimeout(() => {
      const answer = findAnswer(input)
      setMessages(prev => [...prev, { type: 'bot', text: answer }])
    }, 500)
  }

  function handleQuickQuestion(question) {
    setInput(question)
    setTimeout(() => {
      const userMessage = { type: 'user', text: question }
      setMessages(prev => [...prev, userMessage])
      setTimeout(() => {
        const answer = findAnswer(question)
        setMessages(prev => [...prev, { type: 'bot', text: answer }])
      }, 500)
    }, 100)
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 rounded-xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-brand-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <FaRobot />
              <span className="font-semibold">FAQ Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-2 ${
                    msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full ${
                      msg.type === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {msg.type === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.type === 'user'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {faqData.slice(0, 4).map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(faq.q)}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                >
                  {faq.q.split('?')[0]}
                </button>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

