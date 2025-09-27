// --- 1. SETUP THE CANVAS ---
const canvas = document.getElementById('trace-canvas');
const ctx = canvas.getContext('2d');
const feedback = document.getElementById('feedback-message');
const clearButton = document.getElementById('clear-button');
const nextButton = document.getElementById('next-button');

let isDrawing = false;
let currentLetterIndex = 0;

// --- 2. DEFINE THE LETTER PATHS & CHECKPOINTS ---
// We define each letter as a series of points to draw the path.
// The 'checkpoints' are crucial points the user must trace over.
const letters = [
    {
        letter: 'L',
        path: [[100, 100], [100, 300], [300, 300]],
        checkpoints: [{x: 100, y: 200}, {x: 200, y: 300}]
    },
    {
        letter: 'C',
        path: [[300, 100], [100, 200], [300, 300]], // Simple arc points
        checkpoints: [{x: 150, y: 150}, {x: 100, y: 200}, {x: 150, y: 250}]
    }
];

let checkpointsHit = [];


// --- 3. DRAWING FUNCTIONS ---

// Draws the faint gray guide letter
function drawGuide() {
    const letter = letters[currentLetterIndex];
    ctx.strokeStyle = '#e0e0e0'; // Light gray
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(letter.path[0][0], letter.path[0][1]);
    for (let i = 1; i < letter.path.length; i++) {
        ctx.lineTo(letter.path[i][0], letter.path[i][1]);
    }
    ctx.stroke();
}

// Function to start drawing
function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
    checkWin();
}

// The main drawing function
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getMousePos(e);

    ctx.strokeStyle = '#ff6961'; // Pastel red for user's drawing
    ctx.lineWidth = 15;
    ctx.lineTo(x, y);
    ctx.stroke();

    checkCheckpoints(x, y);
}

// --- 4. GAME LOGIC ---

// Helper function to get correct mouse/touch coordinates
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Check if it's a touch event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// Checks if the user's drawing is near a checkpoint
function checkCheckpoints(x, y) {
    const letter = letters[currentLetterIndex];
    letter.checkpoints.forEach((cp, index) => {
        const distance = Math.sqrt(Math.pow(x - cp.x, 2) + Math.pow(y - cp.y, 2));
        if (distance < 20 && !checkpointsHit.includes(index)) {
             // If close enough and not already hit
            checkpointsHit.push(index);
        }
    });
}

// Checks if all checkpoints have been hit
function checkWin() {
    const letter = letters[currentLetterIndex];
    if (checkpointsHit.length === letter.checkpoints.length) {
        feedback.textContent = 'Great Job!';
        feedback.className = 'correct';
    }
}

// Resets the canvas for the current letter
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears everything
    checkpointsHit = []; // Reset hit checkpoints
    feedback.textContent = 'Follow the gray path!';
    feedback.className = '';
    drawGuide(); // Redraw the guide
}

// Loads the next letter in the sequence
function nextLetter() {
    currentLetterIndex = (currentLetterIndex + 1) % letters.length; // Loop back to start
    clearCanvas();
}


// --- 5. ADD EVENT LISTENERS ---
// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

// Button events
clearButton.addEventListener('click', clearCanvas);
nextButton.addEventListener('click', nextLetter);


// --- START THE GAME ---
drawGuide(); // Draw the first letter when the page loads
