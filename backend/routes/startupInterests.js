import express from 'express';
import StartupInterest from '../models/StartupInterest.js';
import { authenticateToken } from '../middleware/auth.js';
import { predictStartupSuccess } from '../utils/predictionModel.js';

const router = express.Router();

// Show interest in a startup
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { startupId, notes, initialInvestmentProposal } = req.body;
    
    // Check if already shown interest
    const existingInterest = await StartupInterest.findOne({
      startup: startupId,
      investor: req.user.id
    });

    if (existingInterest) {
      return res.status(400).json({ message: 'Already shown interest in this startup' });
    }

    // Get prediction for startup success
    const prediction = await predictStartupSuccess(startupId);

    const interest = new StartupInterest({
      startup: startupId,
      investor: req.user.id,
      notes,
      initialInvestmentProposal,
      predictedSuccess: prediction
    });

    await interest.save();
    res.status(201).json(interest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all interests for a startup
router.get('/startup/:startupId', authenticateToken, async (req, res) => {
  try {
    const interests = await StartupInterest.find({ startup: req.params.startupId })
      .populate('investor', 'name email investorDetails')
      .sort('-createdAt');
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all interests from an investor
router.get('/investor', authenticateToken, async (req, res) => {
  try {
    const interests = await StartupInterest.find({ investor: req.user.id })
      .populate('startup', 'name email entrepreneurDetails')
      .sort('-createdAt');
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update interest status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const interest = await StartupInterest.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.json(interest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Schedule a meeting
router.patch('/:id/schedule-meeting', authenticateToken, async (req, res) => {
  try {
    const { meetingScheduled } = req.body;
    const interest = await StartupInterest.findOneAndUpdate(
      { _id: req.params.id },
      { meetingScheduled },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.json(interest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;