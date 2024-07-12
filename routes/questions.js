// routes/questions.js
import express from 'express';
import { fetchQuestions } from '../services/questionService.js';
const router = express.Router();

router.get('/questions', async (req, res) => {
    const referrerUrl = req.headers.referer;
    const level = referrerUrl ? new URL(referrerUrl).searchParams.get('level') : null;

    if (!level) {
        return res.status(400).json({ error: 'Level parameter is missing in the referrer URL.' });
    }

    const questions = await fetchQuestions(level);
    if (questions.length > 0) {
        res.json(questions);
    } else {
        res.status(500).json({ error: 'Failed to load questions. Please try again.' });
    }
});

export default router;
