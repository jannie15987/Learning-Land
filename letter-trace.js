// --- 1. SETUP THE CANVAS ---
const canvas = document.getElementById('trace-canvas');
const ctx = canvas.getContext('2d');
const feedback = document.getElementById('feedback-message');
const clearButton = document.getElementById('clear-button');
const nextButton = document.getElementById('next-button');

let isDrawing = false;
let currentCharacterIndex = 0;

// --- 2. DEFINE THE CHARACTER PATHS & CHECKPOINTS ---
// This is the new, expanded array with all letters and numbers.const characters = [
  // A
  {
    letter: 'A',
    paths: [
      [[150, 300], [200, 100], [250, 300]], // main triangle
      [[170, 200], [230, 200]]              // crossbar
    ],
    checkpoints: [
      {x: 200, y: 120}, // top
      {x: 200, y: 200}  // crossbar
    ]
  },

  // B
  {
    letter: 'B',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 100], [250, 130, 250, 200], [150, 200]], // upper curve
      [[150, 200], [250, 230, 250, 300], [150, 300]]  // lower curve
    ],
    checkpoints: [
      {x: 200, y: 150}, 
      {x: 200, y: 250}
    ]
  },

  // C
  {
    letter: 'C',
    paths: [
      [[250, 120], [200, 100, 120, 200], [200, 300, 250, 280]]
    ],
    checkpoints: [
      {x: 180, y: 150}, 
      {x: 180, y: 250}
    ]
  },

  // D
  {
    letter: 'D',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 100], [250, 180, 250, 220], [150, 300]] // outer curve
    ],
    checkpoints: [
      {x: 200, y: 150}, 
      {x: 200, y: 250}
    ]
  },

  // E
  {
    letter: 'E',
    paths: [
      [[250, 100], [150, 100], [150, 300], [250, 300]], // top/bottom
      [[150, 200], [220, 200]] // middle bar
    ],
    checkpoints: [
      {x: 200, y: 100}, 
      {x: 200, y: 200}, 
      {x: 200, y: 300}
    ]
  },

  // F
  {
    letter: 'F',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 100], [230, 100]], // top bar
      [[150, 200], [220, 200]]  // middle bar
    ],
    checkpoints: [
      {x: 200, y: 100}, 
      {x: 200, y: 200}, 
      {x: 160, y: 250}
    ]
  }
// Add after F
  // G
  {
    letter: 'G',
    paths: [
      [[250, 120], [180, 100, 120, 200], [180, 300, 250, 280], [220, 280], [220, 220]]
    ],
    checkpoints: [
      {x: 180, y: 150},
      {x: 180, y: 250},
      {x: 220, y: 220}
    ]
  },

  // H
  {
    letter: 'H',
    paths: [
      [[150, 100], [150, 300]], // left spine
      [[250, 100], [250, 300]], // right spine
      [[150, 200], [250, 200]]  // crossbar
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 250, y: 200}
    ]
  },

  // I
  {
    letter: 'I',
    paths: [
      [[180, 100], [220, 100]], // top
      [[200, 100], [200, 300]], // middle line
      [[180, 300], [220, 300]]  // bottom
    ],
    checkpoints: [
      {x: 200, y: 200}
    ]
  },

  // J
  {
    letter: 'J',
    paths: [
      [[250, 100], [250, 250, 200, 300], [150, 250]], // hook
      [[180, 100], [250, 100]] // top bar
    ],
    checkpoints: [
      {x: 250, y: 200},
      {x: 200, y: 280}
    ]
  },

  // K
  {
    letter: 'K',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 200], [250, 100]], // diagonal up
      [[150, 200], [250, 300]]  // diagonal down
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 200, y: 150},
      {x: 200, y: 250}
    ]
  },

  // L
  {
    letter: 'L',
    paths: [
      [[150, 100], [150, 300], [250, 300]] // down then across
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 200, y: 300}
    ]
  },

  // M
  {
    letter: 'M',
    paths: [
      [[150, 300], [150, 100], [200, 200], [250, 100], [250, 300]]
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 200, y: 200},
      {x: 250, y: 200}
    ]
  },

  // N
  {
    letter: 'N',
    paths: [
      [[150, 300], [150, 100], [250, 300], [250, 100]]
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 200, y: 200},
      {x: 250, y: 200}
    ]
  },

  // O
  {
    letter: 'O',
    paths: [
      [[200, 100], [140, 140, 140, 200], [140, 260, 200, 300],
       [260, 260, 260, 200], [260, 140, 200, 100]]
    ],
    checkpoints: [
      {x: 200, y: 120},
      {x: 140, y: 200},
      {x: 200, y: 280},
      {x: 260, y: 200}
    ]
  },

  // P
  {
    letter: 'P',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 100], [250, 120, 250, 200], [150, 200]] // upper curve
    ],
    checkpoints: [
      {x: 200, y: 150}
    ]
  },

  // Q
  {
    letter: 'Q',
    paths: [
      [[200, 100], [140, 140, 140, 200], [140, 260, 200, 300],
       [260, 260, 260, 200], [260, 140, 200, 100]],
      [[220, 220], [260, 300]] // tail
    ],
    checkpoints: [
      {x: 200, y: 120},
      {x: 200, y: 280},
      {x: 240, y: 260}
    ]
  },

  // R
  {
    letter: 'R',
    paths: [
      [[150, 100], [150, 300]], // spine
      [[150, 100], [250, 120, 250, 200], [150, 200]], // upper curve
      [[150, 200], [250, 300]] // diagonal leg
    ],
    checkpoints: [
      {x: 200, y: 150},
      {x: 200, y: 250}
    ]
  },

  // S
  {
    letter: 'S',
    paths: [
      [[250, 120], [180, 100, 150, 160], [200, 200],
       [250, 240, 200, 300], [150, 280]]
    ],
    checkpoints: [
      {x: 200, y: 140},
      {x: 200, y: 200},
      {x: 200, y: 260}
    ]
  },

  // T
  {
    letter: 'T',
    paths: [
      [[150, 100], [250, 100]], // top bar
      [[200, 100], [200, 300]]  // spine
    ],
    checkpoints: [
      {x: 200, y: 200}
    ]
  },

  // U
  {
    letter: 'U',
    paths: [
      [[150, 100], [150, 250, 200, 300], [250, 250, 250, 100]]
    ],
    checkpoints: [
      {x: 150, y: 200},
      {x: 200, y: 280},
      {x: 250, y: 200}
    ]
  },

  // V
  {
    letter: 'V',
    paths: [
      [[150, 100], [200, 300], [250, 100]]
    ],
    checkpoints: [
      {x: 200, y: 200}
    ]
  },

  // W
  {
    letter: 'W',
    paths: [
      [[150, 100], [170, 300], [200, 180], [230, 300], [250, 100]]
    ],
    checkpoints: [
      {x: 170, y: 220},
      {x: 200, y: 180},
      {x: 230, y: 220}
    ]
  },

  // X
  {
    letter: 'X',
    paths: [
      [[150, 100], [250, 300]],
      [[250, 100], [150, 300]]
    ],
    checkpoints: [
      {x: 200, y: 200}
    ]
  },

  // Y
  {
    letter: 'Y',
    paths: [
      [[150, 100], [200, 200], [250, 100]],
      [[200, 200], [200, 300]]
    ],
    checkpoints: [
      {x: 200, y: 200}
    ]
  },

  // Z
  {
    letter: 'Z',
    paths: [
      [[150, 100], [250, 100], [150, 300], [250, 300]]
    ],
    checkpoints: [
      {x: 200, y: 100},
      {x: 200, y: 200},
      {x: 200, y: 300}
    ]
  }
];


let checkpointsHit = [];


// --- 3. DRAWING FUNCTIONS ---

// **UPDATED** Draws the faint gray guide letter
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
        if (distance < 25 && !checkpointsHit.includes(index)) { 
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    checkpointsHit = []; 
    feedback.textContent = 'Follow the gray path!';
    feedback.className = '';
    drawGuide(); 
}

// Loads the next character in the sequence
function nextLetter() {
    currentCharacterIndex = (currentCharacterIndex + 1) % characters.length; 
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
