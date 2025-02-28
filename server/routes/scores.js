// server/routes/scores.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Update user high score
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'Score is required' });
    }
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update high score if new score is higher
    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
    }
    
    res.json({ highScore: user.highScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ highScore: -1 }) // Sort by high score (descending)
      .limit(10) // Get top 10
      .select('username highScore'); // Only return username and high score
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's high score
router.get('/highscore', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('highScore');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ highScore: user.highScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;