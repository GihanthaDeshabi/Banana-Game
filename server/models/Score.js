const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: String,
    required: true,
    enum: ['banana-tap', 'math-game']
  },
  score: {
    type: Number,
    required: true
  },
  won: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

ScoreSchema.index({ userId: 1, game: 1, date: -1 });

module.exports = mongoose.model('Score', ScoreSchema);