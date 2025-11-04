import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PitchEvents from './pages/PitchEvents';
import StartupProfile from './pages/StartupProfile';
import InvestorProfile from './pages/InvestorProfile';
import FreelancerProfile from './pages/FreelancerProfile';
import Marketplace from './pages/Marketplace';
import ProjectDetails from './pages/ProjectDetails';
import Settings from './pages/Settings';
import Entrepreneurs from './pages/Entrepreneurs';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#4F46E5',
              color: '#ffffff',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/pitch-events" element={<PitchEvents />} />
              <Route path="/startup/:id" element={<StartupProfile />} />
              <Route path="/investor/:id" element={<InvestorProfile />} />
              <Route path="/freelancer/:id" element={<FreelancerProfile />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/startup-profile" element={<StartupProfile />} />
              <Route path="/entrepreneurs" element={<Entrepreneurs />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

