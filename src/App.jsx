import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import PitchEvents from './pages/PitchEvents';
import { lazy, Suspense } from 'react';
import StartupProfile from './pages/StartupProfile';
import InvestorProfile from './pages/InvestorProfile';
import FreelancerProfile from './pages/FreelancerProfile';
import Marketplace from './pages/Marketplace';
import ProjectDetails from './pages/ProjectDetails';
import Settings from './pages/Settings';
import Entrepreneurs from './pages/Entrepreneurs';
import Investors from './pages/Investors';
import Freelancers from './pages/Freelancers';
import CreatePitchEvent from './pages/CreatePitchEvent';
import Pricing from './pages/Pricing';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col">
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
          <main className="flex-grow bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<AboutPage />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/entrepreneurs" element={<PrivateRoute requiredRole="entrepreneur"><Entrepreneurs /></PrivateRoute>} />
                <Route path="/investors" element={<PrivateRoute requiredRole="investor"><Investors /></PrivateRoute>} />
                <Route path="/freelancers" element={<PrivateRoute requiredRole="freelancer"><Freelancers /></PrivateRoute>} />
                <Route path="/pitch-events" element={<PrivateRoute><PitchEvents /></PrivateRoute>} />
                <Route path="/pitch-events/create" element={<PrivateRoute><CreatePitchEvent /></PrivateRoute>} />
                <Route path="/StartupProfile" element={<PrivateRoute requiredRole="entrepreneur"><StartupProfile /></PrivateRoute>} />
                <Route path="/startup/:id" element={<PrivateRoute><StartupProfile /></PrivateRoute>} />
                <Route path="/investor/:id" element={<PrivateRoute><InvestorProfile /></PrivateRoute>} />
                <Route path="/freelancer/:id" element={<PrivateRoute><FreelancerProfile /></PrivateRoute>} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/entrepreneurs" element={<Entrepreneurs />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/freelancers" element={<Freelancers />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

