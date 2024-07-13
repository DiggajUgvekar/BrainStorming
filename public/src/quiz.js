
import { variables } from '../Utils/variables.js';

variables.lives = 3;

async function fetchQuestions() {
  try {
    const response = await fetch("/api/questions");
    if (!response.ok) {
      throw new Error("Failed to load questions. Please try again.");
    }
    variables.Questions = await response.json();
    if (variables.Questions.length > 0) {
      loadNextQuestion();
    } else {
      throw new Error("No questions fetched");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    showFeedback("Failed to load questions. Please try again.");
  }
}

function startTimer() {
  let timeLeft = 10;
  const timerElement = document.getElementById('time');
  
  variables.countdown = setInterval(() => {
    if (timeLeft < 0) {
      clearInterval(variables.countdown);
      disableAnswers();
      showFeedback("Time's up!");
      showFinalScoreLost();
    } else {
      timerElement.textContent = timeLeft;
      if (timeLeft <= 3) {
        timerElement.classList.add('blink');
        timerElement.style.color = 'red';
      } else {
        timerElement.classList.add('blink');
        timerElement.style.color = 'black';
      }
      timeLeft -= 1;
    }
  }, 1000);
}

function checkAnswer(isCorrect, btn) {
  disableAnswers();
  clearInterval(variables.countdown);
  
  if (isCorrect) {
    variables.score += 10;
    const scoreElement = document.getElementById('score-value');
    scoreElement.textContent = variables.score;
    btn.style.backgroundColor = "green";
  } else {
    variables.lives -= 1;  // Decrement lives on wrong answer
    updateLivesDisplay();  // Update lives display
    btn.style.backgroundColor = "red";
    showCorrectAnswer();
    
    if (variables.lives <= 0) {
      showFinalScoreLost();  // Show loss screen if lives are depleted
      return;
    }
  }
  
  const nextContainer = document.getElementById('next-container');
  if (nextContainer) {
    nextContainer.style.display = 'block';
  }
}

function showFeedback(message) {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.style.display = 'block';
  feedbackElement.innerHTML = `<h2>${message}</h2>`;
}

function showCorrectAnswer() {
  const currentQuestion = variables.Questions[variables.currentQuestionIndex];
  if (!currentQuestion || !currentQuestion.answers) {
    console.error('Error: Question or answers are undefined.');
    return;
  }
  
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach((btn, index) => {
    if (currentQuestion.answers[index] && currentQuestion.answers[index].correct) {
      btn.style.backgroundColor = "green";
    }
  });
}

function disableAnswers() {
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
  });
}

function loadNextQuestion() {
  if (variables.currentQuestionIndex >= 10) {
    showFeedback("Quiz Completed!");
    document.getElementById('next-container').style.display = 'none';
    showFinalScore();
    return;
  }
  
  const currentQuestion = variables.Questions[variables.currentQuestionIndex];
  const questionContainer = document.getElementById('question-container');
  const questionElement = questionContainer.querySelector('.question h2');
  const answersContainer = questionContainer.querySelector('.answers');

  questionElement.textContent = currentQuestion.question;
  answersContainer.innerHTML = '';

  document.getElementById('number').textContent = variables.currentQuestionIndex + 1; //display question number
  // Display 4 options of answer 
  currentQuestion.answers.forEach(answer => {
    const btn = document.createElement('button');
    btn.textContent = answer.text;
    btn.classList.add('answer-btn');
    btn.onclick = () => checkAnswer(answer.correct, btn);
    answersContainer.appendChild(btn);
  });
  
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('next-container').style.display = 'none';
  startTimer();
  variables.currentQuestionIndex++;
}
function quitQuiz() {
  clearInterval(variables.countdown);
  showFinalScore();
}
function showFinalScore() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `
  <div id="final-score">
  <h2>Quiz Completed!</h2>
  <h3>Your final score is: ${variables.score}</h3>
  <button id="restart-btn" class="next-btn" onclick="window.location.reload()">Restart Quiz</button>
  </div>
    `;
}

function showFinalScoreLost() {
  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = `
  <div id="final-score">
  <h2>You Lost!</h2>
  <h3>Your final score is: ${variables.score}</h3>
  <button id="restart-btn" class="next-btn" onclick="window.location.reload()">Try again</button>
  </div>
    `;
}

// Add an element to display lives
document.addEventListener("DOMContentLoaded", () => {
  const livesContainer = document.createElement('div');
  livesContainer.id = 'lives-container';
  livesContainer.innerHTML = `
  <span>Lives: </span><span id="lives-value">${getLivesIcons()}</span>
  `;
  document.getElementById('info-container').append(livesContainer);
});

function updateLivesDisplay() {
  const livesElement = document.getElementById('lives-value');
  livesElement.innerHTML = getLivesIcons();
}

function getLivesIcons() {
  let icons = '';
  for (let i = 0; i < variables.lives; i++) {
    icons += '❤️';
  }
  return icons;
}

document.getElementById('next-btn').addEventListener('click', loadNextQuestion);
document.getElementById('quit-btn').addEventListener('click', quitQuiz);
document.addEventListener("DOMContentLoaded", fetchQuestions);