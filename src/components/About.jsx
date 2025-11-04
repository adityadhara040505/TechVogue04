import { FaUsers, FaHandshake, FaChartLine } from 'react-icons/fa'

export default function About() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center text-gray-700">
          <h2 className="text-3xl font-semibold">About Tech Vogue</h2>
          <p className="mt-3">We built Tech Vogue to empower entrepreneurs and freelancers by linking skills and transparent progress to investment opportunities.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Feature icon={<FaUsers />} title="Empower Founders" body="Create credible profiles, verify identity/startup, and highlight milestones." />
          <Feature icon={<FaHandshake />} title="Collaborate Easily" body="Find skilled freelancers and form capable teams quickly." />
          <Feature icon={<FaChartLine />} title="Show Real Progress" body="Use reviews, meetings, and verifications to build investor confidence." />
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, body }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-center">
      <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-blue-600 text-lg">{icon}</div>
      <div className="font-medium">{title}</div>
      <p className="mt-1 text-sm text-gray-600">{body}</p>
    </div>
  )
}

