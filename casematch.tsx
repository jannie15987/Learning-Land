import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function CaseMatchingGame({ onGameComplete }) {
  const [upper, setUpper] = useState([]);
  const [lower, setLower] = useState([]);
  const [selectedUpper, setSelectedUpper] = useState(null);
  const [selectedLower, setSelectedLower] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const pairsToMatch = 4;

  const generateNewQuestion = useCallback(() => {
    const selectedLetters = letters.sort(() => 0.5 - Math.random()).slice(0, pairsToMatch);
    setUpper(selectedLetters.sort(() => 0.5 - Math.random()));
    setLower(selectedLetters.map(l => l.toLowerCase()).sort(() => 0.5 - Math.random()));
    setMatchedPairs([]);
    setSelectedUpper(null);
    setSelectedLower(null);
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  useEffect(() => {
    if (selectedUpper && selectedLower) {
      if (selectedUpper.toLowerCase() === selectedLower) {
        setScore(score + 10);
        setFeedback('correct');
        setMatchedPairs([...matchedPairs, selectedUpper]);
      } else {
        setFeedback('incorrect');
      }
      setTimeout(() => {
        setSelectedUpper(null);
        setSelectedLower(null);
        setFeedback(null);
      }, 1000);
    }
  }, [selectedUpper, selectedLower, matchedPairs, score]);

  useEffect(() => {
    if (matchedPairs.length === pairsToMatch && pairsToMatch > 0) {
      onGameComplete({
        score: score,
        questionsAnswered: pairsToMatch,
        correctAnswers: pairsToMatch,
      });
    }
  }, [matchedPairs, pairsToMatch, onGameComplete, score]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <p className="font-body text-sage-green">Pairs Matched: {matchedPairs.length}/{pairsToMatch}</p>
        <p className="font-body text-sage-green">Score: {score}</p>
      </div>

      <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm text-center">
        <h2 className="font-heading text-2xl text-sage-green mb-6">Match the uppercase and lowercase letters!</h2>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Uppercase Letters */}
          <div className="space-y-3">
            <h3 className="font-heading text-xl text-sage-green">UPPERCASE</h3>
            {upper.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedUpper(letter)}
                disabled={matchedPairs.includes(letter) || selectedUpper === letter}
                className={`pixel-button w-full text-2xl h-16 font-bold ${
                  selectedUpper === letter ? 'active' : ''
                } ${matchedPairs.includes(letter) ? 'opacity-40 !bg-sage-green text-white' : ''}`}
                style={{ textTransform: 'uppercase' }}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Lowercase Letters */}
          <div className="space-y-3">
            <h3 className="font-heading text-xl text-sage-green">lowercase</h3>
            {lower.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLower(letter)}
                disabled={matchedPairs.includes(letter.toUpperCase()) || selectedLower === letter}
                className={`pixel-button w-full text-2xl h-16 font-bold ${
                  selectedLower === letter ? 'active' : ''
                } ${matchedPairs.includes(letter.toUpperCase()) ? 'opacity-40 !bg-sage-green text-white' : ''}`}
                style={{ textTransform: 'lowercase', fontFamily: 'Georgia, serif' }}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <PixelCharacter type={feedback === 'correct' ? 'guide' : 'writer'} scale={8} />
            <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
              {feedback === 'correct' ? 'Perfect match!' : 'Not a match, try again!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
