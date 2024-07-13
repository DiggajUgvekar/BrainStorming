// services/questionService.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import shuffleArray from '../utils/shuffleArray.js';
import {variables} from '../utils/variables.js';
const API_KEY = 'fa81optvNubLaGF/JNbesg==YvbvPrLlMCIFT4kh';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWords(level) {
    let fileName;

    switch (level) {
        case 'easy':
        fileName = '../public/Utils/wordsDoc/1words.txt';
        break;
        case 'medium':
        fileName = '../public/Utils/wordsDoc/2words.txt';
        break;
        case 'hard':
        fileName = '../public/Utils/wordsDoc/3words.txt';
        break;
        default:
        throw new Error('Invalid difficulty level');
    }

    const filePath = path.join(__dirname, '../public', fileName);
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

async function fetchQuestions(level) {
    try {
        const words = await fetchWords(level);
        let questions = variables.questions;
        questions.splice(0, questions.length);
        const fetchPromises = words.map(async (word) => {
            try {
                const response = await axios.get(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                });

                if (response.data && response.data.synonyms && response.data.synonyms.length > 1) {
                    const synonyms = response.data.synonyms;
                    const antonyms = response.data.antonyms;
                    // shuffleArray(synonyms);

                    const correctAnswer = synonyms[0];
                    let incorrectAnswers = antonyms.slice(1, 4);  //array of remaining 3 wrong options 
                    // console.log(correctAnswer)
                    while (incorrectAnswers.includes(correctAnswer)) {
                        shuffleArray(antonyms);
                        incorrectAnswers = antonyms.slice(1, 4);
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

export { fetchQuestions };
