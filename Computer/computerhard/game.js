const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Fetch questions from local JSON file
fetch('questions.json')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        // Shuffle the loaded questions array
        loadedQuestions.sort(() => Math.random() - 0.5);

        // Select the first 20 questions from the shuffled array
        availableQuestions = loadedQuestions.slice(0, 20);

        startGame(); // Start the game after questions are loaded
    })
    .catch((err) => {
        console.error(err);
    });

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20; // Set to 10 for selecting 10 questions

function startGame() {
    questionCounter = 0;
    score = 0;
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

function getNewQuestion() {
    if (questionCounter >= MAX_QUESTIONS) {
        // No more questions or reached maximum question limit
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('./end.html'); // Go to end page
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    // Select a random question from availableQuestions array
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    // Display the current question and choices
    question.innerText = currentQuestion.question;
    choices.forEach((choice, index) => {
        choice.innerText = currentQuestion['choice' + (index + 1)];
    });

    // Remove the used question from availableQuestions array
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
}

// Event listener for choice selection
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = Number(selectedChoice.dataset['number']);

        const classToApply = selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}