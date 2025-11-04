import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const { id } = useParams();

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(bidAmount),
          proposal: bidProposal
        })
      });
      
      if (response.ok) {
        // Refresh project details to show new bid
        fetchProjectDetails();
        setBidAmount('');
        setBidProposal('');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project?.title}
                </h1>
                <div className="flex items-center text-gray-500">
                  <span>Posted {new Date(project?.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{project?.type}</span>
                  <span className="mx-2">•</span>
                  <span>{project?.status}</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-brand-600">
                ${project?.budget}
              </span>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Project Description</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {project?.description}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Project Files</h2>
              <div className="space-y-2">
                {project?.files?.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="flex-1 text-sm text-gray-600">{file.name}</span>
                    <span className="text-sm text-gray-400">{file.size}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bid Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6">Submit a Bid</h2>
            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bid Amount (USD)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proposal
                </label>
                <textarea
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 text-white rounded-md py-2 px-4 hover:bg-brand-700 transition-colors"
              >
                Submit Bid
              </button>
            </form>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-semibold mb-4">About the Client</h2>
            <div className="flex items-center mb-4">
              <img
                src={project?.client?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project?.client?.name)}`}
                alt={project?.client?.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-medium">{project?.client?.name}</h3>
                <p className="text-sm text-gray-500">{project?.client?.title}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Member Since</span>
                <span>{project?.client?.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Projects Posted</span>
                <span>{project?.client?.projectsPosted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg. Response Time</span>
                <span>{project?.client?.responseTime}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-500 block">Budget</span>
                <span className="font-medium text-lg">${project?.budget}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Duration</span>
                <span>{project?.duration}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Experience Level</span>
                <span>{project?.experienceLevel}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Project Type</span>
                <span>{project?.type}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Location</span>
                <span>{project?.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}