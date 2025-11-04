import { useState, useEffect } from 'react';
import { FaHandshake, FaChartLine, FaDollarSign, FaUsers } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Criteria weights for matching
const WEIGHTS = {
  industryMatch: 0.3,
  investmentRangeMatch: 0.25,
  stageMatch: 0.2,
  teamSizeMatch: 0.15,
  marketMatch: 0.1
};

export default function AIMatchmaking() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startupProfile, setStartupProfile] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const calculateMatchScore = (investor, startup) => {
    let score = 0;

    // Industry match
    if (investor.industries?.some(i => startup.industry?.includes(i))) {
      score += WEIGHTS.industryMatch;
    }

    // Investment range match
    if (investor.investmentRange) {
      const [minInv, maxInv] = investor.investmentRange;
      const fundingNeeded = startup.fundingNeeded || 0;
      if (fundingNeeded >= minInv && fundingNeeded <= maxInv) {
        score += WEIGHTS.investmentRangeMatch;
      }
    }

    // Stage match
    if (investor.preferredStages?.includes(startup.stage)) {
      score += WEIGHTS.stageMatch;
    }

    // Team size match
    if (startup.teamSize >= (investor.minTeamSize || 0)) {
      score += WEIGHTS.teamSizeMatch;
    }

    // Market size match
    if (startup.marketSize >= (investor.minMarketSize || 0)) {
      score += WEIGHTS.marketMatch;
    }

    // Add some controlled randomness for variety (±5%)
    const randomFactor = 0.95 + Math.random() * 0.1;
    score *= randomFactor;

    return Math.min(score * 100, 100); // Convert to percentage
  };

  const loadMatches = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        toast.error('Please sign in to view matches');
        return;
      }

      // Get startup profile
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]');
      const profile = profiles.find(p => p.userId === currentUser.id);
      
      if (!profile) {
        setStartupProfile(null);
        setLoading(false);
        return;
      }

      setStartupProfile(profile);

      // Get investors with their preferences
      const investors = JSON.parse(localStorage.getItem('users') || '[]')
        .filter(u => u.role === 'investor')
        .map(investor => {
          // Get investor profile data
          const investorProfiles = JSON.parse(localStorage.getItem('investorProfiles') || '[]');
          const investorProfile = investorProfiles.find(p => p.userId === investor.id) || {};
          
          return {
            ...investor,
            ...investorProfile,
            industries: investorProfile.industries || [],
            investmentRange: investorProfile.investmentRange || [0, Infinity],
            preferredStages: investorProfile.preferredStages || [],
            deals: JSON.parse(localStorage.getItem('deals') || '[]')
              .filter(d => d.investorId === investor.id)
          };
        });

      // Calculate match scores
      const matchedInvestors = investors.map(investor => ({
        ...investor,
        matchScore: calculateMatchScore(investor, profile),
        stats: {
          totalInvestments: investor.deals?.filter(d => d.status === 'completed')?.length || 0,
          avgDealSize: investor.deals?.filter(d => d.status === 'completed')
            .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0) / 
            (investor.deals?.filter(d => d.status === 'completed')?.length || 1),
          activeDeals: investor.deals?.filter(d => d.status === 'active')?.length || 0
        }
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Show top 10 matches

      setMatches(matchedInvestors);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const renderMatchInsights = () => (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="font-medium text-lg mb-4">Match Insights</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Industry Match</span>
            <span className="font-medium">{(WEIGHTS.industryMatch * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-brand-600 rounded-full" 
              style={{ width: `${WEIGHTS.industryMatch * 100}%` }} 
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Investment Range</span>
            <span className="font-medium">{(WEIGHTS.investmentRangeMatch * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-brand-600 rounded-full" 
              style={{ width: `${WEIGHTS.investmentRangeMatch * 100}%` }} 
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Stage Match</span>
            <span className="font-medium">{(WEIGHTS.stageMatch * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-brand-600 rounded-full" 
              style={{ width: `${WEIGHTS.stageMatch * 100}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Tips to Improve Matches</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Complete your startup profile</li>
          <li>• Add more team members</li>
          <li>• Upload pitch deck</li>
          <li>• Verify company details</li>
        </ul>
      </div>
    </div>
  );

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

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mx-auto" />
          <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
        </div>
      )}

      {!loading && !startupProfile && (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <FaUsers className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium mb-2">Complete Your Profile</h3>
          <p className="text-gray-600 mb-4">Fill out your startup profile to get matched with investors</p>
          <button className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
            Create Profile
          </button>
        </div>
      )}

      {!loading && startupProfile && matches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No matches found. Try updating your profile to improve matching.</p>
        </div>
      )}

      {!loading && startupProfile && matches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {matches.map(investor => (
                <div key={investor.id} className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{investor.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-600 rounded-full"
                            style={{ width: `${investor.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-brand-600">
                          {investor.matchScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-600">
                      <FaHandshake />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaChartLine className="text-gray-400" />
                      <span>{investor.stats.totalInvestments} investments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-gray-400" />
                      <span>${(investor.stats.avgDealSize / 1000).toFixed(0)}k avg</span>
                    </div>
                  </div>

                  {investor.industries?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {investor.industries.slice(0, 3).map(industry => (
                        <span 
                          key={industry}
                          className="px-2 py-1 text-xs rounded-full bg-brand-50 text-brand-700"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
                      Connect
                    </button>
                    <button className="w-full px-4 py-2 border border-brand-600 text-brand-600 rounded-md hover:bg-brand-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {renderMatchInsights()}
          </div>
        </div>
      )}
    </div>
  );
}