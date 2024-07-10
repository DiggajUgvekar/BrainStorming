// services/questionService.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const shuffleArray = require('../utils/shuffleArray');
const API_KEY = 'fa81optvNubLaGF/JNbesg==YvbvPrLlMCIFT4kh';

async function fetchWords() {
    const filePath = path.join(__dirname, '../public', 'words.txt');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let words = data.trim().split('\n');
        words = shuffleArray(words);
        return words;
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
}

async function fetchQuestions() {
    try {
        const words = await fetchWords();
        let questions = [];

        const fetchPromises = words.map(async (word) => {
            try {
                const response = await axios.get(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                });

                if (response.data && response.data.synonyms && response.data.synonyms.length > 1) {
                    const synonyms = response.data.synonyms;
                    shuffleArray(synonyms);

                    const correctAnswer = synonyms[0];
                    let incorrectAnswers = synonyms.slice(1, 4);  //array of remaining 3 wrong options 

                    while (incorrectAnswers.includes(correctAnswer)) {
                        shuffleArray(synonyms);
                        incorrectAnswers = synonyms.slice(1, 4);
                    }

                    const answers = [
                        { text: correctAnswer, correct: true },
                        ...incorrectAnswers.map(incorrectAnswer => ({ text: incorrectAnswer, correct: false }))
                    ];

                    shuffleArray(answers);

                    questions.push({
                        question: `What is the synonym of '${word}'?`,
                        answers: answers
                    });
                }
            } catch (error) {
                console.error(`Failed to fetch synonyms for ${word}:`, error);
            }
        });

        await Promise.all(fetchPromises);
        return questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

module.exports = { fetchQuestions };
