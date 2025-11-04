import { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaHandshake } from 'react-icons/fa';

export default function Collaborate() {
  const [collaborations, setCollaborations] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  
  useEffect(() => {
    // Load collaborations from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('collaborations') || '[]');
      const requests = JSON.parse(localStorage.getItem('collaborationRequests') || '[]');
      setCollaborations(stored);
      setActiveRequests(requests);
    } catch (error) {
      console.error('Error loading collaborations:', error);
    }
  }, []);

  const handleCreateRequest = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'collaboration',
      status: 'open',
      createdAt: new Date().toISOString(),
      skills: ['Business Development', 'Marketing', 'Technology'],
      description: 'Looking for co-founders and team members for a tech startup'
    };

    const updated = [...activeRequests, newRequest];
    setActiveRequests(updated);
    localStorage.setItem('collaborationRequests', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Collaborate</h2>
        <button
          onClick={handleCreateRequest}
          className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
        >
          Create Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Collaborations */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Active Collaborations</h3>
          <div className="space-y-4">
            {collaborations.map(collab => (
              <div key={collab.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-600">
                    <FaUsers />
                  </div>
                  <div>
                    <h4 className="font-medium">{collab.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{collab.description}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-sm text-brand-600 hover:text-brand-700">
                        Message Team
                      </button>
                      <button className="text-sm text-brand-600 hover:text-brand-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {collaborations.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active collaborations</p>
            )}
          </div>
        </div>

        {/* Requests Panel */}
        <div>
          <h3 className="text-lg font-medium mb-4">Collaboration Requests</h3>
          <div className="space-y-4">
            {activeRequests.map(request => (
              <div key={request.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-100 text-accent-600">
                    <FaHandshake />
                  </div>
                  <div>
                    <h4 className="font-medium">{request.userName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.skills.map(skill => (
                        <span key={skill} className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="mt-3 text-sm text-brand-600 hover:text-brand-700">
                      Connect →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {activeRequests.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active requests</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}