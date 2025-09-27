import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";

const lettersToTrace = {
  'A': [ { x: 50, y: 10 }, { x: 20, y: 90 }, { x: 80, y: 90 }, {x: 35, y: 50}, {x: 65, y: 50} ],
  'L': [ { x: 20, y: 10 }, { x: 20, y: 90 }, { x: 80, y: 90 } ],
  'T': [ { x: 50, y: 10 }, { x: 50, y: 90 }, { x: 20, y: 10 }, { x: 80, y: 10 } ],
  'H': [ { x: 20, y: 10 }, { x: 20, y: 90 }, { x: 80, y: 10 }, { x: 80, y: 90 }, { x: 20, y: 50 }, { x: 80, y: 50 } ],
};

export default function LetterTracingGame({ onGameComplete }) {
  const [currentLetter, setCurrentLetter] = useState(null);
  const [dots, setDots] = useState([]);
  const [clickedDots, setClickedDots] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const totalQuestions = 4;

  const generateNewQuestion = useCallback(() => {
    const letterKeys = Object.keys(lettersToTrace);
    const letter = letterKeys[Math.floor(Math.random() * letterKeys.length)];
    
    setCurrentLetter(letter);
    setDots(lettersToTrace[letter]);
    setClickedDots([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleDotClick = (index) => {
    if (feedback || clickedDots.length !== index) {
      // Must click dots in order
      setFeedback('incorrect-order');
      setTimeout(() => setFeedback(null), 800);
      return;
    }

    const newClickedDots = [...clickedDots, index];
    setClickedDots(newClickedDots);

    if (newClickedDots.length === dots.length) {
      // Level complete
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 10);
      setFeedback('correct');

      setTimeout(() => {
        if (newQuestionsAnswered >= totalQuestions) {
          onGameComplete({
            score: score + 10,
            questionsAnswered: newQuestionsAnswered,
            correctAnswers: correctAnswers + 1,
          });
        } else {
          generateNewQuestion();
        }
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <p className="font-body text-sage-green">Question: {questionsAnswered + 1}/{totalQuestions}</p>
        <p className="font-body text-sage-green">Score: {score}</p>
      </div>

      <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm text-center">
        <h2 className="font-heading text-2xl text-sage-green mb-6">Trace the letter by connecting the dots!</h2>
        
        <div className="flex justify-center mb-8">
          <svg width="200" height="200" className="bg-pastel-blue border-4 border-sage-green">
            {/* Draw lines for clicked dots */}
            {clickedDots.slice(1).map((dotIndex, i) => (
              <line 
                key={i}
                x1={`${dots[clickedDots[i]].x}%`} 
                y1={`${dots[clickedDots[i]].y}%`}
                x2={`${dots[dotIndex].x}%`} 
                y2={`${dots[dotIndex].y}%`}
                stroke="var(--sage-green)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            ))}
            {/* Draw dots */}
            {dots.map((dot, index) => (
              <g key={index} onClick={() => handleDotClick(index)} className="cursor-pointer">
                <circle 
                  cx={`${dot.x}%`} 
                  cy={`${dot.y}%`} 
                  r="12" 
                  fill={clickedDots.includes(index) ? 'var(--sage-green)' : 'rgba(255,255,255,0.7)'}
                  stroke="var(--sage-green)"
                  strokeWidth="3"
                />
                <text x={`${dot.x}%`} y={`${dot.y}%`} dy="0.35em" textAnchor="middle" fill={clickedDots.includes(index) ? 'white' : 'var(--sage-green)'} className="font-sans font-bold">
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {feedback && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <PixelCharacter type={feedback === 'correct' ? 'guide' : 'writer'} scale={8} />
            <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
              {feedback === 'correct' ? 'Great tracing!' : feedback === 'incorrect-order' ? 'Wrong order!' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
