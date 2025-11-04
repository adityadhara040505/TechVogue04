import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-brand-600 via-brand-700 to-accent-600 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 2px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.25) 2px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 2px, transparent 2px)', backgroundSize:'180px 180px'}} />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-extrabold md:text-6xl drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Tech Vogue
          </motion.h1>
          <motion.p 
            className="mx-auto mt-6 max-w-3xl text-lg/7 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to the future of skill‑linked investing. Connect entrepreneurs with investors, organize impactful pitch meets, and track real progress through verified milestones.
          </motion.p>
          <motion.div 
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/auth" 
              className="rounded-md bg-white px-6 py-3 text-sm font-medium text-brand-700 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/pitch-events"
              className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              View Pitch Events →
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="mt-12 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Stat value="250+" label="Pitch Events" subtitle="Organized" />
          <Stat value="500+" label="Verified Profiles" subtitle="And Growing" />
          <Stat value="1.2k+" label="Community Reviews" subtitle="Trust Score" />
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ value, label, subtitle }) {
  return (
    <motion.div 
      className="group relative rounded-xl border border-white/20 bg-white/15 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className="text-4xl font-extrabold bg-clip-text"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.div>
      <motion.div 
        className="mt-1 text-lg font-medium opacity-90"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {label}
      </motion.div>
      {subtitle && (
        <motion.div 
          className="mt-1 text-sm opacity-75"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  );
}
