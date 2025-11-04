import { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

export default function FAQ({ items }) {
  return (
    <div className="mx-auto w-full max-w-3xl divide-y rounded-xl border bg-white">
      {items.map((it, i) => (
        <Item key={i} q={it.q} a={it.a} />
      ))}
    </div>
  )
}

function Item({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-4">
      <button onClick={()=>setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="font-medium">{q}</span>
        <span className="text-gray-600">{open ? <FaMinus /> : <FaPlus />}</span>
      </button>
      {open && <div className="mt-2 text-sm text-gray-700">{a}</div>}
    </div>
  )
}

