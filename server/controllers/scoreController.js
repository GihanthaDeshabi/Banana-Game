const Score = require('../models/Score');

exports.saveScore = async (req, res) => {
  try {
    const { game, score, won } = req.body;
    
    const newScore = new Score({
      userId: req.user.id,
      game,
      score,
      won
    });
    
    const savedScore = await newScore.save();
    
    res.status(201).json(savedScore);
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserScores = async (req, res) => {
  try {
    const { game } = req.query;
    
    const query = { userId: req.user.id };
    if (game) query.game = game;
    
    const scores = await Score.find(query)
      .sort({ date: -1 })
      .limit(10);
    
    res.json(scores);
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHighScores = async (req, res) => {
  try {
    const { game, limit = 10 } = req.query;
    
    if (!game) {
      return res.status(400).json({ message: 'Game parameter is required' });
    }
    
    const highScores = await Score.aggregate([
      { $match: { game } },
      { $sort: { score: -1, date: 1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          score: 1,
          date: 1,
          won: 1,
          username: '$user.username'
        }
      }
    ]);
    
    res.json(highScores);
  } catch (error) {
    console.error('Get high scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};