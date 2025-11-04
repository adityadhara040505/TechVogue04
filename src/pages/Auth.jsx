import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth({ initialTab = 'login' }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState(initialTab)
  const [role, setRole] = useState('entrepreneur')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const qRole = params.get('role')
    if (qRole === 'entrepreneur' || qRole === 'investor' || qRole === 'freelancer') {
      setRole(qRole)
      // If role is provided, show signup tab by default
      if (initialTab === 'login') {
        setTab('signup')
      }
    }
  }, [])
  const roleLocked = (() => {
    const params = new URLSearchParams(window.location.search)
    const r = params.get('role')
    return r === 'entrepreneur' || r === 'investor' || r === 'freelancer'
  })()

  function redirect(role) {
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get('returnUrl');

    // Initialize data based on role
    if (role === 'entrepreneur') {
      if (!localStorage.getItem('milestones')) localStorage.setItem('milestones', '[]');
      if (!localStorage.getItem('teamMembers')) localStorage.setItem('teamMembers', '[]');
      if (!localStorage.getItem('entrepreneurProfiles')) localStorage.setItem('entrepreneurProfiles', '[]');
      nav(returnUrl || '/entrepreneurs');
    } else if (role === 'investor') {
      if (!localStorage.getItem('deals')) localStorage.setItem('deals', '[]');
      if (!localStorage.getItem('meetings')) localStorage.setItem('meetings', '[]');
      if (!localStorage.getItem('investorProfiles')) localStorage.setItem('investorProfiles', '[]');
      nav(returnUrl || '/investors');
    } else {
      nav(returnUrl || '/freelancers');
      // Initialize freelancer data
      if (!localStorage.getItem('portfolio')) localStorage.setItem('portfolio', '[]');
      if (!localStorage.getItem('applications')) localStorage.setItem('applications', '[]');
      if (!localStorage.getItem('freelancerProfiles')) localStorage.setItem('freelancerProfiles', '[]');
    }
    // Common data initialization
    if (!localStorage.getItem('messages')) localStorage.setItem('messages', '[]');
    if (!localStorage.getItem('reviews')) localStorage.setItem('reviews', '[]');
  }

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return setError('Invalid email or password')
    localStorage.setItem('currentUser', JSON.stringify(user))
    redirect(user.role)
  }

  function handleSignup(e) {
    e.preventDefault()
    setError('')
    if (!email || !password || !name) return setError('All fields are required')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.some(u => u.email === email)) return setError('Email already exists')
    const user = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      createdAt: new Date().toISOString()
    }
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(user))
    // Initialize empty arrays for various data if they don't exist
    if (!localStorage.getItem('milestones')) localStorage.setItem('milestones', '[]')
    if (!localStorage.getItem('teamMembers')) localStorage.setItem('teamMembers', '[]')
    if (!localStorage.getItem('peerReviews')) localStorage.setItem('peerReviews', '[]')
    if (!localStorage.getItem('entrepreneurProfiles')) localStorage.setItem('entrepreneurProfiles', '[]')
    if (users.find(u => u.email === email)) return setError('Email already registered')
    const newUser = { id: Date.now().toString(), name, email, password, role, createdAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    if (role === 'entrepreneur') {
      nav('/verify')
    } else {
      redirect(role)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-lg">
        {tab==='login' ? (
          <>
            <h2 className="mb-6 text-center text-2xl font-semibold">Login to Tech Vogue</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Login</button>
              <div className="text-center text-sm">
                Don't have an account? <button type="button" onClick={()=>setTab('signup')} className="text-brand-700 hover:underline">Sign Up</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-center text-2xl font-semibold">Create Your Account</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-medium">Select Your Role</div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <RoleCard value="entrepreneur" selected={role} onSelect={setRole} label="Entrepreneur" emoji="🚀" disabled={roleLocked && role!=='entrepreneur'} />
                  <RoleCard value="investor" selected={role} onSelect={setRole} label="Investor" emoji="💰" disabled={roleLocked && role!=='investor'} />
                  <RoleCard value="freelancer" selected={role} onSelect={setRole} label="Freelancer" emoji="💼" disabled={roleLocked && role!=='freelancer'} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <button className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Sign Up</button>
              <div className="text-center text-sm">
                Already have an account? <button type="button" onClick={()=>setTab('login')} className="text-brand-700 hover:underline">Login</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function RoleCard({ value, selected, onSelect, label, emoji, disabled }) {
  const active = selected === value
  return (
    <button type="button" disabled={disabled} onClick={()=>!disabled && onSelect(value)} className={`rounded-lg border p-4 text-sm transition ${active?'border-brand-600 bg-brand-50':'border-gray-200 hover:bg-gray-50'} ${disabled?'opacity-50 cursor-not-allowed':''}`}>
      <div className="mb-1 text-xl">{emoji}</div>
      <div className="font-medium">{label}</div>
      <div className="text-gray-600">Select</div>
    </button>
  )
}

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.6rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);

