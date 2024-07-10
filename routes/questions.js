// routes/questions.js
const express = require('express');
const { fetchQuestions } = require('../services/questionService');
const router = express.Router();

router.get('/questions', async (req, res) => {
    const questions = await fetchQuestions();
    if (questions.length > 0) {
        res.json(questions);
    } else {
        res.status(500).json({ error: 'Failed to load questions. Please try again.' });
    }
});

module.exports = router;
