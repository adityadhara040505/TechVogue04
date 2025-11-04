import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FreelancerProfile() {
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchFreelancerDetails();
  }, [id]);

  const fetchFreelancerDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/freelancers/${id || 'me'}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setFreelancer(data);
    } catch (error) {
      console.error('Error fetching freelancer details:', error);
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
              src={freelancer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer?.name || '')}`}
              alt={freelancer?.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{freelancer?.name}</h1>
              <p className="text-lg text-gray-600">{freelancer?.title}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">{freelancer?.rating} ({freelancer?.reviewCount} reviews)</span>
                </div>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{freelancer?.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
              Hire Me
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{freelancer?.bio}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer?.portfolio?.map((project, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies?.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {freelancer?.reviews?.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.clientName)}`}
                        alt={review.clientName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{review.clientName}</p>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Skills & Details */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Projects Completed</p>
                  <p className="font-medium">{freelancer?.stats?.projectsCompleted}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="font-medium">{freelancer?.stats?.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Response Time</p>
                  <p className="font-medium">{freelancer?.stats?.responseTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Work Preferences</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-medium">${freelancer?.hourlyRate}/hr</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="font-medium">{freelancer?.availability}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Languages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {freelancer?.languages?.map((lang, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}