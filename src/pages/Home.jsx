import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Overview from '../components/Overview'
import About from '../components/About'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <div>
      <Hero />
      <RoleCards />
      <Featured />
      <Overview />
      <section id="about" className="py-8">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-2xl font-semibold">About Us</h2>
          <About />
        </div>
      </section>
      <section id="contact" className="pt-0">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center text-2xl font-semibold">Contact Us</h2>
        </div>
        <Contact />
      </section>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { FaRocket, FaUserTie, FaLaptopCode } from 'react-icons/fa'
import { getCurrentUser } from '../lib/session'
function RoleCards() {
  const navigate = useNavigate()

  function go(role) {
    const currentUser = getCurrentUser()
    if (currentUser) {
      if (role === 'entrepreneur') navigate('/entrepreneurs')
      else if (role === 'investor') navigate('/investors')
      else navigate('/freelancers')
    } else {
      navigate(`/auth?role=${role}`)
    }
  }

  return (
    <section className="py-14 bg-gradient-to-b from-white to-brand-50/40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-6 text-center text-3xl font-semibold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="For Startups"
            body="Create profiles, verify identity/startup, post milestones, build teams, receive reviews."
            onJoin={()=>go('entrepreneur')}
            joinLabel="Join as Entrepreneur"
            icon={<FaRocket />}
          />
          <Card
            title="For Investors"
            body="Discover startups, request intros, review founders, track meetings, leave ratings and feedback."
            onJoin={()=>go('investor')}
            joinLabel="Join as Investor"
            icon={<FaUserTie />}
          />
          <Card
            title="For Freelancers"
            body="Showcase skills and portfolio, get invited by founders, apply to roles, receive reviews."
            onJoin={()=>go('freelancer')}
            joinLabel="Join as Freelancer"
            icon={<FaLaptopCode />}
          />
        </div>
      </div>
    </section>
  )
}

function Card({ title, body, onJoin, joinLabel, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-1 inline-grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">{icon}</div>
      <div className="text-2xl font-semibold">{title}</div>
      <p className="mx-auto mt-3 max-w-xs text-black">{body}</p>
      <button onClick={onJoin} className="mt-5 inline-flex rounded-md bg-brand-600 px-5 py-2 text-white transition hover:-translate-y-0.5 hover:bg-brand-700">{joinLabel}</button>
    </div>
  )
}

