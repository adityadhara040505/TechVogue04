import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Entrepreneurs from './pages/Entrepreneurs'
import Investors from './pages/Investors'
import Freelancers from './pages/Freelancers'
import Pitch from './pages/Pitch'
import Verify from './pages/Verify'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import StartupProfile from './pages/StartupProfile'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Auth initialTab="signup" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/entrepreneurs" element={<Entrepreneurs />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/pitch" element={<Pitch />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/startup-profile" element={<StartupProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

