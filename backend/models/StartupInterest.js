import mongoose from 'mongoose';

const startupInterestSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Entrepreneur's user ID
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['interested', 'connected', 'declined', 'pending'],
    default: 'interested'
  },
  predictedSuccess: {
    percentage: Number,
    factors: [{
      name: String,
      impact: Number,
      description: String
    }]
  },
  notes: String,
  meetingScheduled: Date,
  initialInvestmentProposal: Number
}, {
  timestamps: true
});

export default mongoose.model('StartupInterest', startupInterestSchema);