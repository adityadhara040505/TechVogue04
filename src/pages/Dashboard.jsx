import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.name}!
          </h1>

          {/* Role-specific dashboard content */}
          {user?.role === 'entrepreneur' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Your Projects"
                description="Manage your ongoing projects and track milestones"
                link="/projects"
                icon="📊"
              />
              <DashboardCard
                title="Pitch Events"
                description="View upcoming pitch events or schedule a new one"
                link="/pitch-events"
                icon="🎯"
              />
              <DashboardCard
                title="Find Freelancers"
                description="Browse and connect with skilled freelancers"
                link="/freelancers"
                icon="👥"
              />
            </div>
          )}

          {user?.role === 'investor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Investment Opportunities"
                description="Browse startups looking for investment"
                link="/opportunities"
                icon="💡"
              />
              <DashboardCard
                title="Portfolio"
                description="Track your investments and their progress"
                link="/portfolio"
                icon="📈"
              />
              <DashboardCard
                title="Pitch Events"
                description="View upcoming pitch events"
                link="/pitch-events"
                icon="🎯"
              />
            </div>
          )}

          {user?.role === 'freelancer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard
                title="Available Projects"
                description="Browse projects matching your skills"
                link="/projects"
                icon="📋"
              />
              <DashboardCard
                title="Your Bids"
                description="Track your project bids and proposals"
                link="/bids"
                icon="🎯"
              />
              <DashboardCard
                title="Profile"
                description="Update your skills and portfolio"
                link="/profile"
                icon="👤"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, link, icon }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(link)}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}