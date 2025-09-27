// --- 1. SETUP THE CANVAS ---
const canvas = document.getElementById('trace-canvas');
const ctx = canvas.getContext('2d');
const feedback = document.getElementById('feedback-message');
const clearButton = document.getElementById('clear-button');
const nextButton = document.getElementById('next-button');

let isDrawing = false;
let currentCharacterIndex = 0;

// --- 2. DEFINE THE CHARACTER PATHS & CHECKPOINTS ---
// The 'paths' property is now an array of paths to support multi-stroke characters.
const characters = [
    // Letters
    { letter: 'A', paths: [[[100, 300], [200, 100], [300, 300]], [[150, 225], [250, 225]]], checkpoints: [{x: 200, y: 150}, {x: 200, y: 225}] },
    { letter: 'B', paths: [[[100, 100], [100, 300]], [[100, 100], [250, 125], [100, 200]], [[100, 200], [300, 225], [100, 300]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 150}, {x: 225, y: 275}] },
    { letter: 'C', paths: [[[300, 100], [150, 150], [100, 200], [150, 250], [300, 300]]], checkpoints: [{x: 175, y: 125}, {x: 100, y: 200}, {x: 175, y: 275}] },
    { letter: 'D', paths: [[[100, 100], [100, 300]], [[100, 100], [300, 200], [100, 300]]], checkpoints: [{x: 100, y: 200}, {x: 250, y: 200}] },
    { letter: 'E', paths: [[[300, 100], [100, 100]], [[300, 200], [100, 200]], [[300, 300], [100, 300]], [[100, 100], [100, 300]]], checkpoints: [{x: 200, y: 100}, {x: 100, y: 200}, {x: 200, y: 300}] },
    { letter: 'F', paths: [[[300, 100], [100, 100]], [[250, 200], [100, 200]], [[100, 100], [100, 300]]], checkpoints: [{x: 200, y: 100}, {x: 100, y: 200}] },
    { letter: 'G', paths: [[[300, 100], [150, 125], [100, 200], [150, 275], [300, 300], [200, 300], [200, 225]]], checkpoints: [{x: 125, y: 150}, {x: 125, y: 250}, {x: 250, y: 300}] },
    { letter: 'H', paths: [[[100, 100], [100, 300]], [[300, 100], [300, 300]], [[100, 200], [300, 200]]], checkpoints: [{x: 100, y: 150}, {x: 200, y: 200}, {x: 300, y: 250}] },
    { letter: 'I', paths: [[[150, 100], [250, 100]], [[200, 100], [200, 300]], [[150, 300], [250, 300]]], checkpoints: [{x: 200, y: 200}] },
    { letter: 'J', paths: [[[150, 300], [200, 300], [225, 250], [225, 100]]], checkpoints: [{x: 225, y: 200}, {x: 175, y: 300}] },
    { letter: 'K', paths: [[[100, 100], [100, 300]], [[300, 100], [100, 200], [300, 300]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 150}, {x: 200, y: 250}] },
    { letter: 'L', paths: [[[100, 100], [100, 300], [300, 300]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 300}] },
    { letter: 'M', paths: [[[100, 300], [100, 100], [200, 200], [300, 100], [300, 300]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 200}, {x: 300, y: 200}] },
    { letter: 'N', paths: [[[100, 300], [100, 100], [300, 300], [300, 100]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 200}, {x: 300, y: 200}] },
    { letter: 'O', paths: [[[200, 100], [125, 125], [100, 200], [125, 275], [200, 300], [275, 275], [300, 200], [275, 125], [200, 100]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 100}, {x: 300, y: 200}, {x: 200, y: 300}] },
    { letter: 'P', paths: [[[100, 300], [100, 100], [250, 100], [250, 200], [100, 200]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 150}] },
    { letter: 'Q', paths: [[[200, 100], [125, 125], [100, 200], [125, 275], [200, 300], [275, 275], [300, 200], [275, 125], [200, 100]], [[225, 225], [300, 300]]], checkpoints: [{x: 100, y: 200}, {x: 300, y: 200}, {x: 200, y: 300}] },
    { letter: 'R', paths: [[[100, 300], [100, 100], [250, 100], [250, 200], [100, 200]], [[200, 200], [300, 300]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 150}, {x: 250, y: 250}] },
    { letter: 'S', paths: [[[300, 100], [150, 125], [200, 200], [250, 275], [100, 300]]], checkpoints: [{x: 225, y: 100}, {x: 200, y: 200}, {x: 175, y: 300}] },
    { letter: 'T', paths: [[[100, 100], [300, 100]], [[200, 100], [200, 300]]], checkpoints: [{x: 200, y: 100}, {x: 200, y: 200}] },
    { letter: 'U', paths: [[[100, 100], [100, 250], [200, 300], [300, 250], [300, 100]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 300}, {x: 300, y: 200}] },
    { letter: 'V', paths: [[[100, 100], [200, 300], [300, 100]]], checkpoints: [{x: 150, y: 200}, {x: 200, y: 300}, {x: 250, y: 200}] },
    { letter: 'W', paths: [[[100, 100], [150, 300], [200, 200], [250, 300], [300, 100]]], checkpoints: [{x: 125, y: 200}, {x: 200, y: 200}, {x: 275, y: 200}] },
    { letter: 'X', paths: [[[100, 100], [300, 300]], [[300, 100], [100, 300]]], checkpoints: [{x: 200, y: 200}] },
    { letter: 'Y', paths: [[[100, 100], [200, 200], [300, 100]], [[200, 200], [200, 300]]], checkpoints: [{x: 150, y: 150}, {x: 200, y: 250}] },
    { letter: 'Z', paths: [[[100, 100], [300, 100], [100, 300], [300, 300]]], checkpoints: [{x: 200, y: 100}, {x: 200, y: 200}, {x: 200, y: 300}] },
    // Numbers
    { letter: '0', paths: [[[200, 100], [125, 125], [100, 200], [125, 275], [200, 300], [275, 275], [300, 200], [275, 125], [200, 100]]], checkpoints: [{x: 100, y: 200}, {x: 200, y: 100}, {x: 300, y: 200}, {x: 200, y: 300}] },
    { letter: '1', paths: [[[150, 150], [200, 100], [200, 300]]], checkpoints: [{x: 200, y: 200}] },
    { letter: '2', paths: [[[100, 150], [150, 100], [300, 100], [200, 200], [100, 300], [300, 300]]], checkpoints: [{x: 200, y: 100}, {x: 200, y: 200}, {x: 200, y: 300}] },
    { letter: '3', paths: [[[100, 125], [250, 125], [150, 200], [250, 275], [100, 275]]], checkpoints: [{x: 200, y: 125}, {x: 150, y: 200}, {x: 200, y: 275}] },
    { letter: '4', paths: [[[250, 100], [100, 200], [300, 200]], [[250, 100], [250, 300]]], checkpoints: [{x: 175, y: 200}, {x: 250, y: 200}] },
    { letter: '5', paths: [[[300, 100], [100, 100]], [[100, 100], [100, 200], [200, 200], [300, 250], [250, 300], [150, 300]]]], checkpoints: [{x: 200, y: 100}, {x: 100, y: 200}, {x: 200, y: 300}] },
    { letter: '6', paths: [[[250, 100], [150, 150], [100, 200], [150, 275], [250, 275], [200, 225], [150, 200]]], checkpoints: [{x: 175, y: 125}, {x: 100, y: 200}, {x: 200, y: 275}] },
    { letter: '7', paths: [[[100, 100], [300, 100], [150, 300]]], checkpoints: [{x: 200, y: 100}, {x: 175, y: 200}] },
    { letter: '8', paths: [[[200, 200], [125, 125], [200, 100], [275, 125], [200, 200], [125, 275], [200, 300], [275, 275], [200, 200]]], checkpoints: [{x: 160, y: 115}, {x: 160, y: 285}, {x: 200, y: 200}] },
    { letter: '9', paths: [[[150, 300], [250, 250], [300, 200], [250, 125], [150, 125], [200, 175], [250, 200]]], checkpoints: [{x: 225, y: 275}, {x: 300, y: 200}, {x: 200, y: 125}] },
];

let checkpointsHit = [];


// --- 3. DRAWING FUNCTIONS ---

// **UPDATED** Draws the faint gray guide letter from the new 'paths' structure
function drawGuide() {
    const character = characters[currentCharacterIndex];
    ctx.strokeStyle = '#e0e0e0'; // Light gray
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    character.paths.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0], path[i][1]);
        }
        ctx.stroke();
    });
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
    const character = characters[currentCharacterIndex];
    character.checkpoints.forEach((cp, index) => {
        const distance = Math.sqrt(Math.pow(x - cp.x, 2) + Math.pow(y - cp.y, 2));
        if (distance < 25 && !checkpointsHit.includes(index)) { // Increased radius for easier hits
             // If close enough and not already hit
            checkpointsHit.push(index);
        }
    });
}

// Checks if all checkpoints have been hit
function checkWin() {
    const character = characters[currentCharacterIndex];
    if (checkpointsHit.length === character.checkpoints.length) {
        feedback.textContent = 'Great Job!';
        feedback.className = 'correct';
    }
}

// Resets the canvas for the current character
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears everything
    checkpointsHit = []; // Reset hit checkpoints
    feedback.textContent = 'Follow the gray path!';
    feedback.className = '';
    drawGuide(); // Redraw the guide
}

// Loads the next character in the sequence
function nextLetter() {
    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length; // Loop back to start
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
drawGuide(); // Draw the first character when the page loads
