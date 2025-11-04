import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  budget: {
    min: Number,
    max: Number,
    type: { type: String, enum: ['fixed', 'hourly'] }
  },
  duration: {
    value: Number,
    unit: { type: String, enum: ['days', 'weeks', 'months'] }
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  attachments: [String],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FreelancerBid' }],
  selectedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'FreelancerBid' },
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'in-progress', 'completed'] },
    payment: Number
  }]
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);