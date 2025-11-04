import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['entrepreneur', 'investor', 'freelancer'] 
  },
  profilePicture: String,
  bio: String,
  verificationBadge: { type: Boolean, default: false },
  // Role-specific details
  entrepreneurDetails: {
    startupName: String,
    industry: String,
    stage: String,
    teamSize: Number,
    fundingNeeded: Number,
    pitchDeck: String,
    milestones: [{
      title: String,
      description: String,
      targetDate: Date,
      fundingRequired: Number,
      status: { type: String, enum: ['pending', 'completed', 'in-progress'] },
      fundingReceived: Number
    }]
  },
  investorDetails: {
    companyName: String,
    investmentRange: {
      min: Number,
      max: Number
    },
    preferredIndustries: [String],
    previousInvestments: Number
  },
  freelancerDetails: {
    skills: [String],
    experience: Number,
    portfolio: String,
    hourlyRate: Number,
    resume: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);