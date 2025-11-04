import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getUsers } from '../lib/session'
import { FaDollarSign, FaHandshake, FaCalendarAlt, FaChartLine, FaBuilding, FaCog, FaEnvelope, FaStar } from 'react-icons/fa'

export default function Investors() {
  const [tab, setTab] = useState('overview')
  const [deals, setDeals] = useState([])
  const [meetings, setMeetings] = useState([])
  const [startups, setStartups] = useState([])
  const [messagesCount, setMessagesCount] = useState(0)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const me = getCurrentUser()
    try {
      const allDeals = JSON.parse(localStorage.getItem('deals') || '[]')
      const allMeetings = JSON.parse(localStorage.getItem('meetings') || '[]')
      const allMessages = JSON.parse(localStorage.getItem('messages') || '[]')
      const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
      const users = getUsers()
      const entrepreneurs = users.filter(u => u.role === 'entrepreneur')
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
      
      if (me) {
        setDeals(allDeals.filter(d => d.investorId === me.id))
        setMeetings(allMeetings.filter(m => m.investorId === me.id))
        setMessagesCount(allMessages.filter(mm => mm.toId === me.id || mm.fromId === me.id).length)
        setReviews(allReviews.filter(r => r.toUserId === me.id))
        setStartups(entrepreneurs.map(e => {
          const profile = profiles.find(p => p.userId === e.id)
          return { ...e, startupName: profile?.startupName || 'Startup', domain: profile?.domain || '' }
        }))
      } else {
        setDeals([])
        setMeetings([])
        setMessagesCount(0)
        setReviews([])
        setStartups([])
      }
    } catch {
      setDeals([])
      setMeetings([])
      setMessagesCount(0)
      setReviews([])
      setStartups([])
    }
  }, [])

  useEffect(() => {
    const m = /tab=([a-z]+)/i.exec(window.location.hash || '')
    if (m) setTab(m[1])
  }, [])

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return (reviews.reduce((a, b) => a + (+b.rating || 0), 0) / reviews.length).toFixed(2)
  }, [reviews])

  const totalInvested = useMemo(() => {
    return deals.filter(d => d.status === 'completed').reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  }, [deals])

  return (
    <div className="mx-auto max-w-7xl p-8 text-[16px]">
      <HeaderInvestor />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Stat icon={<FaDollarSign />} label="Total Invested" value={`$${totalInvested.toLocaleString()}`} color="brand" />
        <Stat icon={<FaHandshake />} label="Active Deals" value={deals.filter(d => d.status === 'active' || d.status === 'pending').length} color="accent" />
        <Stat icon={<FaEnvelope />} label="Messages" value={messagesCount} />
        <Stat icon={<FaStar />} label="Avg Rating" value={avgRating} suffix="/5" color="accent" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <SidebarInvestor activeKey={tab} onSelect={(k)=>{ setTab(k); const h = `#tab=${k}`; if (window.location.hash !== h) window.location.hash = h }} />
        <div>
          {tab==='overview' && (
            <div className="mt-6 flex justify-center"><div className="w-full max-w-3xl"><ProfileSummary /></div></div>
          )}
          {tab==='startups' && (
            <StartupsList startups={startups} />
          )}
          {tab==='deals' && (
            <DealsManager deals={deals} setDeals={setDeals} />
          )}
          {tab==='meetings' && (
            <MeetingsManager meetings={meetings} setMeetings={setMeetings} />
          )}
          {tab==='pitch' && (
            <PitchEventsManager />
          )}
          {tab==='messages' && (<MessagesChat />)}
          {tab==='analytics' && (<AnalyticsPanel deals={deals} meetings={meetings} startups={startups.length} />)}
          {tab==='settings' && (<SettingsInvestor />)}
        </div>
      </div>
    </div>
  )
}

function HeaderInvestor() {
  const me = getCurrentUser()
  const name = me?.name || 'Investor'
  return (
    <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-3xl text-gray-500">💼</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{name}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarInvestor({ activeKey, onSelect }) {
  const Item = ({ id, label, icon }) => (
    <button onClick={()=>onSelect(id)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[15px] ${activeKey===id?'bg-brand-50 text-brand-700':'text-gray-700 hover:bg-gray-100'}`}>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  )
  return (
    <aside className="sticky top-20 h-max self-start rounded-xl border bg-white p-3 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Navigation</div>
      <nav className="flex flex-col gap-1">
        <Item id="overview" label="Dashboard" />
        <Item id="startups" label="Startups" />
        <Item id="deals" label="Deals" />
        <Item id="meetings" label="Meetings" />
        <Item id="pitch" label="Pitch Events" icon={<FaCalendarAlt />} />
        <Item id="messages" label="Messages" />
        <Item id="analytics" label="Analytics" />
        <Item id="settings" label="Settings" />
      </nav>
    </aside>
  )
}

function ProfileSummary() {
  const me = getCurrentUser()
  const profile = (()=>{ 
    try { 
      return (JSON.parse(localStorage.getItem('investorProfiles')||'[]')||[]).find(p=>p.userId===me?.id) || {} 
    } catch { return {} } 
  })()
  return (
    <Card title="Investor Profile">
      {profile && (profile.name || profile.domain || profile.focus || profile.checkSize || profile.bio) ? (
        <div className="space-y-3 text-[15px] text-gray-800">
          {profile.name && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Name</div><div className="pl-3 text-gray-900 font-semibold">{profile.name}</div></div>}
          {profile.domain && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Domain/Industry</div><span className="ml-3 rounded-full bg-brand-50 px-3 py-1 text-brand-700">{profile.domain}</span></div>}
          {profile.focus && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Investment Focus</div><div className="pl-3 text-gray-900">{profile.focus}</div></div>}
          {profile.checkSize && <div className="flex items-center justify-between"><div className="font-medium text-gray-600">Typical Check Size</div><div className="pl-3 text-gray-900">{profile.checkSize}</div></div>}
          {profile.bio && (<div><div className="mb-1 font-medium text-gray-600">Bio</div><p className="whitespace-pre-line rounded-md border bg-gray-50 p-3 text-gray-900">{profile.bio}</p></div>)}
        </div>
      ) : (
        <div className="text-[15px] text-gray-700">No profile yet. Update it in Settings.</div>
      )}
    </Card>
  )
}

function StartupsList({ startups }) {
  const me = getCurrentUser()
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [matchedStartups, setMatchedStartups] = useState([])
  const profile = (()=>{ 
    try { 
      return (JSON.parse(localStorage.getItem('investorProfiles')||'[]')||[]).find(p=>p.userId===me?.id) || {} 
    } catch { return {} } 
  })()
  const investorDomain = (profile.domain || '').toLowerCase()
  const investorFocus = (profile.focus || '').toLowerCase()
  
  useEffect(() => {
    async function fetchAIMatches() {
      if (!investorDomain && !investorFocus) {
        // Fallback to local matching
        const ranked = startups.map(s => ({
          ...s,
          score: investorDomain && (s.domain || '').toLowerCase().includes(investorDomain) ? 0.9 : 0.5
        })).sort((a, b) => b.score - a.score)
        setMatchedStartups(ranked)
        return
      }
      
      setLoading(true)
      try {
        const { api } = await import('../lib/api')
        const response = await api.post('/ai/match-startups', {
          domain: profile.domain || '',
          focus: profile.focus || ''
        })
        if (response.data?.matches) {
          // Merge with actual startup data
          const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
          const merged = startups.map(startup => {
            const startupProfile = profiles.find(p => p.userId === startup.id)
            const match = response.data.matches.find(m => m.name === startup.startupName || m.id === startup.id)
            return {
              ...startup,
              ...startupProfile,
              score: match?.score || (investorDomain && (startupProfile?.domain || '').toLowerCase().includes(investorDomain) ? 0.9 : 0.5)
            }
          }).sort((a, b) => (b.score || 0) - (a.score || 0))
          setMatchedStartups(merged)
        }
      } catch (error) {
        console.error('AI matching error:', error)
        // Fallback to local matching
        const ranked = startups.map(s => ({
          ...s,
          score: investorDomain && (s.domain || '').toLowerCase().includes(investorDomain) ? 0.9 : 0.5
        })).sort((a, b) => b.score - a.score)
        setMatchedStartups(ranked)
      } finally {
        setLoading(false)
      }
    }
    fetchAIMatches()
  }, [investorDomain, investorFocus, startups.length])
  
  function viewDetails(startup) {
    const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
    const startupProfile = profiles.find(p => p.userId === startup.id) || {}
    setSelectedStartup({...startup, ...startupProfile})
  }

  return (
    <>
    <Card title="Available Startups (AI Matched by Domain)">
      {loading ? (
        <div className="text-sm text-gray-600 py-4 text-center">Loading AI matches...</div>
      ) : matchedStartups.length === 0 ? (
        <div className="text-sm text-gray-600 py-4 text-center">No startups found.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {matchedStartups.map(startup => (
            <div key={startup.id} className="flex items-center justify-between rounded-md border p-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{startup.startupName}</div>
                <div className="text-sm text-gray-600 mt-1">Founder: {startup.name}</div>
                {startup.domain && <div className="text-sm text-gray-600">Domain: {startup.domain}</div>}
                {startup.score && (
                  <div className="text-xs text-green-600 mt-1">Match Score: {(startup.score * 100).toFixed(0)}%</div>
                )}
              </div>
              <button 
                onClick={() => viewDetails(startup)}
                className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
    
    {selectedStartup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedStartup(null)}>
        <div className="relative w-full max-w-2xl rounded-xl border bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <h3 className="mb-4 text-xl font-semibold">{selectedStartup.startupName}</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium text-gray-600">Founder</div>
              <div className="text-gray-900">{selectedStartup.name}</div>
            </div>
            {selectedStartup.domain && (
              <div>
                <div className="font-medium text-gray-600">Domain/Industry</div>
                <div className="text-gray-900">{selectedStartup.domain}</div>
              </div>
            )}
            {selectedStartup.ideaSummary && (
              <div>
                <div className="font-medium text-gray-600">Idea Summary</div>
                <div className="text-gray-900 whitespace-pre-line">{selectedStartup.ideaSummary}</div>
              </div>
            )}
            {selectedStartup.mcaVerification && (
              <div>
                <div className="font-medium text-gray-600">MCA Verification</div>
                <div className={`inline-block px-2 py-1 rounded text-xs ${selectedStartup.mcaVerification.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selectedStartup.mcaVerification.status}
                </div>
                {selectedStartup.mcaVerification.cin && (
                  <div className="text-xs text-gray-600 mt-1">CIN: {selectedStartup.mcaVerification.cin}</div>
                )}
              </div>
            )}
            {selectedStartup.score && (
              <div>
                <div className="font-medium text-gray-600">AI Match Score</div>
                <div className="text-green-600">{(selectedStartup.score * 100).toFixed(0)}%</div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSelectedStartup(null)}
            className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    )}
    </>
  )
}

function DealsManager({ deals, setDeals }) {
  const me = getCurrentUser()
  const [showForm, setShowForm] = useState(false)
  const [startup, setStartup] = useState('')
  const [stage, setStage] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('pending')
  const [editingId, setEditingId] = useState(null)
  
  const startups = (() => {
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

  function addOrUpdate() {
    if (!startup || !stage) {
      alert('Please fill in startup and stage')
      return
    }
    if (!me) return
    
    const all = JSON.parse(localStorage.getItem('deals') || '[]')
    const item = {
      id: editingId || Date.now().toString(),
      investorId: me.id,
      startup,
      stage,
      amount: amount || '0',
      status,
      createdAt: editingId ? (all.find(d => d.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    }
    
    if (editingId) {
      const idx = all.findIndex(d => d.id === editingId)
      if (idx >= 0) all[idx] = item
    } else {
      all.push(item)
    }
    
    localStorage.setItem('deals', JSON.stringify(all))
    setDeals(all.filter(x => x.investorId === me.id))
    resetForm()
  }

  function resetForm() {
    setStartup('')
    setStage('')
    setAmount('')
    setStatus('pending')
    setEditingId(null)
    setShowForm(false)
  }

  function editItem(item) {
    setStartup(item.startup || '')
    setStage(item.stage || '')
    setAmount(item.amount || '')
    setStatus(item.status || 'pending')
    setEditingId(item.id)
    setShowForm(true)
  }

  function deleteItem(id) {
    if (!confirm('Delete this deal?')) return
    const all = JSON.parse(localStorage.getItem('deals') || '[]')
    const filtered = all.filter(d => d.id !== id)
    localStorage.setItem('deals', JSON.stringify(filtered))
    const me = getCurrentUser()
    setDeals(me ? filtered.filter(x => x.investorId === me.id) : [])
  }

  return (
    <Card title="Deals">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">My Deals</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          {showForm ? 'Cancel' : '+ Add Deal'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 rounded-md border p-4 bg-gray-50">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Startup</label>
              <select className="input" value={startup} onChange={e=>setStartup(e.target.value)}>
                <option value="">Select startup...</option>
                {startups.map(s => (
                  <option key={s.id} value={s.startupName}>{s.startupName} - {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Stage</label>
              <input className="input" value={stage} onChange={e=>setStage(e.target.value)} placeholder="Seed, Series A, etc." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Amount ($)</label>
              <input type="number" className="input" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="100000" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <button className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-white" onClick={addOrUpdate}>
            {editingId ? 'Update' : 'Add'} Deal
          </button>
        </div>
      )}

      <div className="space-y-3">
        {deals.length === 0 && !showForm && (
          <div className="text-sm text-gray-600 py-4 text-center">No deals yet. Click "Add Deal" to get started.</div>
        )}
        {deals.map(d => (
          <div key={d.id} className="border rounded-md p-3 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{d.startup}</div>
                <div className="text-sm text-gray-600 mt-1">Stage: {d.stage}</div>
                {d.amount && <div className="text-sm text-gray-600">Amount: ${parseFloat(d.amount).toLocaleString()}</div>}
                <div className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  d.status === 'completed' ? 'bg-green-100 text-green-700' :
                  d.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  d.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                </div>
                <div className="text-xs text-gray-500 mt-2">Created: {new Date(d.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => editItem(d)} className="text-sm text-brand-600 hover:text-brand-700">Edit</button>
                <button onClick={() => deleteItem(d.id)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function MeetingsManager({ meetings, setMeetings }) {
  const me = getCurrentUser()
  const [showForm, setShowForm] = useState(false)
  const [withName, setWithName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [pitchDeckFile, setPitchDeckFile] = useState(null)
  const [pitchDeckUrl, setPitchDeckUrl] = useState('')
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState(null)

  function addOrUpdate() {
    if (!withName || !date || !time) {
      alert('Please fill in all required fields')
      return
    }
    if (!me) return
    
    const all = JSON.parse(localStorage.getItem('meetings') || '[]')
    const item = {
      id: editingId || Date.now().toString(),
      investorId: me.id,
      with: withName,
      at: `${date} ${time}`,
      notes: notes || '',
      pitchDeckUrl: pitchDeckUrl || (pitchDeckFile ? URL.createObjectURL(pitchDeckFile) : null),
      createdAt: editingId ? (all.find(m => m.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    }
    
    if (editingId) {
      const idx = all.findIndex(m => m.id === editingId)
      if (idx >= 0) all[idx] = item
    } else {
      all.push(item)
    }
    
    localStorage.setItem('meetings', JSON.stringify(all))
    setMeetings(all.filter(x => x.investorId === me.id))
    resetForm()
  }

  function resetForm() {
    setWithName('')
    setDate('')
    setTime('')
    setNotes('')
    setPitchDeckFile(null)
    setPitchDeckUrl('')
    setEditingId(null)
    setShowForm(false)
  }

  function editItem(item) {
    const [datePart, timePart] = item.at ? item.at.split(' ') : ['', '']
    setWithName(item.with || '')
    setDate(datePart || '')
    setTime(timePart || '')
    setNotes(item.notes || '')
    setPitchDeckUrl(item.pitchDeckUrl || '')
    setPitchDeckFile(null)
    setEditingId(item.id)
    setShowForm(true)
  }

  function deleteItem(id) {
    if (!confirm('Delete this meeting?')) return
    const all = JSON.parse(localStorage.getItem('meetings') || '[]')
    const filtered = all.filter(m => m.id !== id)
    localStorage.setItem('meetings', JSON.stringify(filtered))
    const me = getCurrentUser()
    setMeetings(me ? filtered.filter(x => x.investorId === me.id) : [])
  }

  return (
    <Card title="Meetings">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium">Scheduled Meetings</h3>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="inline-flex rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700"
        >
          {showForm ? 'Cancel' : '+ Schedule Meeting'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-4 rounded-md border p-4 bg-gray-50">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">With</label>
              <input className="input" value={withName} onChange={e=>setWithName(e.target.value)} placeholder="Startup name or person" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Time</label>
              <input type="time" className="input" value={time} onChange={e=>setTime(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes (Optional)</label>
              <textarea className="input" rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Meeting agenda or notes..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pitch Deck URL (Optional)</label>
              <input className="input" value={pitchDeckUrl} onChange={e=>setPitchDeckUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Or Upload Pitch Deck</label>
              <input type="file" accept=".pdf,.ppt,.pptx" className="input" onChange={e=>setPitchDeckFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <button className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-white" onClick={addOrUpdate}>
            {editingId ? 'Update' : 'Schedule'} Meeting
          </button>
        </div>
      )}

      <div className="space-y-3">
        {meetings.length === 0 && !showForm && (
          <div className="text-sm text-gray-600 py-4 text-center">No meetings scheduled yet.</div>
        )}
        {meetings.slice().sort((a, b) => new Date(a.at) - new Date(b.at)).map(m => (
          <div key={m.id} className="border rounded-md p-3 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">With: {m.with}</div>
                <div className="text-sm text-gray-600 mt-1">Date & Time: {m.at}</div>
                {m.notes && <div className="text-sm text-gray-700 mt-2">{m.notes}</div>}
                {m.pitchDeckUrl && (
                  <div className="mt-2">
                    <a href={m.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                      View Pitch Deck →
                    </a>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">Created: {new Date(m.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => { setCurrentMeeting(m); setShowVideoCall(true) }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Start Video Call
                </button>
                <button onClick={() => editItem(m)} className="text-sm text-brand-600 hover:text-brand-700">Edit</button>
                <button onClick={() => deleteItem(m.id)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showVideoCall && currentMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-full max-w-4xl bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Video Call with {currentMeeting.with}</h3>
              <button onClick={() => { setShowVideoCall(false); setCurrentMeeting(null) }} className="text-gray-600 hover:text-gray-800">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">📹</div>
                  <div>Your Video</div>
                  <button className="mt-4 px-4 py-2 bg-brand-600 rounded text-white hover:bg-brand-700">
                    Start Camera
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <div>{currentMeeting.with}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700">Start Call</button>
              <button className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700">End Call</button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Note: This is a demo. In production, integrate with WebRTC or video conferencing API.</p>
          </div>
        </div>
      )}
    </Card>
  )
}

function PitchEventsManager() {
  const me = getCurrentUser()
  const events = (()=>{
    try { return JSON.parse(localStorage.getItem('pitchEvents')||'[]') } catch { return [] }
  })()
  
  return (
    <Card title="Pitch Events">
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-sm text-gray-600 py-4 text-center">No pitch events available.</div>
        ) : (
          events.map(e => (
            <div key={e.id} className="border rounded-md p-3">
              <div className="font-medium">{e.title || 'Pitch Event'}</div>
              <div className="text-sm text-gray-600 mt-1">{new Date(e.date).toLocaleString()}</div>
              {e.pitchDeckUrl && (
                <div className="mt-2">
                  <a href={e.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">
                    View Pitch Deck →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

function MessagesChat() {
  const me = getCurrentUser()
  const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [thread, setThread] = useState([])
  const [module, setModule] = useState('all') // 'all', 'entrepreneur', 'freelancer'
  const users = getUsers()
  
  useEffect(()=>{ load() },[to, module])
  
  function load(){
    try {
      const all = JSON.parse(localStorage.getItem('messages')||'[]')
      let filtered = all.filter(m=> (m.toId===me?.id && m.fromId===to) || (m.fromId===me?.id && m.toId===to))
      
      // Filter by module if specified
      if (module !== 'all' && to) {
        const recipient = users.find(u => u.id === to)
        if (recipient) {
          if (module === 'entrepreneur' && recipient.role !== 'entrepreneur') filtered = []
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
    if (module === 'all') return u.role === 'entrepreneur' || u.role === 'freelancer'
    if (module === 'entrepreneur') return u.role === 'entrepreneur'
    if (module === 'freelancer') return u.role === 'freelancer'
    return false
  })
  
  return (
    <Card title="Messages">
      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium">Filter by Module</label>
        <select className="input" value={module} onChange={e=>{setModule(e.target.value); setTo('')}}>
          <option value="all">All Modules</option>
          <option value="entrepreneur">Entrepreneurs Only</option>
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

function AnalyticsPanel({ deals, meetings, startups }) {
  const activeDeals = deals.filter(d => d.status === 'active' || d.status === 'pending').length
  const completedDeals = deals.filter(d => d.status === 'completed').length
  const upcomingMeetings = meetings.filter(m => new Date(m.at) > new Date()).length
  const series = [
    { label: 'Active Deals', value: activeDeals },
    { label: 'Completed', value: completedDeals },
    { label: 'Upcoming Meetings', value: upcomingMeetings },
    { label: 'Startups', value: startups }
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

function SettingsInvestor() {
  const me = getCurrentUser()
  const [name, setName] = useState(me?.name || '')
  const [domain, setDomain] = useState('')
  const [focus, setFocus] = useState('')
  const [checkSize, setCheckSize] = useState('')
  const [bio, setBio] = useState('')
  
  useEffect(()=>{
    try { 
      const p=(JSON.parse(localStorage.getItem('investorProfiles')||'[]')||[]).find(x=>x.userId===me?.id)
      if(p){ 
        setName(p.name || me?.name || '')
        setDomain(p.domain || '')
        setFocus(p.focus || '')
        setCheckSize(p.checkSize || '')
        setBio(p.bio || '')
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
    
    const profiles = JSON.parse(localStorage.getItem('investorProfiles')||'[]')
    const idx = profiles.findIndex(p=>p.userId===me?.id)
    const next = { 
      ...(idx>=0?profiles[idx]:{}), 
      userId: me?.id, 
      name,
      domain, 
      focus,
      checkSize,
      bio
    }
    if(idx>=0) profiles[idx]=next; else profiles.push(next)
    localStorage.setItem('investorProfiles', JSON.stringify(profiles))
    alert('Profile updated')
  }
  
  return (
    <Card title="Settings">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Domain/Industry</label><input className="input" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. Fintech, SaaS" /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Investment Focus</label><input className="input" value={focus} onChange={e=>setFocus(e.target.value)} placeholder="Early stage, Growth, etc." /></div>
        <div className="md:col-span-1"><label className="mb-1 block text-sm font-medium">Typical Check Size</label><input className="input" value={checkSize} onChange={e=>setCheckSize(e.target.value)} placeholder="$50K - $500K" /></div>
        <div className="md:col-span-3"><label className="mb-1 block text-sm font-medium">Bio</label><textarea className="input" rows={4} value={bio} onChange={e=>setBio(e.target.value)} placeholder="About your investment philosophy and experience..." /></div>
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

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.5rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);
