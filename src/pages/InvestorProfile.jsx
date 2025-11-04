import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function InvestorProfile() {
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchInvestorDetails();
  }, [id]);

  const fetchInvestorDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/investors/${id || 'me'}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setInvestor(data);
    } catch (error) {
      console.error('Error fetching investor details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center">
            <img
              src={investor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(investor?.name || '')}`}
              alt={investor?.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{investor?.name}</h1>
              <p className="text-lg text-gray-600">{investor?.title}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
              Contact
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{investor?.bio}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Investment Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investor?.portfolio?.map((investment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium">{investment.companyName}</h3>
                    <p className="text-sm text-gray-500">{investment.sector}</p>
                    <p className="text-brand-600 text-sm">{investment.stage}</p>
                    <p className="text-gray-600 text-sm mt-2">{investment.year}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {investor?.activities?.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-4 w-4 rounded-full bg-brand-600 mt-2"></div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-600">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Details */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Investment Focus</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Sectors</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {investor?.sectors?.map((sector, index) => (
                      <span key={index} className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Investment Range</p>
                  <p className="font-medium">{investor?.investmentRange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Stages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {investor?.preferredStages?.map((stage, index) => (
                      <span key={index} className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Investments</p>
                  <p className="font-medium">{investor?.stats?.totalInvestments}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Portfolio</p>
                  <p className="font-medium">{investor?.stats?.activePortfolio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Successful Exits</p>
                  <p className="font-medium">{investor?.stats?.successfulExits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}