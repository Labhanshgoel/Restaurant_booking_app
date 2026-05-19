const express = require('express');
const router = express.Router();
const { suggestDishes, chat } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// Route to suggest dishes based on user prompt (user only)
router.post('/suggest', protect, suggestDishes);

// Route for multi-turn conversation (user only)
router.post('/chat', protect, chat);

module.exports = router;
