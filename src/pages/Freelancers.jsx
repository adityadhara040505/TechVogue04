import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getUsers } from '../lib/session'

export default function Freelancers() {
  const [tab, setTab] = useState('overview')
  const [portfolio, setPortfolio] = useState([])
  const [applications, setApplications] = useState([])
  const [reviews, setReviews] = useState([])
  const [messagesCount, setMessagesCount] = useState(0)
  const [showAddDetailsModal, setShowAddDetailsModal] = useState(false)

  useEffect(() => {
    const me = getCurrentUser()
    try {
      const p = JSON.parse(localStorage.getItem('portfolio') || '[]')
      const a = JSON.parse(localStorage.getItem('applications') || '[]')
      const r = JSON.parse(localStorage.getItem('reviews') || '[]')
      const m = JSON.parse(localStorage.getItem('messages') || '[]')
      setPortfolio(me ? p.filter(x => x.userId === me.id) : [])
      setApplications(me ? a.filter(x => x.userId === me.id) : [])
      setReviews(me ? r.filter(x => x.toUserId === me.id) : [])
      setMessagesCount(me ? m.filter(mm => mm.toId === me.id || mm.fromId === me.id).length : 0)
    } catch {
      setPortfolio([]); setApplications([]); setReviews([]); setMessagesCount(0)
    }
  }, [])

  useEffect(() => {
    const m = /tab=([a-z]+)/i.exec(window.location.hash || '')
    if (m) setTab(m[1])
  }, [])

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0
    return (reviews.reduce((a, b) => a + (+b.rating || 0), 0) / reviews.length).toFixed(2)
  }, [reviews])

  return (
    <div className="mx-auto max-w-7xl p-8 text-[16px]">
      <HeaderFreelancer onAddDetails={() => setShowAddDetailsModal(true)} />
      {showAddDetailsModal && <AddDetailsModal onClose={() => setShowAddDetailsModal(false)} />}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Stat label="Portfolio" value={portfolio.length} />
        <Stat label="Applications" value={applications.length} color="accent" />
        <Stat label="Messages" value={messagesCount} />
        <Stat label="Avg Rating" value={avg} suffix="/5" color="accent" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <SidebarFreelancer activeKey={tab} onSelect={(k)=>{ setTab(k); const h = `#tab=${k}`; if (window.location.hash !== h) window.location.hash = h }} />
        <div>
          {tab==='overview' && (
            <div className="mt-6 flex justify-center"><div className="w-full max-w-3xl"><ProfileSummary /></div></div>
          )}
          {tab==='portfolio' && (
            <PortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} />
          )}
          {tab==='applications' && (
            <ApplicationsManager applications={applications} setApplications={setApplications} />
          )}
          {tab==='messages' && (<MessagesChat />)}
          {tab==='analytics' && (<AnalyticsPanel series={[{label:'Portfolio',value:portfolio.length},{label:'Applications',value:applications.length},{label:'Messages',value:messagesCount}]} />)}
          {tab==='settings' && (<SettingsFreelancer />)}
        </div>
      </div>
    </div>
  )
}

function HeaderFreelancer({ onAddDetails }) {
  const me = getCurrentUser()
  const name = me?.name || 'Freelancer'
  return (
    <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-3xl text-gray-500">👤</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{name}</h2>
            <button onClick={onAddDetails} className="ml-auto inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700">Add Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarFreelancer({ activeKey, onSelect }) {
  const Item = ({ id, label }) => (
    <button onClick={()=>onSelect(id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[15px] ${activeKey===id?'bg-brand-50 text-brand-700':'text-gray-700 hover:bg-gray-100'}`}>{label}</button>
  )
  return (
    <aside className="sticky top-20 h-max self-start rounded-xl border bg-white p-3 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Navigation</div>
      <nav className="flex flex-col gap-1">
        <Item id="overview" label="Dashboard" />
        <Item id="portfolio" label="Portfolio" />
        <Item id="applications" label="Applications" />
        <Item id="messages" label="Messages" />
        <Item id="analytics" label="Analytics" />
        <Item id="settings" label="Settings" />
      </nav>
    </aside>
  )
}

function ProfileSummary() {
  const me = getCurrentUser()
  const p = (()=>{ try { return (JSON.parse(localStorage.getItem('freelancerProfiles')||'[]')||[]).find(x=>x.userId===me?.id) || {} } catch { return {} } })()
  return (
    <Card title="Freelancer Profile">
      {p && (p.name || p.skills || p.rate || p.bio || p.portfolioLink || p.linkedin || p.github || p.experience) ? (
        <div className="space-y-3 text-[15px] text-gray-800">
          {p.name && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Name</div><div className="pl-3 text-gray-900 font-semibold">{p.name}</div></div>}
          {p.skills && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Skills</div><div className="pl-3 text-gray-900">{p.skills}</div></div>}
          {p.rate && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Rate</div><span className="ml-3 rounded-full bg-brand-50 px-3 py-1 text-brand-700">{p.rate}</span></div>}
          {p.bio && (<div><div className="mb-1 font-medium text-gray-600">Bio</div><p className="whitespace-pre-line rounded-md border bg-gray-50 p-3 text-gray-900">{p.bio}</p></div>)}
          {p.portfolioLink && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Portfolio</div><a href={p.portfolioLink} target="_blank" rel="noopener noreferrer" className="pl-3 text-brand-600 hover:underline">{p.portfolioLink}</a></div>}
          {p.linkedin && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">LinkedIn</div><a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="pl-3 text-brand-600 hover:underline">{p.linkedin}</a></div>}
          {p.github && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">GitHub</div><a href={p.github} target="_blank" rel="noopener noreferrer" className="pl-3 text-brand-600 hover:underline">{p.github}</a></div>}
          {p.experience && (<div><div className="mb-1 font-medium text-gray-600">Experience</div><p className="whitespace-pre-line rounded-md border bg-gray-50 p-3 text-gray-900">{p.experience}</p></div>)}
        </div>
      ) : (
        <div className="text-[15px] text-gray-700">No profile yet. Click "Add Details" to create your profile.</div>
      )}
    </Card>
  )
}

function MessagesChat() {
  const me = getCurrentUser()
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [thread, setThread] = useState([])
  const users = getUsers()
  useEffect(()=>{ load() },[to])
  function load(){
    try {
      const all = JSON.parse(localStorage.getItem('messages')||'[]')
      setThread(all.filter(m=> (m.toId===me?.id && m.fromId===to) || (m.fromId===me?.id && m.toId===to)))
    } catch { setThread([]) }
  }
  function send(){
    if(!me||!to||!text) return
    const all = JSON.parse(localStorage.getItem('messages')||'[]')
    all.push({ id: Date.now().toString(), fromId: me.id, toId: to, text, at: new Date().toISOString() })
    localStorage.setItem('messages', JSON.stringify(all))
    setText('')
    load()
  }
  return (
    <Card title="Messages">
      <div className="flex items-center gap-2">
        <select className="input" value={to} onChange={e=>setTo(e.target.value)}>
          <option value="">Select recipient</option>
          {users.filter(u=>u.id!==me?.id && (u.role==='entrepreneur' || u.role==='investor')).map(u=> (
            <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 h-40 overflow-auto rounded border bg-gray-50 p-2 text-sm">
        {thread.map(m=> (<div key={m.id} className={`mb-2 ${m.fromId===me?.id?'text-right':''}`}><span className={`inline-block rounded px-2 py-1 ${m.fromId===me?.id?'bg-brand-600 text-white':'bg-white border'}`}>{m.text}</span></div>))}
        {thread.length===0 && <div className="text-gray-600">No messages.</div>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input className="input" placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} />
        <button className="rounded-md bg-brand-600 px-3 py-2 text-white" onClick={send}>Send</button>
      </div>
    </Card>
  )
}

function AnalyticsPanel({ series }) {
  const max = Math.max(1, ...series.map(s=>s.value))
  return (
    <Card title="Analytics">
      <div className="grid grid-cols-4 items-end gap-3">
        {series.map(s=> (
          <div key={s.label} className="text-center">
            <div className="mx-auto w-10 rounded bg-brand-600" style={{height: `${(s.value/max)*80 + 10}px`}} />
            <div className="mt-1 text-xs text-gray-700">{s.label}</div>
            <div className="text-sm font-medium">{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PortfolioManager({ portfolio, setPortfolio }) {
  const me = getCurrentUser()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [stack, setStack] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const me = getCurrentUser()
    try {
      const p = JSON.parse(localStorage.getItem('portfolio') || '[]')
      setPortfolio(me ? p.filter(x => x.userId === me.id) : [])
    } catch {
      setPortfolio([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addOrUpdate() {
    if (!title || !stack) {
      alert('Please fill in title and stack')
      return
    }
    const me = getCurrentUser()
    if (!me) return
    
    const all = JSON.parse(localStorage.getItem('portfolio') || '[]')
    const item = {
      id: editingId || Date.now().toString(),
      userId: me.id,
      title,
      stack,
      link: link || '',
      description: description || '',
      createdAt: editingId ? (all.find(p => p.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    }
    
    if (editingId) {
      const idx = all.findIndex(p => p.id === editingId)
      if (idx >= 0) all[idx] = item
    } else {
      all.push(item)
    }
    
    localStorage.setItem('portfolio', JSON.stringify(all))
    setPortfolio(all.filter(x => x.userId === me.id))
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setStack('')
    setLink('')
    setDescription('')
    setEditingId(null)
    setShowForm(false)
  }

  function editItem(item) {
    setTitle(item.title || '')
    setStack(item.stack || '')
    setLink(item.link || '')
    setDescription(item.description || '')
    setEditingId(item.id)
    setShowForm(true)
  }

  function deleteItem(id) {
    if (!confirm('Delete this portfolio item?')) return
    const all = JSON.parse(localStorage.getItem('portfolio') || '[]')
    const filtered = all.filter(p => p.id !== id)
    localStorage.setItem('portfolio', JSON.stringify(filtered))
    const me = getCurrentUser()
    setPortfolio(me ? filtered.filter(x => x.userId === me.id) : [])
  }

  return (
    <Card title="Portfolio">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">My Portfolio Items</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          {showForm ? 'Cancel' : '+ Add Portfolio Item'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 rounded-md border p-4 bg-gray-50">
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Title</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Project Name" /></div>
            <div><label className="mb-1 block text-sm font-medium">Tech Stack</label><input className="input" value={stack} onChange={e=>setStack(e.target.value)} placeholder="React, Node.js" /></div>
            <div className="md:col-span-2"><label className="mb-1 block text-sm font-medium">Portfolio Link</label><input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://github.com/username/project" /></div>
            <div className="md:col-span-2"><label className="mb-1 block text-sm font-medium">Description</label><textarea className="input" rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Brief description of the project" /></div>
          </div>
          <button className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-white" onClick={addOrUpdate}>
            {editingId ? 'Update' : 'Add'} Portfolio Item
          </button>
        </div>
      )}

      <div className="space-y-3">
        {portfolio.length === 0 && !showForm && (
          <div className="text-sm text-gray-600 py-4 text-center">No portfolio items yet. Click "Add Portfolio Item" to get started.</div>
        )}
        {portfolio.map(p => (
          <div key={p.id} className="border rounded-md p-3 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{p.title}</div>
                <div className="text-sm text-gray-600 mt-1">Stack: {p.stack}</div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline mt-1 block">
                    View Portfolio →
                  </a>
                )}
                {p.description && (
                  <div className="text-sm text-gray-700 mt-2">{p.description}</div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => editItem(p)} className="text-sm text-brand-600 hover:text-brand-700">Edit</button>
                <button onClick={() => deleteItem(p.id)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ApplicationsManager({ applications, setApplications }) {
  const me = getCurrentUser()
  const [showForm, setShowForm] = useState(false)
  const [startup, setStartup] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const entrepreneurs = (() => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
      return users.filter(u => u.role === 'entrepreneur').map(u => {
        const profile = profiles.find(p => p.userId === u.id)
        return { ...u, startupName: profile?.startupName || 'Startup' }
      })
    } catch {
      return []
    }
  })()

  useEffect(() => {
    const me = getCurrentUser()
    try {
      const a = JSON.parse(localStorage.getItem('applications') || '[]')
      setApplications(me ? a.filter(x => x.userId === me.id) : [])
    } catch {
      setApplications([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function submitApplication() {
    if (!startup || !role) {
      alert('Please select a startup and specify the role')
      return
    }
    const me = getCurrentUser()
    if (!me) return

    const all = JSON.parse(localStorage.getItem('applications') || '[]')
    const application = {
      id: Date.now().toString(),
      userId: me.id,
      startup,
      role,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    all.push(application)
    localStorage.setItem('applications', JSON.stringify(all))
    setApplications(all.filter(x => x.userId === me.id))
    setStartup('')
    setRole('')
    setMessage('')
    setShowForm(false)
    alert('Application submitted successfully!')
  }

  return (
    <Card title="Applications">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">My Applications</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          {showForm ? 'Cancel' : '+ Apply to Role'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-md border p-4 bg-gray-50">
          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Select Startup</label>
              <select className="input" value={startup} onChange={e=>setStartup(e.target.value)}>
                <option value="">Choose a startup...</option>
                {entrepreneurs.map(e => (
                  <option key={e.id} value={e.startupName}>{e.startupName} - {e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role/Position</label>
              <input className="input" value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Frontend Developer, Full Stack Engineer" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cover Message (Optional)</label>
              <textarea className="input" rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Brief message about why you're interested..." />
            </div>
          </div>
          <button className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-white" onClick={submitApplication}>
            Submit Application
          </button>
        </div>
      )}

      <div className="space-y-3">
        {applications.length === 0 && !showForm && (
          <div className="text-sm text-gray-600 py-4 text-center">No applications submitted yet.</div>
        )}
        {applications.slice().reverse().map(a => (
          <div key={a.id} className="border rounded-md p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{a.startup}</div>
                <div className="text-sm text-gray-600 mt-1">Role: {a.role}</div>
                <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  a.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                </div>
                {a.message && (
                  <div className="text-sm text-gray-700 mt-2">{a.message}</div>
                )}
                <div className="text-xs text-gray-500 mt-2">Applied: {new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AddDetailsModal({ onClose }) {
  const me = getCurrentUser()
  const [name, setName] = useState(me?.name || 'NandiniNew')
  const [skills, setSkills] = useState('React, Node, UI/UX')
  const [rate, setRate] = useState('$20/hr')
  const [bio, setBio] = useState('')
  const [portfolioLink, setPortfolioLink] = useState('https://yourportfolio.com')
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/username')
  const [github, setGithub] = useState('https://github.com/username')
  const [experience, setExperience] = useState('')
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  
  useEffect(()=>{
    try { 
      const p=(JSON.parse(localStorage.getItem('freelancerProfiles')||'[]')||[]).find(x=>x.userId===me?.id)
      if(p){ 
        setName(p.name || me?.name || 'NandiniNew')
        setSkills(p.skills || 'React, Node, UI/UX'); 
        setRate(p.rate || '$20/hr'); 
        setBio(p.bio || '')
        setPortfolioLink(p.portfolioLink || 'https://yourportfolio.com')
        setLinkedin(p.linkedin || 'https://linkedin.com/in/username')
        setGithub(p.github || 'https://github.com/username')
        setExperience(p.experience || '')
        setValidationResult(p.validationResult || null)
      } 
    } catch {}
  },[me])
  
  async function validateProfile() {
    setValidating(true)
    try {
      const { api } = await import('../lib/api')
      const portfolios = (() => {
        try {
          return JSON.parse(localStorage.getItem('portfolio') || '[]').filter(p => p.userId === me?.id)
        } catch {
          return []
        }
      })()
      
      const response = await api.post('/ai/validate-freelancer', {
        skills,
        portfolio: portfolios,
        experience,
        linkedin
      })
      setValidationResult(response.data)
      if (response.data.valid) {
        alert('Profile validated successfully!')
      } else {
        alert(`Validation issues found: ${response.data.issues.join(', ')}`)
      }
    } catch (error) {
      alert('Validation failed. Please try again.')
      console.error(error)
    } finally {
      setValidating(false)
    }
  }
  
  function save(){
    try { 
      const users=JSON.parse(localStorage.getItem('users')||'[]')
      const i=users.findIndex(u=>u.id===me?.id)
      if(i>=0){
        users[i].name=name
        localStorage.setItem('users', JSON.stringify(users))
      } 
    } catch{}
    
    const profiles = JSON.parse(localStorage.getItem('freelancerProfiles')||'[]')
    const idx = profiles.findIndex(p=>p.userId===me?.id)
    const next = { 
      ...(idx>=0?profiles[idx]:{}), 
      userId: me?.id, 
      name,
      skills, 
      rate, 
      bio,
      portfolioLink,
      linkedin,
      github,
      experience,
      validationResult
    }
    if(idx>=0) profiles[idx]=next; else profiles.push(next)
    localStorage.setItem('freelancerProfiles', JSON.stringify(profiles))
    alert('Profile updated successfully!')
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-xl border bg-white p-6 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Add Freelancer Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="grid gap-3 md:grid-cols-3 max-h-[70vh] overflow-y-auto">
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Skills</label><input className="input" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node, UI/UX" /></div>
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Rate</label><input className="input" value={rate} onChange={e=>setRate(e.target.value)} placeholder="$20/hr" /></div>
          <div className="md:col-span-3"><label className="mb-1 block text-sm font-medium">Bio</label><textarea className="input" rows={4} value={bio} onChange={e=>setBio(e.target.value)} /></div>
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Portfolio Link</label><input className="input" value={portfolioLink} onChange={e=>setPortfolioLink(e.target.value)} placeholder="https://yourportfolio.com" /></div>
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">LinkedIn</label><input className="input" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" /></div>
          <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">GitHub</label><input className="input" value={github} onChange={e=>setGithub(e.target.value)} placeholder="https://github.com/username" /></div>
          <div className="md:col-span-3"><label className="mb-1 block text-sm font-medium">Experience</label><textarea className="input" rows={3} value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Years of experience and notable projects..." /></div>
        </div>
        {validationResult && (
          <div className={`mt-3 rounded-md p-3 ${validationResult.valid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            <div className="font-medium">Validation Status: {validationResult.valid ? 'Valid' : 'Needs Improvement'}</div>
            <div className="text-sm mt-1">Score: {(validationResult.score * 100).toFixed(0)}%</div>
            {validationResult.issues && validationResult.issues.length > 0 && (
              <div className="mt-2">
                <div className="font-medium">Issues:</div>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationResult.recommendations && validationResult.recommendations.length > 0 && (
              <div className="mt-2">
                <div className="font-medium">Recommendations:</div>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <button 
            onClick={validateProfile} 
            disabled={validating}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {validating ? 'Validating...' : 'Validate Profile (AI)'}
          </button>
          <div className="flex gap-2">
            <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700" onClick={save}>Save Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsFreelancer() {
  const me = getCurrentUser()
  const [name, setName] = useState(me?.name || '')
  const [skills, setSkills] = useState('')
  const [rate, setRate] = useState('')
  const [bio, setBio] = useState('')
  const [portfolioLink, setPortfolioLink] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [experience, setExperience] = useState('')
  
  useEffect(()=>{
    try { 
      const p=(JSON.parse(localStorage.getItem('freelancerProfiles')||'[]')||[]).find(x=>x.userId===me?.id)
      if(p){ 
        setSkills(p.skills||''); 
        setRate(p.rate||''); 
        setBio(p.bio||'')
        setPortfolioLink(p.portfolioLink || '')
        setLinkedin(p.linkedin || '')
        setGithub(p.github || '')
        setExperience(p.experience || '')
      } 
    } catch {}
  },[])
  
  function save(){
    try { 
      const users=JSON.parse(localStorage.getItem('users')||'[]')
      const i=users.findIndex(u=>u.id===me?.id)
      if(i>=0){
        users[i].name=name
        localStorage.setItem('users', JSON.stringify(users))
      } 
    } catch{}
    
    const profiles = JSON.parse(localStorage.getItem('freelancerProfiles')||'[]')
    const idx = profiles.findIndex(p=>p.userId===me?.id)
    const next = { 
      ...(idx>=0?profiles[idx]:{}), 
      userId: me?.id, 
      skills, 
      rate, 
      bio,
      portfolioLink,
      linkedin,
      github,
      experience
    }
    if(idx>=0) profiles[idx]=next; else profiles.push(next)
    localStorage.setItem('freelancerProfiles', JSON.stringify(profiles))
    alert('Profile updated')
  }
  
  return (
    <Card title="Settings">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Skills</label><input className="input" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Node, UI/UX" /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Rate</label><input className="input" value={rate} onChange={e=>setRate(e.target.value)} placeholder="$20/hr" /></div>
        <div className="md:col-span-3"><label className="mb-1 block text-sm font-medium">Bio</label><textarea className="input" rows={4} value={bio} onChange={e=>setBio(e.target.value)} /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Portfolio Link</label><input className="input" value={portfolioLink} onChange={e=>setPortfolioLink(e.target.value)} placeholder="https://yourportfolio.com" /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">LinkedIn</label><input className="input" value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">GitHub</label><input className="input" value={github} onChange={e=>setGithub(e.target.value)} placeholder="https://github.com/username" /></div>
        <div className="md:col-span-3"><label className="mb-1 block text-sm font-medium">Experience</label><textarea className="input" rows={3} value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Years of experience and notable projects..." /></div>
      </div>
      <button className="mt-3 rounded-md bg-brand-600 px-3 py-2 text-white" onClick={save}>Save Changes</button>
    </Card>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-2 font-medium">{title}</h3>
      {children}
    </div>
  )
}

function Stat({ label, value, color = 'brand', suffix }) {
  const bg = color === 'accent' ? 'bg-accent-50 text-accent-700' : 'bg-brand-50 text-brand-700'
  return (
    <div className="flex items-center gap-5 rounded-xl border bg-white p-6 shadow-sm">
      <div className={`grid h-10 w-10 place-items-center rounded-full ${bg}`}>★</div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-2xl font-bold">{value}{suffix ? ` ${suffix}` : ''}</div>
      </div>
    </div>
  )
}

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.5rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);

