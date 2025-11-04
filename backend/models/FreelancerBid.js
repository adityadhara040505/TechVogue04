import mongoose from 'mongoose';

const freelancerBidSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  proposedDuration: {
    value: Number,
    unit: { type: String, enum: ['days', 'weeks', 'months'] }
  },
  coverLetter: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  interviewSchedule: {
    date: Date,
    type: { type: String, enum: ['technical', 'hr', 'project'] },
    meetingLink: String,
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'] }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'verified', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    verificationFee: Number,
    razorpayOrderId: String,
    paymentId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'] }
  }
}, {
  timestamps: true
});

export default mongoose.model('FreelancerBid', freelancerBidSchema);