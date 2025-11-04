import mongoose from 'mongoose';

const pitchEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['online', 'offline'], required: true },
    venue: String,
    meetingLink: String
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxParticipants: Number,
  registrations: [{
    entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pitchDeck: String,
    registrationDate: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  industry: [String],
  requirements: String,
  calendarEventId: String // For storing Google Calendar event ID
}, {
  timestamps: true
});

export default mongoose.model('PitchEvent', pitchEventSchema);