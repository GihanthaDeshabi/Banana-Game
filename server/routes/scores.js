const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const auth = require('../middleware/auth');

router.post('/', auth, scoreController.saveScore);


router.get('/', auth, scoreController.getUserScores);


router.get('/highscores', scoreController.getHighScores);

module.exports = router;