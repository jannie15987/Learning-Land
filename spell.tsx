import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";

const wordsToSpell = {
  'CAT': 'A furry pet',
  'DOG': 'A friendly animal',
  'SUN': 'Shines in the sky',
  'BED': 'Where you sleep',
  'PIG': 'An animal that oinks',
};

export default function SpellTheWordGame({ onGameComplete }) {
  const [currentWord, setCurrentWord] = useState('');
  const [hint, setHint] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const totalQuestions = 5;

  const generateNewQuestion = useCallback(() => {
    const wordKeys = Object.keys(wordsToSpell);
    const word = wordKeys[Math.floor(Math.random() * wordKeys.length)];
    
    setCurrentWord(word);
    setHint(wordsToSpell[word]);
    setUserInput('');
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback || !userInput) return;

    const isCorrect = userInput.toUpperCase() === currentWord;
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 15);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (newQuestionsAnswered >= totalQuestions) {
        onGameComplete({
          score: isCorrect ? score + 15 : score,
          questionsAnswered: newQuestionsAnswered,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
        });
      } else {
        generateNewQuestion();
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <p className="font-body text-sage-green">Question: {questionsAnswered + 1}/{totalQuestions}</p>
        <p className="font-body text-sage-green">Score: {score}</p>
      </div>

      <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm text-center">
        <h2 className="font-heading text-2xl text-sage-green mb-6">Spell the word!</h2>
        
        <div className="mb-8 p-4 bg-butter-yellow border-2 border-sage-green">
          <p className="font-body text-sage-green text-xl">
            <strong>Hint:</strong> {hint}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!!feedback}
            maxLength={currentWord.length}
            className="w-full max-w-sm mx-auto text-center font-heading text-4xl p-4 tracking-[1rem] uppercase border-4 border-sage-green bg-soft-white focus:outline-none focus:ring-4 ring-pastel-blue"
            style={{ 'caretColor': 'transparent' }}
          />
          <button type="submit" disabled={!userInput || !!feedback} className="pixel-button">
            Check Spelling
          </button>
        </form>

        {feedback && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <PixelCharacter type={feedback === 'correct' ? 'guide' : 'writer'} scale={8} />
            <div>
              <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
                {feedback === 'correct' ? 'Perfect spelling!' : 'Try again!'}
              </p>
              {feedback === 'incorrect' && (
                <p className="font-body text-sage-green">The word was: {currentWord}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
