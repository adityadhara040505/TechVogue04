import { FaDoorOpen, FaUsersCog, FaChartBar } from 'react-icons/fa'
const cards = [
  { title: 'Direct Investor Access', body: 'Organize pitch meets and secure interest quickly.', icon: <FaDoorOpen /> },
  { title: 'Skill-Linked Teams', body: 'Find and collaborate with vetted freelancers.', icon: <FaUsersCog /> },
  { title: 'Transparent Progress', body: 'Showcase milestones and traction to your network.', icon: <FaChartBar /> },
]

export default function Overview() {
  return (
    <section className="bg-gradient-to-b from-accent-50/60 to-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-6 text-center text-3xl font-semibold">How It Helps</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c,i)=> (
            <div key={i} className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-1 inline-grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-700">{c.icon}</div>
              <div className="text-lg font-medium text-black">{c.title}</div>
              <p className="mt-2 text-black">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

