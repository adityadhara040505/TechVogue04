import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaFlag, FaUsers, FaStar, FaCalendarAlt, FaEnvelope, FaChartPie, FaSearchDollar, FaCog, FaUserCircle, FaRocket, FaRobot, FaHandshake } from 'react-icons/fa'
import PitchEventModule from '../components/entrepreneur/PitchEventModule'
import AIMatchmaking from '../components/entrepreneur/AIMatchmaking'
import Collaborate from '../components/entrepreneur/Collaborate'

function Stat({ icon, label, value, color = 'brand', suffix, variant = 'default' }) {
  if (variant === 'simple') {
    const bg = color === 'accent' ? 'bg-accent-50 text-accent-700' : 'bg-brand-50 text-brand-700';
    return (
      <div className="flex items-center gap-5 rounded-xl border bg-white p-6 shadow-sm">
        <div className={`grid h-10 w-10 place-items-center rounded-full ${bg}`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xl font-semibold text-gray-900">
            {value}{suffix && <span className="ml-1 text-sm text-gray-500">{suffix}</span>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-white p-4 ${color === 'accent' ? 'border-accent-200' : 'border-brand-200'}`}>
      <div className="flex items-center">
        <div className={`rounded-full p-2 ${color === 'accent' ? 'bg-accent-100 text-accent-600' : 'bg-brand-100 text-brand-600'}`}>
          {icon}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{label}</div>
          <div className="text-xl font-semibold text-gray-900">
            {value}{suffix && <span className="ml-1 text-sm text-gray-500">{suffix}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  } catch {
    return null;
  }
}

export default function Entrepreneurs() {
  const [tab, setTab] = useState('overview');
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [investorInterest, setInvestorInterest] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const location = useLocation();
  const [role, setRole] = useState('investor');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/auth?role=entrepreneur');
      return;
    }
    if (currentUser.role !== 'entrepreneur') {
      navigate('/auth?role=entrepreneur');
      return;
    }
  }, [navigate]);

  // initialize from URL hash (e.g., #tab=messages)
  useEffect(() => {
    const m = /tab=([a-z]+)/i.exec(window.location.hash || '')
    if (m) setTab(m[1])
  }, [])

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
    const next = [...reviews, { 
      id: Date.now().toString(), 
      role, 
      rating: +rating, 
      comment, 
      toUserId: me?.id, 
      createdAt: new Date().toISOString() 
    }]
    setReviews(next)
    localStorage.setItem('peerReviews', JSON.stringify(next))
    setComment('')
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your startup journey and connect with potential team members.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Stat icon={<FaStar />} label="Investor Interest" value={investorInterest} color="brand" variant="simple" />
        <Stat icon={<FaFlag />} label="Active Milestones" value={milestones.length} color="accent" variant="simple" />
        <Stat icon={<FaUsers />} label="Team Members" value={team.length} color="brand" variant="simple" />
        <Stat icon={<FaEnvelope />} label="Messages" value={messagesCount} color="accent" variant="simple" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <Sidebar activeKey={tab} onSelect={(k)=>{ 
          setTab(k); 
          const h = `#tab=${k}`; 
          if (window.location.hash !== h) window.location.hash = h 
        }} />
        
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

          {tab === 'reviews' && (
            <div>
              <div className="space-y-4">
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
                <textarea 
                  className="input mt-2" 
                  rows="2" 
                  placeholder="Comment (optional)" 
                  value={comment} 
                  onChange={e=>setComment(e.target.value)} 
                />
                <div className="mt-3">
                  <h3 className="font-medium mb-2">Community Reviews (avg {avg})</h3>
                  <ul className="space-y-2 text-sm">
                    {reviews.slice(-10).reverse().map(r => (
                      <li key={r.id} className="rounded-md border p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{r.role}</span>
                          <span>{'★'.repeat(r.rating)}</span>
                        </div>
                        {r.comment && <div className="text-gray-700">{r.comment}</div>}
                      </li>
                    ))}
                    {reviews.length === 0 && <li className="text-gray-700">No reviews yet.</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* New Tabs */}
          {tab === 'pitch-events' && <PitchEventModule />}
          {tab === 'ai-matchmaking' && <AIMatchmaking />}
          {tab === 'collaborate' && <Collaborate />}

        </div>
      </div>
    </div>
  )
}

function Sidebar({ activeKey, onSelect }) {
  const sections = [
    {
      title: 'Main',
      items: [
        { key: 'overview', label: 'Overview', icon: <FaChartPie /> },
        { key: 'milestones', label: 'Milestones', icon: <FaFlag /> },
        { key: 'team', label: 'Team', icon: <FaUsers /> },
        { key: 'reviews', label: 'Reviews', icon: <FaStar /> },
      ]
    },
    {
      title: 'Growth',
      items: [
        { key: 'pitch-events', label: 'Pitch Events', icon: <FaRocket /> },
        { key: 'ai-matchmaking', label: 'AI Matchmaking', icon: <FaRobot /> },
        { key: 'collaborate', label: 'Collaborate', icon: <FaHandshake /> },
      ]
    },
    {
      title: 'Communication',
      items: [
        { key: 'investors', label: 'Investors', icon: <FaSearchDollar /> },
        { key: 'messages', label: 'Messages', icon: <FaEnvelope /> },
      ]
    },
    {
      title: 'Settings',
      items: [
        { key: 'settings', label: 'Settings', icon: <FaCog /> },
        { key: 'profile', label: 'Profile', icon: <FaUserCircle /> },
      ]
    }
  ];

  return (
    <aside className="sticky top-20 h-max self-start rounded-xl border bg-white p-4 shadow-sm">
      {sections.map(section => (
        <div key={section.title} className="mb-6 last:mb-0">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {section.title}
          </div>
          <nav className="flex flex-col gap-1">
            {section.items.map(item => (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
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
        </div>
      ))}
    </aside>
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