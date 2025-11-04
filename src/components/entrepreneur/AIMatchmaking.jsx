import { useState, useEffect } from 'react';
import { FaHandshake } from 'react-icons/fa';

export default function AIMatchmaking() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      // Simulated AI matchmaking
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const investors = JSON.parse(localStorage.getItem('users') || '[]')
        .filter(u => u.role === 'investor');
      
      // Simple matching based on industry and investment range
      const profile = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]')
        .find(p => p.userId === currentUser.id);

      const matchedInvestors = investors.map(investor => ({
        ...investor,
        matchScore: Math.random() * 100 // In real app, use AI to calculate match score
      })).sort((a, b) => b.matchScore - a.matchScore);

      setMatches(matchedInvestors);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Matchmaking</h2>
        <button
          onClick={loadMatches}
          className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
        >
          Refresh Matches
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(investor => (
            <div key={investor.id} className="border rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">{investor.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Match Score: {investor.matchScore.toFixed(1)}%</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-600">
                  <FaHandshake />
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 border border-brand-600 text-brand-600 rounded-md hover:bg-brand-50 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches found. Try updating your profile to improve matching.</p>
        </div>
      )}
    </div>
  );
}