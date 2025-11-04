import express from 'express';
import PitchEvent from '../models/PitchEvent.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new pitch event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, industry, requirements } = req.body;
    const organizer = req.user.id; // From auth middleware

    const pitchEvent = new PitchEvent({
      title,
      description,
      date,
      location,
      organizer,
      maxParticipants,
      industry,
      requirements
    });

    await pitchEvent.save();
    res.status(201).json(pitchEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all pitch events
router.get('/', async (req, res) => {
  try {
    const events = await PitchEvent.find()
      .populate('organizer', 'name email')
      .populate('registrations.entrepreneur', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register for a pitch event
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const event = await PitchEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.registrations.some(
      reg => reg.entrepreneur.toString() === req.user.id
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registrations.push({
      entrepreneur: req.user.id,
      pitchDeck: req.body.pitchDeck
    });

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update event status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await PitchEvent.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;