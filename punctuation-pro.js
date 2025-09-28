// --- 1. GET HTML ELEMENTS ---
const sentenceDisplay = document.getElementById('sentence-display');
const questionCounter = document.getElementById('question-counter');
const scoreCounter = document.getElementById('score-counter');
const feedbackMessage = document.getElementById('feedback-message');
const optionButtons = document.querySelectorAll('.option-button');

// --- 2. DEFINE GAME DATA & VARIABLES ---
const sentences = [
    { text: 'The dog is brown', correct: '.' },
    { text: 'What is your name', correct: '?' },
    { text: 'I love ice cream', correct: '!' },
    { text: 'The sky is blue', correct: '.' },
    { text: 'Where are you going', correct: '?' },
    { text: 'Watch out', correct: '!' },
    { text: 'My favorite color is green', correct: '.'},
    { text: 'That is amazing', correct: '!'}
];

let score = 0;
let questionsAnswered = 0;
const totalQuestions = 5;
let currentSentence = {};

// --- 3. GAME LOGIC FUNCTIONS ---

// Function to start a new round or question
function generateNewQuestion() {
    if (questionsAnswered >= totalQuestions) {
        endGame();
        return;
    }

    questionsAnswered++;
    
    // Get a random sentence from the array
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    // Update the display
    sentenceDisplay.textContent = currentSentence.text;
    questionCounter.textContent = `Question: ${questionsAnswered}/${totalQuestions}`;
    feedbackMessage.textContent = '\u00A0'; // Use a non-breaking space to keep height
    feedbackMessage.className = '';

    // Re-enable buttons
    optionButtons.forEach(button => button.disabled = false);
}

// Function to handle the user's choice
function handlePunctuationSelect(event) {
    const selectedPunctuation = event.target.textContent;

    // Disable all buttons to prevent multiple answers
    optionButtons.forEach(button => button.disabled = true);
    
    if (selectedPunctuation === currentSentence.correct) {
        score += 10;
        scoreCounter.textContent = `Score: ${score}`;
        feedbackMessage.textContent = 'Good Job!';
        feedbackMessage.className = 'correct';
    } else {
        feedbackMessage.textContent = `It was a "${currentSentence.correct}"`;
        feedbackMessage.className = 'incorrect';
    }

    // Wait 1.5 seconds before loading the next question
    setTimeout(generateNewQuestion, 1500);
}

// Function to run when the game is over
function endGame() {
    sentenceDisplay.textContent = `Game Over! Your final score is ${score}.`;
    feedbackMessage.textContent = 'Play again? Refresh the page!';
    optionButtons.forEach(button => button.disabled = true);
}


// --- 4. ADD EVENT LISTENERS ---
optionButtons.forEach(button => {
    button.addEventListener('click', handlePunctuationSelect);
});

// --- 5. START THE GAME ---
generateNewQuestion();
