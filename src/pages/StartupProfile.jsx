import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../lib/session'
import { api } from '../lib/api'

export default function StartupProfile() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [startupName, setStartupName] = useState('')
  const [domain, setDomain] = useState('')
  const [idea, setIdea] = useState('')
  const [saved, setSaved] = useState(false)
  const [cin, setCin] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)

  useEffect(() => {
    try {
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
      const me = user?.id && profiles.find(p => p.userId === user.id)
      if (me) {
        setStartupName(me.startupName || '')
        setDomain(me.domain || '')
        setIdea(me.ideaSummary || '')
        setCin(me.cin || '')
        setVerificationStatus(me.mcaVerification || null)
      }
    } catch {}
  }, [])

  async function verifyMCA() {
    if (!cin || !startupName) {
      alert('Please enter CIN and Startup Name')
      return
    }
    setVerifying(true)
    try {
      const response = await api.post('/verification/mca', {
        cin: cin.trim().toUpperCase(),
        startupName
      })
      setVerificationStatus(response.data)
      if (response.data.status === 'verified') {
        alert('Startup verified successfully via MCA!')
      } else {
        alert('Verification pending. Please check CIN format.')
      }
    } catch (error) {
      alert('Verification failed. Please try again.')
      console.error(error)
    } finally {
      setVerifying(false)
    }
  }

  function save() {
    if (!user) return alert('Please log in')
    if (!startupName || !domain) {
      alert('Please fill in startup name and domain')
      return
    }
    
    // If CIN is provided but not verified, warn user
    if (cin && (!verificationStatus || verificationStatus.status !== 'verified')) {
      const proceed = confirm('CIN not verified. Do you want to save without verification?')
      if (!proceed) return
    }
    
    const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
    const idx = profiles.findIndex(p => p.userId === user.id)
    const profile = {
      ...(idx >= 0 ? profiles[idx] : {}),
      userId: user.id,
      startupName,
      domain,
      ideaSummary: idea,
      cin: cin || undefined,
      mcaVerification: verificationStatus
    }
    if (idx >= 0) profiles[idx] = profile
    else profiles.push(profile)
    localStorage.setItem('entrepreneurProfiles', JSON.stringify(profiles))
    setSaved(true)
    setTimeout(()=>setSaved(false), 1500)
    // Redirect back to dashboard to view summary
    setTimeout(()=>navigate('/entrepreneurs'), 400)
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Startup Profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Startup Name</label>
            <input className="input" placeholder="Enter your startup name" value={startupName} onChange={e=>setStartupName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Domain/Industry</label>
            <input className="input" placeholder="Select domain" value={domain} onChange={e=>setDomain(e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Idea Summary</label>
          <textarea className="input" rows={6} placeholder="Describe your startup idea..." value={idea} onChange={e=>setIdea(e.target.value)} />
        </div>
        
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-lg font-semibold">MCA Verification (CIN)</h3>
          <p className="mb-3 text-sm text-gray-600">Verify your startup using Company Identification Number (CIN) from MCA datasets</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">CIN Number</label>
              <input 
                className="input" 
                placeholder="U72900XX2020PTC123456" 
                value={cin} 
                onChange={e=>setCin(e.target.value.toUpperCase())} 
                maxLength={21}
              />
              <p className="mt-1 text-xs text-gray-500">Format: U72900XX2020PTC123456</p>
            </div>
            <div className="flex items-end">
              <button 
                onClick={verifyMCA} 
                disabled={verifying || !cin || !startupName}
                className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:bg-gray-400"
              >
                {verifying ? 'Verifying...' : 'Verify CIN'}
              </button>
            </div>
          </div>
          {verificationStatus && (
            <div className={`mt-3 rounded-md p-3 ${verificationStatus.status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
              <div className="font-medium">Status: {verificationStatus.status}</div>
              {verificationStatus.status === 'verified' && (
                <div className="mt-1 text-sm">
                  <div>Company: {verificationStatus.companyName}</div>
                  <div>Registration Date: {verificationStatus.registrationDate}</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button onClick={save} className="mt-4 inline-flex rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Save Profile</button>
        {saved && <span className="ml-3 text-sm text-green-600">Saved</span>}
      </div>
    </div>
  )
}


