import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaFlag, FaUsers, FaStar, FaCalendarAlt, FaEnvelope, FaChartPie, FaSearchDollar, FaCog, FaUserCircle } from 'react-icons/fa'

function Stat({ icon, label, value, color = 'brand' }) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${color === 'accent' ? 'border-accent-200' : 'border-brand-200'}`}>
      <div className="flex items-center">
        <div className={`rounded-full p-2 ${color === 'accent' ? 'bg-accent-100 text-accent-600' : 'bg-brand-100 text-brand-600'}`}>
          {icon}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{label}</div>
          <div className="text-xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ activeKey, onSelect }) {
  const items = [
    { key: 'overview', label: 'Overview', icon: <FaChartPie /> },
    { key: 'milestones', label: 'Milestones', icon: <FaFlag /> },
    { key: 'team', label: 'Team', icon: <FaUsers /> },
    { key: 'settings', label: 'Settings', icon: <FaCog /> }
  ]

  return (
    <nav className="space-y-1">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${
            activeKey === item.key
              ? 'bg-brand-100 text-brand-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default function Entrepreneurs() {
  const [tab, setTab] = useState('overview');
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [investorInterest, setInvestorInterest] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const location = useLocation();
  const [investorInterest, setInvestorInterest] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [role, setRole] = useState('investor')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const location = useLocation()

  function getProfile() {
    try {
      const me = getCurrentUser()
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
      return profiles.find(p => p.userId === me?.id) || {}
    } catch {
      return {}
    }
  }

  useEffect(() => {
    try {
      const storedMilestones = JSON.parse(localStorage.getItem('milestones') || '[]');
      const storedTeam = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      const storedReviews = JSON.parse(localStorage.getItem('peerReviews') || '[]');
      setMilestones(storedMilestones);
      setTeam(storedTeam);
      setReviews(storedReviews);
      setInvestorInterest(0);
      setMessagesCount(0);
    } catch (error) {
      console.error('Error loading data:', error);
      setMilestones([]);
      setTeam([]);
      setReviews([]);
      setInvestorInterest(0);
      setMessagesCount(0);
    }
  }, [])

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0
    return (reviews.reduce((a, b) => a + (+b.rating || 0), 0) / reviews.length).toFixed(2)
  }, [reviews])

  function addReview() {
    if (!rating) return
    const me = getCurrentUser()
    const next = [...reviews, { id: Date.now().toString(), role, rating: +rating, comment, toUserId: me?.id, createdAt: new Date().toISOString() }]
    setReviews(next)
    localStorage.setItem('peerReviews', JSON.stringify(next))
    setComment('')
  }

  // initialize from URL hash (e.g., #tab=messages)
  useEffect(() => {
    const m = /tab=([a-z]+)/i.exec(window.location.hash || '')
    if (m) setTab(m[1])
  }, [])

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your startup journey and connect with potential team members.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Stat icon={<FaStar />} label="Investor Interest" value={investorInterest} color="brand" />
        <Stat icon={<FaFlag />} label="Active Milestones" value={milestones.length} color="accent" />
        <Stat icon={<FaUsers />} label="Team Members" value={team.length} color="brand" />
        <Stat icon={<FaEnvelope />} label="Messages" value={messagesCount} color="accent" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Sidebar activeKey={tab} onSelect={(k)=>{ setTab(k); const h = `#tab=${k}`; if (window.location.hash !== h) window.location.hash = h }} />
        <div className="rounded-lg border bg-white p-6">

          {tab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Startup Overview</h2>
              <div className="prose prose-sm">
                <p>Welcome to your startup dashboard! Here you can:</p>
                <ul>
                  <li>Track your startup's progress and milestones</li>
                  <li>Manage your team and find new talent</li>
                  <li>Connect with potential investors</li>
                  <li>Access resources and tools for growth</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'milestones' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Milestones</h2>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-medium">{milestone.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{milestone.description}</div>
                  </div>
                ))}
                {milestones.length === 0 && (
                  <p className="text-gray-500">No milestones added yet. Add your first milestone to track progress.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'team' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
              <div className="space-y-4">
                {team.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{member.skills}</div>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-gray-500">No team members yet. Start building your team!</p>
                )}
              </div>
            </div>
          )}
      )}

      {tab==='reviews' && (
        <div className="mt-4">
          <Card title={`Community Reviews (avg ${avg})`}>
            <div className="grid gap-2 sm:grid-cols-3">
              <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="investor">Investor</option>
                <option value="freelancer">Freelancer</option>
              </select>
              <select className="input" value={rating} onChange={e=>setRating(e.target.value)}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button className="btn" onClick={addReview}>Add</button>
            </div>
            <textarea className="input mt-2" rows="2" placeholder="Comment (optional)" value={comment} onChange={e=>setComment(e.target.value)} />
            <ul className="mt-3 space-y-2 text-sm">
              {reviews.slice(-10).reverse().map(r => (
                <li key={r.id} className="rounded-md border p-2">
                  <div className="flex items-center justify-between"><span className="font-medium capitalize">{r.role}</span><span>{'★'.repeat(r.rating)}</span></div>
                  {r.comment && <div className="text-gray-700">{r.comment}</div>}
                </li>
              ))}
              {reviews.length === 0 && <li className="text-gray-700">No reviews yet.</li>}
            </ul>
          </Card>
        </div>
      )}
      {tab==='pitch' && (
        <div className="mt-4">
          <PitchNetworking />
        </div>
      )}
      {tab==='messages' && (
        <div className="mt-4">
          <MessagesChat />
        </div>
      )}
      {tab==='analytics' && (
        <div className="mt-4">
          <AnalyticsPanel milestones={milestones} team={team} interest={investorInterest} messages={messagesCount} />
        </div>
      )}
      {tab==='investors' && (
        <div className="mt-4">
          <InvestorsList />
        </div>
      )}
      {tab==='freelancers' && (
        <div className="mt-4">
          <FreelancersList />
        </div>
      )}
      {tab==='settings' && (
        <div className="mt-4">
          <SettingsPanel />
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

function StartupSummary() {
  const me = getCurrentUser()
  const profile = (()=>{
    try {
      return (JSON.parse(localStorage.getItem('entrepreneurProfiles')||'[]')||[]).find(p=>p.userId===me?.id) || {}
    } catch { return {} }
  })()
  const hasStartup = profile && (profile.startupName || profile.domain || profile.ideaSummary)
  return (
    <Card title="Startup Profile">
      {hasStartup ? (
        <div className="space-y-3 text-[15px] text-gray-800">
          {profile.startupName && (
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-600">Startup Name</div>
              <div className="truncate pl-3 text-gray-900">{profile.startupName}</div>
            </div>
          )}
          {profile.domain && (
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-600">Domain</div>
              <span className="ml-3 rounded-full bg-brand-50 px-3 py-1 text-brand-700">{profile.domain}</span>
            </div>
          )}
          {profile.ideaSummary && (
            <div>
              <div className="mb-1 font-medium text-gray-600">Idea Summary</div>
              <p className="whitespace-pre-line rounded-md border bg-gray-50 p-3 text-gray-900">{profile.ideaSummary}</p>
            </div>
          )}
          {/* Edit button removed as requested */}
        </div>
      ) : (
        <div className="flex items-center justify-between text-[15px] text-gray-700">
          <span>No startup details yet.</span>
          <Link to="/startup-profile" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Add Startup</Link>
        </div>
      )}
    </Card>
  )
}
function MessagesChat() {
  const me = getCurrentUser()
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [thread, setThread] = useState([])
  const [module, setModule] = useState('all') // 'all', 'investor', 'freelancer'
  const users = (()=>{ try { return JSON.parse(localStorage.getItem('users')||'[]') } catch { return [] } })()
  
  useEffect(()=>{ load() },[to, module])
  
  function load(){
    try {
      const all = JSON.parse(localStorage.getItem('messages')||'[]')
      let filtered = all.filter(m=> (m.toId===me?.id && m.fromId===to) || (m.fromId===me?.id && m.toId===to))
      
      // Filter by module if specified
      if (module !== 'all' && to) {
        const recipient = users.find(u => u.id === to)
        if (recipient) {
          if (module === 'investor' && recipient.role !== 'investor') filtered = []
          if (module === 'freelancer' && recipient.role !== 'freelancer') filtered = []
        }
      }
      
      setThread(filtered)
    } catch { setThread([]) }
  }
  
  function send(){
    if(!me||!to||!text) return
    const all = JSON.parse(localStorage.getItem('messages')||'[]')
    const recipient = users.find(u => u.id === to)
    all.push({ 
      id: Date.now().toString(), 
      fromId: me.id, 
      toId: to, 
      text, 
      at: new Date().toISOString(),
      module: recipient?.role || 'all'
    })
    localStorage.setItem('messages', JSON.stringify(all))
    setText('')
    load()
  }
  
  const filteredUsers = users.filter(u => {
    if (u.id === me?.id) return false
    if (module === 'all') return u.role === 'investor' || u.role === 'freelancer'
    if (module === 'investor') return u.role === 'investor'
    if (module === 'freelancer') return u.role === 'freelancer'
    return false
  })
  
  return (
    <Card title="Messages">
      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium">Filter by Module</label>
        <select className="input" value={module} onChange={e=>{setModule(e.target.value); setTo('')}}>
          <option value="all">All Modules</option>
          <option value="investor">Investors Only</option>
          <option value="freelancer">Freelancers Only</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select className="input" value={to} onChange={e=>setTo(e.target.value)}>
          <option value="">Select recipient</option>
          {filteredUsers.map(u=> (
            <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 h-40 overflow-auto rounded border bg-gray-50 p-2 text-sm">
        {thread.map(m=> (
          <div key={m.id} className={`mb-2 ${m.fromId===me?.id?'text-right':''}`}>
            <span className={`inline-block rounded px-2 py-1 ${m.fromId===me?.id?'bg-brand-600 text-white':'bg-white border'}`}>{m.text}</span>
          </div>
        ))}
        {thread.length===0 && <div className="text-gray-600">No messages.</div>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input className="input" placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} />
        <button className="rounded-md bg-brand-600 px-3 py-2 text-white" onClick={send}>Send</button>
      </div>
    </Card>
  )
}

function AnalyticsPanel({ milestones, team, interest, messages }) {
  const series = [
    { label: 'Milestones', value: milestones.length },
    { label: 'Team', value: team.length },
    { label: 'Interest', value: interest },
    { label: 'Messages', value: messages },
  ]
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

function MilestonesEditor({ onChange }) {
  const me = getCurrentUser()
  const [list, setList] = useState(()=>{ try { return (JSON.parse(localStorage.getItem('milestones')||'[]')||[]).filter(m=>m.userId===me?.id) } catch { return [] } })
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  function add() {
    if(!date||!desc) return
    const all = JSON.parse(localStorage.getItem('milestones')||'[]')
    const item = { id: Date.now().toString(), date, description: desc, userId: me?.id }
    all.push(item)
    localStorage.setItem('milestones', JSON.stringify(all))
    const next = all.filter(m=>m.userId===me?.id)
    setList(next)
    onChange && onChange(next)
    setDate(''); setDesc('')
  }
  return (
    <div>
      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <input className="input" placeholder="Milestone description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button className="rounded-md bg-brand-600 px-3 py-2 text-white" onClick={add}>Add Milestone</button>
      </div>
      <ul className="list-disc pl-5 text-sm text-gray-700">
        {list.slice().reverse().map(m => (
          <li key={m.id}>{new Date(m.date).toLocaleDateString()} — {m.description}</li>
        ))}
        {list.length===0 && <li>No milestones yet.</li>}
      </ul>
    </div>
  )
}

function InvestorsList() {
  const me = getCurrentUser()
  const [loading, setLoading] = useState(false)
  const [matchedInvestors, setMatchedInvestors] = useState([])
  const profile = (()=>{ try { return (JSON.parse(localStorage.getItem('entrepreneurProfiles')||'[]')||[]).find(p=>p.userId===me?.id) || {} } catch { return {} } })()
  const domain = (profile.domain || '').toLowerCase()
  const ideaSummary = (profile.ideaSummary || '').toLowerCase()
  
  useEffect(() => {
    async function fetchAIMatches() {
      if (!domain && !ideaSummary) return
      setLoading(true)
      try {
        const { api } = await import('../lib/api')
        const response = await api.post('/ai/match-investors', {
          domain: profile.domain || '',
          skills: '',
          ideaSummary: profile.ideaSummary || ''
        })
        if (response.data?.matches) {
          // Merge with actual user data
          const allUsers = (()=>{ try { return JSON.parse(localStorage.getItem('users')||'[]') } catch { return [] } })()
          const investors = allUsers.filter(u=>u.role==='investor')
          const investorProfiles = (()=>{ try { return JSON.parse(localStorage.getItem('investorProfiles')||'[]') } catch { return [] } })()
          
          const merged = response.data.matches.map(match => {
            const user = investors.find(u => u.name === match.name || u.id === match.id)
            const investorProfile = investorProfiles.find(p => p.userId === user?.id)
            return {
              ...user,
              ...investorProfile,
              ...match,
              score: match.score || 0.5
            }
          })
          
          // Also include local investors with domain matching
          const localRanked = investors.map(u => {
            const invProfile = investorProfiles.find(p => p.userId === u.id) || {}
            const invDomain = (invProfile.domain || '').toLowerCase()
            let score = 0.5
            if (domain && invDomain.includes(domain)) score = 0.9
            else if (domain && invDomain) score = 0.7
            return {...u, ...invProfile, score}
          }).filter(inv => !merged.find(m => m.id === inv.id))
          
          setMatchedInvestors([...merged, ...localRanked].sort((a,b)=> (b.score || 0) - (a.score || 0)))
        }
      } catch (error) {
        console.error('AI matching error:', error)
        // Fallback to local matching
        const allUsers = (()=>{ try { return JSON.parse(localStorage.getItem('users')||'[]') } catch { return [] } })()
        const investors = allUsers.filter(u=>u.role==='investor')
        const investorProfiles = (()=>{ try { return JSON.parse(localStorage.getItem('investorProfiles')||'[]') } catch { return [] } })()
        const ranked = investors.map(u=> {
          const invProfile = investorProfiles.find(p => p.userId === u.id) || {}
          const invDomain = (invProfile.domain || '').toLowerCase()
          return {...u, ...invProfile, score: domain && invDomain.includes(domain) ? 0.9 : 0.5}
        }).sort((a,b)=> (b.score || 0) - (a.score || 0))
        setMatchedInvestors(ranked)
      } finally {
        setLoading(false)
      }
    }
    fetchAIMatches()
  }, [domain, ideaSummary])
  
  return (
    <Card title="Investors (AI Matched by Domain/Skills)">
      {loading ? (
        <div className="text-sm text-gray-600 py-4 text-center">Loading AI matches...</div>
      ) : matchedInvestors.length === 0 ? (
        <div className="text-sm text-gray-600 py-4 text-center">No investors found. Add your startup domain to get better matches.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {matchedInvestors.map(inv => (
            <div key={inv.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <div>
                <div className="font-medium">{inv.name}</div>
                <div className="text-gray-600">Domain: {inv.domain || 'General'}</div>
                {inv.score && (
                  <div className="text-xs text-green-600 mt-1">Match Score: {(inv.score * 100).toFixed(0)}%</div>
                )}
              </div>
              <button className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">Request Intro</button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function SettingsPanel() {
  const me = getCurrentUser()
  const [name, setName] = useState(me?.name || '')
  const [domain, setDomain] = useState('')
  const [idea, setIdea] = useState('')
  useEffect(()=>{
    try {
      const p = (JSON.parse(localStorage.getItem('entrepreneurProfiles')||'[]')||[]).find(p=>p.userId===me?.id)
      if (p) { setDomain(p.domain || ''); setIdea(p.ideaSummary || '') }
    } catch {}
  },[])

  function save(){
    // update users
    try {
      const users = JSON.parse(localStorage.getItem('users')||'[]')
      const i = users.findIndex(u=>u.id===me?.id)
      if (i>=0) { users[i].name = name; localStorage.setItem('users', JSON.stringify(users)) }
    } catch {}
    // update entrepreneur profile
    const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
    const idx = profiles.findIndex(p => p.userId === me?.id)
    const next = { ...(idx>=0?profiles[idx]:{}), userId: me?.id, domain, ideaSummary: idea, startupName: (profiles[idx]?.startupName||'') }
    if (idx>=0) profiles[idx]=next; else profiles.push(next)
    localStorage.setItem('entrepreneurProfiles', JSON.stringify(profiles))
    alert('Profile updated')
  }
  return (
    <Card title="Settings">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Domain/Industry</label>
          <input className="input" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. Fintech" />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block text-sm font-medium">Idea Summary</label>
          <textarea className="input" rows={4} value={idea} onChange={e=>setIdea(e.target.value)} />
        </div>
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

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.5rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);

// Top tabs removed to avoid duplication; sidebar is the sole navigation.

function Stat({ icon, label, value, color = 'brand', suffix }) {
  const bg = color === 'accent' ? 'bg-accent-50 text-accent-700' : 'bg-brand-50 text-brand-700'
  return (
    <div className="flex items-center gap-5 rounded-xl border bg-white p-6 shadow-sm">
      <div className={`grid h-10 w-10 place-items-center rounded-full ${bg}`}>{icon}</div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-2xl font-bold">{value}{suffix ? ` ${suffix}` : ''}</div>
      </div>
    </div>
  )
}

function AIMatchDomains() {
  const profile = (()=>{
    try {
      const me = getCurrentUser()
      const p = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]').find(p=>p.userId===me?.id)
      return p || {}
    } catch { return {} }
  })()
  const base = (profile.domain || '').toLowerCase()
  const users = (()=>{ try { return JSON.parse(localStorage.getItem('users')||'[]') } catch { return [] } })()
  const investors = users.filter(u=>u.role==='investor').map(u=> ({
    id: u.id,
    name: u.name,
    domain: (u.domain || 'General'),
    score: base && (u.domain||'').toLowerCase().includes(base) ? 2 : 1
  })).sort((a,b)=> b.score - a.score)
  return (
    <div className="mb-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold text-gray-600">AI Recommended Investors</div>
      {investors.length===0 && <div className="text-sm text-gray-600">No investors yet.</div>}
      <ul className="grid gap-2 md:grid-cols-2">
        {investors.slice(0,6).map(inv => (
          <li key={inv.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
            <div>
              <div className="font-medium">{inv.name}</div>
              <div className="text-gray-600">Domain: {inv.domain}</div>
            </div>
            <button className="rounded-md bg-brand-600 px-3 py-1 text-white hover:bg-brand-700">Connect</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Sidebar({ activeKey, onSelect }) {
  const NavItem = ({ keyId, label, icon }) => (
    <button onClick={()=>onSelect(keyId)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[15px] ${activeKey===keyId?'bg-brand-50 text-brand-700':'text-gray-700 hover:bg-gray-100'}`}>
      <span className="text-brand-700">{icon}</span>
      <span>{label}</span>
    </button>
  )
  return (
    <aside className="sticky top-20 h-max self-start rounded-xl border bg-white p-3 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Navigation</div>
      <nav className="flex flex-col gap-1">
        <NavItem keyId="overview" label="Dashboard" icon={<FaUserCircle />} />
        <NavItem keyId="freelancers" label="Find Freelancers" icon={<FaUsers />} />
        <NavItem keyId="pitch" label="Pitch Events" icon={<FaCalendarAlt />} />
        <NavItem keyId="messages" label="Messages" icon={<FaEnvelope />} />
        <NavItem keyId="analytics" label="Analytics" icon={<FaChartPie />} />
        <NavItem keyId="investors" label="Find Investors" icon={<FaSearchDollar />} />
        <NavItem keyId="settings" label="Settings" icon={<FaCog />} />
      </nav>
    </aside>
  )
}

function Header({ profile, milestones }) {
  const user = getCurrentUser()
  const name = user?.name || 'Entrepreneur'
  const ekyc = profile?.aadhaarVerification?.status || 'unverified'
  // Recommendation-based progress:
  // Idea Validation -> 25%, MVP -> 50%, Investor Pitch -> 75%, Funded -> 100%
  const text = (milestones || []).map(m => (m.description || '').toLowerCase()).join(' ')
  let progress = 0
  if (/funded/.test(text)) progress = 100
  else if (/pitch|investor pitch/.test(text)) progress = 75
  else if (/mvp/.test(text)) progress = 50
  else if (/idea|validation/.test(text)) progress = 25
  // small boost for verified identity
  if (ekyc === 'verified' && progress < 100) progress = Math.min(100, progress + 5)
  const badgeColor = ekyc === 'verified' ? 'bg-green-100 text-green-700' : ekyc === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
  const badgeText = ekyc === 'verified' ? 'eKYC Verified' : ekyc === 'pending' ? 'eKYC Pending' : 'eKYC Unverified'
  return (
    <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-3xl text-gray-500"><FaUserCircle /></div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold">{name}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeColor}`}>{badgeText}</span>
            {(() => {
              const hasStartup = profile && (profile.startupName || profile.domain || profile.ideaSummary)
              return hasStartup ? (
                <button disabled className="ml-auto inline-flex rounded-md bg-gray-400 px-3 py-1.5 text-sm text-white cursor-not-allowed opacity-50">Startup Added</button>
              ) : (
                <Link to="/startup-profile" className="ml-auto inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700">Add Startup</Link>
              )
            })()}
          </div>
          <div className="mt-2">
            <div className="mb-1 text-sm text-gray-600">Funding Progress</div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div className="h-3 rounded-full bg-brand-600" style={{width: `${progress}%`}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PitchNetworking() {
  const me = getCurrentUser()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [pitchDeckFile, setPitchDeckFile] = useState(null)
  const [pitchDeckUrl, setPitchDeckUrl] = useState('')
  
  const events = (()=>{
    try { return JSON.parse(localStorage.getItem('pitchEvents')||'[]') } catch { return [] }
  })().filter(e=>!me || e.entrepreneurId===me.id || !e.entrepreneurId)
  
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const registeredDates = new Set(events.filter(e=>e.registered).map(e=>new Date(e.date).getDate()))
  const cells = Array.from({length: startDay + daysInMonth}, (_,i)=> i<startDay?null:i-startDay+1)
  
  function handleRegister(event) {
    setSelectedEvent(event)
    setShowRegisterModal(true)
  }
  
  function submitRegistration() {
    if (!selectedEvent) return
    const allEvents = JSON.parse(localStorage.getItem('pitchEvents') || '[]')
    const eventIndex = allEvents.findIndex(e => e.id === selectedEvent.id)
    if (eventIndex >= 0) {
      allEvents[eventIndex] = {
        ...allEvents[eventIndex],
        registered: true,
        pitchDeckUrl: pitchDeckUrl || (pitchDeckFile ? URL.createObjectURL(pitchDeckFile) : null),
        registeredBy: me?.id,
        registeredAt: new Date().toISOString()
      }
      localStorage.setItem('pitchEvents', JSON.stringify(allEvents))
      alert('Successfully registered for pitch event!')
      setShowRegisterModal(false)
      setPitchDeckFile(null)
      setPitchDeckUrl('')
      window.location.reload()
    }
  }
  
  return (
    <>
    <Card title="Pitch Events & Networking">
      <div className="mb-3 flex justify-between">
        <div className="text-sm text-gray-700">Upcoming events</div>
        <AddPitchEventButton />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          {events.length===0 && <div className="text-gray-600">No upcoming events.</div>}
          {events.map(e=> (
            <div key={e.id} className="rounded-md border p-3">
              <div className="font-medium">{e.title || 'Pitch Event'}</div>
              <div className="text-gray-600">{new Date(e.date).toLocaleString()}</div>
              {e.pitchDeckUrl && (
                <div className="mt-2">
                  <a href={e.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                    View Pitch Deck →
                  </a>
                </div>
              )}
              {!e.registered && (
                <button 
                  onClick={() => handleRegister(e)}
                  className="mt-2 rounded-md bg-brand-600 px-3 py-1 text-xs text-white hover:bg-brand-700"
                >
                  Register & Add Pitch Deck
                </button>
              )}
              {e.registered && (
                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                  Registered
                </span>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">{today.toLocaleString('default',{month:'long'})} {year}</div>
          <div className="grid grid-cols-7 gap-1">
            {[...'SMTWTFS'].map((c,i)=>(<div key={i} className="text-center text-xs text-gray-500">{c}</div>))}
            {cells.map((d,i)=> (
              <div key={i} className={`h-8 rounded-md text-center text-sm leading-8 ${d? (registeredDates.has(d)?'bg-blue-200 text-blue-900':'bg-gray-100 text-gray-700') : ''}`}>{d||''}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
    
    {showRegisterModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowRegisterModal(false)}>
        <div className="relative w-full max-w-md rounded-xl border bg-white p-6 shadow-lg" onClick={e => e.stopPropagation()}>
          <h3 className="mb-4 text-lg font-semibold">Register for {selectedEvent?.title}</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Pitch Deck URL (optional)</label>
              <input 
                className="input" 
                placeholder="https://..." 
                value={pitchDeckUrl}
                onChange={e => setPitchDeckUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Or Upload Pitch Deck</label>
              <input 
                type="file" 
                accept=".pdf,.ppt,.pptx" 
                className="input"
                onChange={e => setPitchDeckFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowRegisterModal(false)} className="rounded-md bg-gray-200 px-4 py-2 text-gray-700">Cancel</button>
            <button onClick={submitRegistration} className="rounded-md bg-brand-600 px-4 py-2 text-white">Register</button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function AddPitchEventButton() {
  const me = getCurrentUser()
  function add() {
    const title = prompt('Event title?')
    const date = prompt('Event date (YYYY-MM-DD HH:mm)?')
    if (!title || !date) return
    const events = JSON.parse(localStorage.getItem('pitchEvents') || '[]')
    events.push({ id: Date.now().toString(), title, date, registered: true, entrepreneurId: me?.id })
    localStorage.setItem('pitchEvents', JSON.stringify(events))
    alert('Event added!')
    // force refresh
    window.location.reload()
  }
  return <button className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700" onClick={add}>Add Event</button>
}

function FreelancersList() {
  const me = getCurrentUser()
  const [applications, setApplications] = useState([])
  const [searchDomain, setSearchDomain] = useState('')
  const [searchSkills, setSearchSkills] = useState('')
  
  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('applications') || '[]')
      const myProfile = (() => {
        try {
          const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
          return profiles.find(p => p.userId === me?.id) || {}
        } catch {
          return {}
        }
      })()
      const myStartup = myProfile.startupName
      if (myStartup) {
        setApplications(all.filter(a => a.startup === myStartup))
      }
    } catch {
      setApplications([])
    }
  }, [])

  const users = (() => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]')
    } catch {
      return []
    }
  })()
  
  const profiles = (() => {
    try {
      return JSON.parse(localStorage.getItem('freelancerProfiles') || '[]')
    } catch {
      return []
    }
  })()

  const portfolios = (() => {
    try {
      return JSON.parse(localStorage.getItem('portfolio') || '[]')
    } catch {
      return []
    }
  })()

  // Get entrepreneur's domain for matching
  const entrepreneurProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]').find(p => p.userId === me?.id) || {}
    } catch {
      return {}
    }
  })()

  const allFreelancers = users
    .filter(u => u.role === 'freelancer')
    .map(u => {
      const profile = profiles.find(p => p.userId === u.id) || {}
      const userPortfolio = portfolios.filter(p => p.userId === u.id)
      return {
        ...u,
        ...profile,
        portfolio: userPortfolio
      }
    })
    .filter(f => f.skills || f.rate || f.bio || f.portfolioLink || f.portfolio.length > 0)

  // Match freelancers by domain or skills
  const freelancers = allFreelancers.map(f => {
    let matchScore = 0
    const entrepreneurDomain = (entrepreneurProfile.domain || '').toLowerCase()
    const freelancerSkills = (f.skills || '').toLowerCase()
    const freelancerPortfolio = (f.portfolio || []).map(p => (p.stack || '').toLowerCase()).join(' ')
    
    // Check domain match
    if (entrepreneurDomain && freelancerSkills.includes(entrepreneurDomain)) {
      matchScore += 3
    }
    if (entrepreneurDomain && freelancerPortfolio.includes(entrepreneurDomain)) {
      matchScore += 2
    }
    
    // Check skills match
    if (searchSkills) {
      const searchSkillsLower = searchSkills.toLowerCase().split(',').map(s => s.trim())
      searchSkillsLower.forEach(skill => {
        if (freelancerSkills.includes(skill)) matchScore += 2
        if (freelancerPortfolio.includes(skill)) matchScore += 1
      })
    }
    
    // Check domain search
    if (searchDomain) {
      const searchDomainLower = searchDomain.toLowerCase()
      if (freelancerSkills.includes(searchDomainLower)) matchScore += 2
      if (freelancerPortfolio.includes(searchDomainLower)) matchScore += 1
    }
    
    return { ...f, matchScore }
  }).sort((a, b) => b.matchScore - a.matchScore)

  function updateApplicationStatus(applicationId, status) {
    const all = JSON.parse(localStorage.getItem('applications') || '[]')
    const idx = all.findIndex(a => a.id === applicationId)
    if (idx >= 0) {
      all[idx].status = status
      localStorage.setItem('applications', JSON.stringify(all))
      const myProfile = (() => {
        try {
          const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
          return profiles.find(p => p.userId === me?.id) || {}
        } catch {
          return {}
        }
      })()
      const myStartup = myProfile.startupName
      if (myStartup) {
        setApplications(all.filter(a => a.startup === myStartup))
      }
    }
  }

  return (
    <div>
      <Card title="Find Freelancers (Matched by Skills/Domain)">
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Search by Domain</label>
            <input 
              className="input" 
              placeholder="e.g. Fintech, SaaS" 
              value={searchDomain}
              onChange={e => setSearchDomain(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Search by Skills</label>
            <input 
              className="input" 
              placeholder="e.g. React, Node.js, Python" 
              value={searchSkills}
              onChange={e => setSearchSkills(e.target.value)}
            />
          </div>
        </div>
        {freelancers.length === 0 ? (
          <div className="text-sm text-gray-600 py-4 text-center">No freelancers with complete profiles yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {freelancers.map(f => (
              <div key={f.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg text-gray-900">{f.name || 'Freelancer'}</div>
                    {f.matchScore > 0 && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Match: {f.matchScore}
                      </span>
                    )}
                  </div>
                  {f.skills && (
                    <div className="text-sm text-gray-600 mt-1">Skills: {f.skills}</div>
                  )}
                  {f.rate && (
                    <div className="inline-block mt-2 px-2 py-1 rounded bg-brand-50 text-brand-700 text-sm font-medium">
                      {f.rate}
                    </div>
                  )}
                </div>
                
                {f.bio && (
                  <div className="text-sm text-gray-700 mb-3 line-clamp-3">{f.bio}</div>
                )}
                
                {f.experience && (
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium">Experience:</div>
                    <div className="mt-1">{f.experience}</div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {f.portfolioLink && (
                    <a href={f.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                      Portfolio →
                    </a>
                  )}
                  {f.linkedin && (
                    <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                      LinkedIn →
                    </a>
                  )}
                  {f.github && (
                    <a href={f.github} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                      GitHub →
                    </a>
                  )}
                </div>

                {f.portfolio && f.portfolio.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Portfolio Items ({f.portfolio.length}):</div>
                    <div className="space-y-1">
                      {f.portfolio.slice(0, 3).map(p => (
                        <div key={p.id} className="text-xs text-gray-700">
                          • {p.title} ({p.stack})
                        </div>
                      ))}
                      {f.portfolio.length > 3 && (
                        <div className="text-xs text-gray-500">+{f.portfolio.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    const role = prompt('What role/position are you hiring for?')
                    if (!role) return
                    const me = getCurrentUser()
                    const myProfile = (() => {
                      try {
                        const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
                        return profiles.find(p => p.userId === me?.id) || {}
                      } catch {
                        return {}
                      }
                    })()
                    const startupName = myProfile.startupName || 'My Startup'
                    alert(`You can contact ${f.name} via Messages to discuss the ${role} position.`)
                  }}
                  className="w-full mt-3 rounded-md bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-700"
                >
                  Contact for Role
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {applications.length > 0 && (
        <Card title="Applications to My Startup" className="mt-6">
          <div className="space-y-3">
            {applications.map(a => {
              const applicant = users.find(u => u.id === a.userId)
              const applicantProfile = profiles.find(p => p.userId === a.userId) || {}
              return (
                <div key={a.id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{applicant?.name || 'Freelancer'}</div>
                      <div className="text-sm text-gray-600 mt-1">Role: {a.role}</div>
                      {a.message && (
                        <div className="text-sm text-gray-700 mt-2">{a.message}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">Applied: {new Date(a.createdAt).toLocaleDateString()}</div>
                      <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                        a.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        a.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </div>
                    </div>
                    {a.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => updateApplicationStatus(a.id, 'accepted')}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateApplicationStatus(a.id, 'rejected')}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

