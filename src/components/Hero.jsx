import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-brand-600 via-brand-700 to-accent-600 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 2px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.25) 2px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 2px, transparent 2px)', backgroundSize:'180px 180px'}} />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl drop-shadow">Tech Vogue</h1>
        <p className="mx-auto mt-3 max-w-3xl text-lg/7 text-white/90">Skill‑linked investing for entrepreneurs and freelancers. Connect with investors, organize pitch meets, and showcase real progress.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/auth" className="rounded-md bg-white px-5 py-2 text-sm font-medium text-brand-700 shadow transition hover:-translate-y-0.5 hover:bg-brand-50">Get Started</Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat value="250+" label="Pitch Meets" />
          <Stat value="500+" label="Verified Profiles" />
          <Stat value="1.2k+" label="Community Reviews" />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/15 p-4 backdrop-blur animate-float-slow">
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="opacity-90">{label}</div>
    </div>
  )
}

