import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";

const sentences = [
  { words: ['The', 'cat', 'is', 'happy'], image: 'A happy cat' },
  { words: ['I', 'like', 'to', 'play'], image: 'Children playing' },
  { words: ['The', 'sun', 'is', 'bright'], image: 'A bright sun' },
  { words: ['Dogs', 'like', 'to', 'run'], image: 'Dogs running' },
  { words: ['We', 'read', 'good', 'books'], image: 'Reading books' },
  { words: ['Fish', 'swim', 'in', 'water'], image: 'Fish swimming' }
];

export default function SentenceOrderGame({ onGameComplete }) {
  const [correctSentence, setCorrectSentence] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [playerSentence, setPlayerSentence] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  const totalQuestions = 5;

  const generateNewQuestion = useCallback(() => {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    const shuffled = [...sentence.words].sort(() => 0.5 - Math.random());
    
    setCorrectSentence(sentence.words);
    setShuffledWords(shuffled);
    setCurrentImage(sentence.image);
    setPlayerSentence([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleWordClick = (word, fromShuffled = true) => {
    if (feedback) return;
    
    if (fromShuffled) {
      // Move from shuffled to player sentence
      const wordIndex = shuffledWords.indexOf(word);
      if (wordIndex === -1) return;
      
      setPlayerSentence([...playerSentence, word]);
      setShuffledWords(shuffledWords.filter((_, index) => index !== wordIndex));
    } else {
      // Move from player sentence back to shuffled
      const wordIndex = playerSentence.indexOf(word);
      if (wordIndex === -1) return;
      
      setShuffledWords([...shuffledWords, word]);
      setPlayerSentence(playerSentence.filter((_, index) => index !== wordIndex));
    }
  };

  const handleSubmit = () => {
    if (feedback || playerSentence.length === 0) return;

    const isCorrect = JSON.stringify(playerSentence) === JSON.stringify(correctSentence);
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 20);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (newQuestionsAnswered >= totalQuestions) {
        onGameComplete({
          score: isCorrect ? score + 20 : score,
          questionsAnswered: newQuestionsAnswered,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
        });
      } else {
        generateNewQuestion();
      }
    }, 2500);
  };

  const resetSentence = () => {
    setShuffledWords([...shuffledWords, ...playerSentence].sort(() => 0.5 - Math.random()));
    setPlayerSentence([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <p className="font-body text-sage-green">Question: {questionsAnswered + 1}/{totalQuestions}</p>
        <p className="font-body text-sage-green">Score: {score}</p>
      </div>

      <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm text-center">
        <h2 className="font-heading text-2xl text-sage-green mb-6">Put these words in the right order!</h2>
        
        <div className="mb-6 p-4 bg-butter-yellow border-2 border-sage-green">
          <p className="font-body text-sage-green text-xl">
            <strong>Picture clue:</strong> {currentImage}
          </p>
        </div>

        {/* Player Sentence Display */}
        <div className="mb-6">
          <p className="font-body text-sage-green mb-2">Your sentence:</p>
          <div className="flex justify-center gap-2 min-h-16 flex-wrap">
            {playerSentence.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(word, false)}
                className="px-4 py-2 border-3 border-sage-green bg-pastel-blue pixel-button"
              >
                {word}
              </button>
            ))}
            {playerSentence.length === 0 && (
              <div className="px-4 py-2 border-3 border-sage-green border-dashed bg-white/50 text-gray-400">
                Click words below to build your sentence
              </div>
            )}
          </div>
        </div>

        {/* Available Words */}
        <div className="mb-6">
          <p className="font-body text-sage-green mb-2">Available words:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {shuffledWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(word, true)}
                disabled={!!feedback}
                className="pixel-button px-4 py-2"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        <div className="space-x-4">
          <button onClick={handleSubmit} disabled={playerSentence.length === 0 || !!feedback} className="pixel-button">
            Check Sentence
          </button>
          <button onClick={resetSentence} disabled={!!feedback} className="pixel-button">
            Reset
          </button>
        </div>

        {feedback && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <PixelCharacter type={feedback === 'correct' ? 'guide' : 'reader'} scale={8} />
            <div>
              <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
                {feedback === 'correct' ? 'Perfect sentence!' : 'Good effort!'}
              </p>
              {feedback === 'incorrect' && (
                <p className="font-body text-sage-green">
                  The correct sentence was: "{correctSentence.join(' ')}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
