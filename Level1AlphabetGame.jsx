import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";
import { Link } from "react-router-dom";


export default function AlphabetOrderGame({ onGameComplete }) {
 const [sequence, setSequence] = useState([]);
 const [playerOrder, setPlayerOrder] = useState([]);
 const [score, setScore] = useState(0);
 const [questionsAnswered, setQuestionsAnswered] = useState(0);
 const [correctAnswers, setCorrectAnswers] = useState(0);
 const [feedback, setFeedback] = useState(null);
 const [gamePhase, setGamePhase] = useState('playing'); // 'playing', 'checking'


 const totalQuestions = 6;


 const generateSequence = useCallback(() => {
   const startLetter = Math.floor(Math.random() * 20); // Letters A-T to ensure we can have 5 in sequence
   const letters = [];
   for (let i = 0; i < 5; i++) {
     letters.push(String.fromCharCode(65 + startLetter + i));
   }
  
   // Shuffle the letters for the player to arrange
   const shuffled = [...letters].sort(() => 0.5 - Math.random());
  
   setSequence(letters);
   setPlayerOrder([]);
   setGamePhase('playing');
   setFeedback(null);
  
   return shuffled;
 }, []);


 const [shuffledLetters, setShuffledLetters] = useState([]);


 useEffect(() => {
   setShuffledLetters(generateSequence());
 }, [generateSequence]);


 const handleLetterClick = (letter) => {
   if (gamePhase !== 'playing' || playerOrder.includes(letter)) return;
  
   const newOrder = [...playerOrder, letter];
   setPlayerOrder(newOrder);
  
   if (newOrder.length === sequence.length) {
     setGamePhase('checking');
     checkAnswer(newOrder);
   }
 };


 const checkAnswer = (order) => {
   const isCorrect = JSON.stringify(order) === JSON.stringify(sequence);
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
       setShuffledLetters(generateSequence());
     }
   }, 2000);
 };


 const resetRound = () => {
   setPlayerOrder([]);
   setGamePhase('playing');
   setFeedback(null);
 };


 return (
   <div className="max-w-3xl mx-auto space-y-6">
     <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
       <p className="font-body text-sage-green">Question: {questionsAnswered + 1}/{totalQuestions}</p>
       <p className="font-body text-sage-green">Score: {score}</p>
     </div>


     <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm text-center">
       <h2 className="font-heading text-2xl text-sage-green mb-6">Put these letters in alphabetical order!</h2>
      
       {/* Current Order Display */}
       <div className="mb-6">
         <p className="font-body text-sage-green mb-2">Your order:</p>
         <div className="flex justify-center gap-2 min-h-16">
           {playerOrder.map((letter, index) => (
             <div key={index} className="w-12 h-12 border-3 border-sage-green bg-pastel-blue flex items-center justify-center">
               <span className="text-xl font-bold text-sage-green">{letter}</span>
             </div>
           ))}
           {/* Empty slots */}
           {Array(sequence.length - playerOrder.length).fill(0).map((_, index) => (
             <div key={`empty-${index}`} className="w-12 h-12 border-3 border-sage-green border-dashed bg-white/50"></div>
           ))}
         </div>
       </div>


       {/* Letter Options */}
       <div className="flex justify-center gap-3 mb-6 flex-wrap">
         {shuffledLetters.map((letter, index) => (
           <button
             key={index}
             onClick={() => handleLetterClick(letter)}
             disabled={gamePhase !== 'playing' || playerOrder.includes(letter)}
             className={`pixel-button text-lg w-16 h-16 ${
               playerOrder.includes(letter) ? 'opacity-50' : ''
             } ${feedback && sequence.includes(letter) ? 'active' : ''}`}
           >
             {letter}
           </button>
         ))}
       </div>


       <button onClick={resetRound} className="pixel-button mb-4">
         Reset Order
       </button>


       {feedback && (
         <div className="mt-6 flex items-center justify-center gap-4">
           <PixelCharacter type={feedback === 'correct' ? 'guide' : 'reader'} scale={8} />
           <div>
             <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
               {feedback === 'correct' ? 'Perfect!' : 'Not quite right!'}
             </p>
             {feedback === 'incorrect' && (
               <p className="font-body text-sage-green">The correct order was: {sequence.join(', ')}</p>
             )}
           </div>
         </div>
       )}
     </div>
   </div>
 );
}

