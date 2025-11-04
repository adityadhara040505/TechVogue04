import { useEffect, useRef, useState } from 'react'

export default function Featured() {
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState([])
  const trackRef = useRef(null)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('featuredStartups') || '[]')
      setSlides(Array.isArray(data) ? data : [])
    } catch {
      setSlides([])
    }
  }, [])

  function move(delta) {
    const next = (index + delta + slides.length) % slides.length
    setIndex(next)
  }

  if (!slides.length) return null

  return (
    <section className="bg-gray-100 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-2xl font-semibold">Featured Startups</h2>
        <div className="relative overflow-hidden rounded-xl bg-white">
          <div ref={trackRef} className="flex transition-transform duration-300" style={{ transform: `translateX(-${index*100}%)` }}>
            {slides.map((s, i) => (
              <div key={i} className="min-w-full grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2">
                <div>
                  <div className="text-2xl font-semibold">{s.title}</div>
                  <p className="mt-2 text-gray-600">{s.summary}</p>
                  <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm">{s.cta}</button>
                </div>
                <div className="h-48 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
          <button onClick={()=>move(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-white">‹</button>
          <button onClick={()=>move(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-1 text-white">›</button>
        </div>
      </div>
    </section>
  )
}

