import { useState } from 'react'
import { api } from '../lib/api'

export default function Verify() {
  const [channel, setChannel] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [status, setStatus] = useState('')
  const [aadhaarMethod, setAadhaarMethod] = useState('ocr')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [aadhaarFile, setAadhaarFile] = useState(null)
  const [startupFile, setStartupFile] = useState(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [domain, setDomain] = useState('')

  async function sendOtp() {
    setStatus('Sending...')
    const to = channel === 'mobile' ? mobile : email
    const res = await api.post('/verification/otp/send', { channel, to }).catch(()=>null)
    setStatus(res?.data?.status || 'error')
  }

  async function verifyOtp() {
    setStatus('Verifying...')
    const to = channel === 'mobile' ? mobile : email
    const code = channel === 'mobile' ? smsCode : emailCode
    const res = await api.post('/verification/otp/verify', { channel, to, code }).catch(()=>null)
    setStatus(res?.data?.status || 'error')
  }

  async function sendEmailOtp() {
    setStatus('Sending email OTP...')
    const res = await api.post('/verification/otp/send', { channel: 'email', to: email }).catch(()=>null)
    setStatus(res?.data?.status || 'error')
  }

  async function verifyEmailOtp() {
    setStatus('Verifying email OTP...')
    const res = await api.post('/verification/otp/verify', { channel: 'email', to: email, code: emailCode }).catch(()=>null)
    setStatus(res?.data?.status || 'error')
  }

  async function aadhaarSubmit() {
    let payload = null
    if (aadhaarMethod === 'ocr' && aadhaarFile) {
      const fd = new FormData()
      fd.append('method', 'ocr')
      if (aadhaarNumber) fd.append('aadhaarNumber', aadhaarNumber)
      fd.append('file', aadhaarFile)
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/verification/aadhaar', { method: 'POST', body: fd }).catch(()=>null)
      payload = res && await res.json()
    } else {
      const res = await api.post('/verification/aadhaar', { method: aadhaarMethod, aadhaarNumber }).catch(()=>null)
      payload = res?.data
    }
    alert('Aadhaar: ' + JSON.stringify(payload || {}))
  }

  async function linkedinNLP() {
    const res = await api.post('/verification/linkedin', { linkedinUrl }).catch(()=>null)
    alert('LinkedIn: ' + JSON.stringify(res?.data || {}))
  }

  async function startupOCR() {
    let payload = null
    if (startupFile) {
      const fd = new FormData()
      fd.append('file', startupFile)
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/verification/startup-ocr', { method: 'POST', body: fd }).catch(()=>null)
      payload = res && await res.json()
    } else {
      const res = await api.post('/verification/startup-ocr').catch(()=>null)
      payload = res?.data
    }
    alert('Startup OCR: ' + JSON.stringify(payload || {}))
  }

  async function domainCheck() {
    const res = await api.post('/verification/domain', { domain }).catch(()=>null)
    alert('Domain: ' + JSON.stringify(res?.data || {}))
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-4 text-2xl font-semibold">Verification Center</h2>

      <Section title="Contact OTP Verification">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <label className="inline-flex items-center gap-2"><input type="radio" name="channel" value="mobile" checked={channel==='mobile'} onChange={()=>setChannel('mobile')} /> Mobile</label>
          <label className="inline-flex items-center gap-2"><input type="radio" name="channel" value="email" checked={channel==='email'} onChange={()=>setChannel('email')} /> Email</label>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {channel==='mobile' ? (
            <input className="input" placeholder="+91XXXXXXXXXX" value={mobile} onChange={e=>setMobile(e.target.value)} />
          ) : (
            <input className="input" placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          )}
          <button className="btn" onClick={sendOtp}>Send OTP</button>
          <div className="text-sm text-gray-700">{status}</div>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {channel==='mobile' ? (
            <input className="input" placeholder="Enter code" value={smsCode} onChange={e=>setSmsCode(e.target.value)} />
          ) : (
            <input className="input" placeholder="Enter code" value={emailCode} onChange={e=>setEmailCode(e.target.value)} />
          )}
          <button className="btn" onClick={verifyOtp}>Verify</button>
        </div>
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Aadhaar (e-KYC / OCR)">
          <div className="flex flex-wrap items-center gap-2">
            <select className="input max-w-xs" value={aadhaarMethod} onChange={e=>setAadhaarMethod(e.target.value)}>
              <option value="ekyc">e-KYC</option>
              <option value="ocr">OCR</option>
            </select>
            <input className="input max-w-xs" placeholder="Aadhaar number" value={aadhaarNumber} onChange={e=>setAadhaarNumber(e.target.value)} />
            {aadhaarMethod==='ocr' && (
              <input className="input max-w-xs" type="file" accept="application/pdf,image/*" onChange={e=>setAadhaarFile(e.target.files?.[0] || null)} />
            )}
            <button className="btn" onClick={aadhaarSubmit}>Submit</button>
          </div>
        </Section>
        <Section title="LinkedIn + NLP Professional Proof">
          <div className="flex flex-wrap items-center gap-2">
            <input className="input max-w-md" placeholder="LinkedIn profile URL" value={linkedinUrl} onChange={e=>setLinkedinUrl(e.target.value)} />
            <button className="btn" onClick={linkedinNLP}>Analyze Profile</button>
          </div>
        </Section>
        <Section title="Startup Registration OCR">
          <div className="flex flex-wrap items-center gap-2">
            <input className="input max-w-xs" type="file" accept="application/pdf,image/*" onChange={e=>setStartupFile(e.target.files?.[0] || null)} />
            <button className="btn" onClick={startupOCR}>Upload</button>
          </div>
        </Section>
        <Section title="Domain Verification (DNS/WHOIS)">
          <div className="flex flex-wrap items-center gap-2">
            <input className="input max-w-xs" placeholder="example.com" value={domain} onChange={e=>setDomain(e.target.value)} />
            <button className="btn" onClick={domainCheck}>Check Domain</button>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-2 font-medium">{title}</h3>
      {children}
    </div>
  )
}

const style = document.createElement('style');
style.innerHTML = `.input{width:100%;padding:.6rem;border:1px solid #e5e7eb;border-radius:.5rem}`;
document.head.appendChild(style);

