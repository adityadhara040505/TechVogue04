import { useState } from 'react'

export default function Pitch() {
  const [date, setDate] = useState('')
  const [topic, setTopic] = useState('')
  const [meets, setMeets] = useState(() => JSON.parse(localStorage.getItem('pitchMeets') || '[]'))

  function addMeet() {
    if (!date || !topic) return
    const next = [...meets, { id: Date.now().toString(), date, topic }]
    setMeets(next)
    localStorage.setItem('pitchMeets', JSON.stringify(next))
    setDate(''); setTopic('')
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="mb-4 text-2xl font-semibold">Pitch Meets</h2>
      <div className="rounded-lg border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <input className="input" type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
          <input className="input" placeholder="Pitch topic" value={topic} onChange={e=>setTopic(e.target.value)} />
          <button className="btn" onClick={addMeet}>Schedule</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {meets.slice().reverse().map(m => (
          <div key={m.id} className="rounded-lg border bg-white p-4">
            <div className="font-medium">{m.topic}</div>
            <div className="text-sm text-gray-700">{new Date(m.date).toLocaleString()}</div>
          </div>
        ))}
        {meets.length === 0 && <p className="text-sm text-gray-700">No pitch meets scheduled.</p>}
      </div>
    </div>
  )
}

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.6rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);

