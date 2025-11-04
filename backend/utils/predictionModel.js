import User from '../models/User.js';

export const predictStartupSuccess = async (startupId) => {
  try {
    const startup = await User.findById(startupId);
    if (!startup || startup.role !== 'entrepreneur') {
      throw new Error('Invalid startup ID');
    }

    // Implement your prediction logic here
    // This is a simple example - you would want to use more sophisticated
    // machine learning models in production
    const factors = [
      {
        name: 'Team Size',
        impact: calculateTeamSizeImpact(startup.entrepreneurDetails.teamSize),
        description: 'Impact based on current team size'
      },
      {
        name: 'Industry',
        impact: calculateIndustryImpact(startup.entrepreneurDetails.industry),
        description: 'Market potential in the chosen industry'
      },
      {
        name: 'Funding Required',
        impact: calculateFundingImpact(startup.entrepreneurDetails.fundingNeeded),
        description: 'Assessment based on funding requirements'
      }
    ];

    const totalImpact = factors.reduce((sum, factor) => sum + factor.impact, 0);
    const percentage = Math.min(Math.round(totalImpact / factors.length * 100), 100);

    return {
      percentage,
      factors
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

// Helper functions for prediction calculations
const calculateTeamSizeImpact = (teamSize) => {
  if (!teamSize) return 0.5;
  if (teamSize >= 10) return 1;
  return 0.5 + (teamSize / 20);
};

const calculateIndustryImpact = (industry) => {
  const highGrowthIndustries = [
    'technology', 'ai', 'healthcare', 'fintech', 'edtech',
    'cleantech', 'biotech', 'ecommerce'
  ];
  
  if (!industry) return 0.5;
  return highGrowthIndustries.includes(industry.toLowerCase()) ? 0.8 : 0.6;
};

const calculateFundingImpact = (fundingNeeded) => {
  if (!fundingNeeded) return 0.5;
  // Consider lower funding requirements as potentially more sustainable
  if (fundingNeeded <= 100000) return 0.9;
  if (fundingNeeded <= 500000) return 0.8;
  if (fundingNeeded <= 1000000) return 0.7;
  return 0.6;
};