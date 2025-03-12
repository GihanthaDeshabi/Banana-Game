const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


router.post('/register', userController.registerUser);


router.post('/login', userController.loginUser);

router.get('/verify', auth, userController.verifyUser);

module.exports = router;