import { useState } from 'react'
import Contact from '../components/Contact'
import FAQ from '../components/FAQ'
import Chatbot from '../components/Chatbot'

export default function ContactPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const faqs = [
    { 
      q: 'How can I report a lost item?', 
      a: 'Go to the “Report Lost” section, fill in all the details such as item name, description, location, and upload an image if available.' 
    },
    { 
      q: 'How do I report a found item?', 
      a: 'Visit the “Report Found” page and enter the item details, location, and your contact email. Once submitted, others can view it on the Browse page.' 
    },
    { 
      q: 'How can I claim an item that looks like mine?', 
      a: 'Open the item details page and click the “Claim” button. Fill out the claim form with proof or a short reason why it’s yours. The item owner will be notified.' 
    },
    { 
      q: 'Will my personal details be shared publicly?', 
      a: 'No, your personal details like email or contact number are kept private. Communication happens securely through our internal messaging system.' 
    },
    { 
      q: 'Can I upload images when reporting items?', 
      a: 'Yes, you can upload an image to help others identify the item easily. Image uploads are optional but recommended.' 
    },
    { 
      q: 'How will I be notified if someone claims my lost item?', 
      a: 'You’ll receive an email notification and an in-portal message whenever someone submits a claim for your reported item.' 
    },
    { 
      q: 'What should I do if I mistakenly report or claim an item?', 
      a: 'You can contact our support team through the contact form on this page. Provide your registered email and item details so we can correct it.' 
    },
    { 
      q: 'Can I edit or delete my submitted reports?', 
      a: 'Yes, users can edit or delete their reports from the dashboard if they’re logged in using their registered account.' 
    },
    { 
      q: 'How does the internal messaging system work?', 
      a: 'Once a claim is made, both users can communicate through the website’s secure chat without revealing personal contact information.' 
    },
    { 
      q: 'Who verifies if a claimed item truly belongs to someone?', 
      a: 'The verification depends on the details, proofs, and communication between the reporter and claimant. The platform facilitates safe interaction but does not directly verify ownership.' 
    },
    { 
      q: 'What should I do if I can’t find my item on the website?', 
      a: 'Try checking the Browse section or report it under “Report Lost.” You’ll be notified automatically if a matching item is found.' 
    },
    { 
      q: 'Is this service available only for college students?', 
      a: 'Yes, currently the platform is designed for college use only. Users must log in with their institutional credentials to access full features.' 
    }
  ]

  function submit(e) {
    e.preventDefault()
    if (!email || !message) return alert('Please fill email and message')
    alert('Thanks! We have received your message.')
    setEmail('')
    setMessage('')
  }

  return (
    <div>
      <Contact />

      <section className="bg-gradient-to-b from-white to-brand-50/40 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-2xl font-semibold">Frequently Asked Questions</h2>
          <FAQ items={faqs} />
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-brand-50/40 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-xl font-semibold">Write to us</h3>
          <form onSubmit={submit} className="space-y-3">
            <input 
              className="input" 
              placeholder="Your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <textarea 
              className="input" 
              rows="5" 
              placeholder="Your message" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
            />
            <button className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
              Send
            </button>
          </form>
        </div>
      </section>

      <Chatbot />
    </div>
  )
}
