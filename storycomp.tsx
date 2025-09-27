import React, { useState, useEffect, useCallback } from "react";
import PixelCharacter from "@/components/PixelCharacter";

const stories = [
  {
    title: "The Happy Cat",
    text: "Luna is a happy cat. She has soft orange fur and green eyes. Luna likes to play with yarn balls. She also loves to sleep in sunny spots by the window. When Luna is hungry, she meows loudly until someone gives her food.",
    questions: [
      {
        question: "What color is Luna's fur?",
        options: ["Orange", "Black", "White", "Brown"],
        correct: "Orange"
      },
      {
        question: "What does Luna like to play with?",
        options: ["Toy mice", "Yarn balls", "Feathers", "Sticks"],
        correct: "Yarn balls"
      },
      {
        question: "Where does Luna like to sleep?",
        options: ["Under the bed", "In sunny spots", "In a box", "On the floor"],
        correct: "In sunny spots"
      }
    ]
  },
  {
    title: "Tommy's Garden",
    text: "Tommy planted seeds in his garden. He watered them every day and made sure they got sunlight. After a few weeks, green plants started to grow. Tommy was so excited! Soon there were beautiful red tomatoes and yellow flowers in his garden.",
    questions: [
      {
        question: "What did Tommy plant?",
        options: ["Trees", "Seeds", "Flowers", "Vegetables"],
        correct: "Seeds"
      },
      {
        question: "How often did Tommy water his plants?",
        options: ["Once a week", "Never", "Every day", "Once a month"],
        correct: "Every day"
      },
      {
        question: "What color were the tomatoes?",
        options: ["Green", "Yellow", "Orange", "Red"],
        correct: "Red"
      }
    ]
  }
];

export default function StoryComprehensionGame({ onGameComplete }) {
  const [currentStory, setCurrentStory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState('reading'); // 'reading', 'questions', 'complete'
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const generateNewStory = useCallback(() => {
    const story = stories[Math.floor(Math.random() * stories.length)];
    setCurrentStory(story);
    setQuestionIndex(0);
    setCurrentQuestion(story.questions[0]);
    setGamePhase('reading');
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateNewStory();
  }, [generateNewStory]);

  const startQuestions = () => {
    setGamePhase('questions');
  };

  const handleAnswer = (selectedAnswer) => {
    if (feedback) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      const nextQuestionIndex = questionIndex + 1;
      
      if (nextQuestionIndex < currentStory.questions.length) {
        // More questions in this story
        setQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(currentStory.questions[nextQuestionIndex]);
        setFeedback(null);
      } else if (newQuestionsAnswered >= 6) { // Total questions across stories
        // Game complete
        onGameComplete({
          score: isCorrect ? score + 10 : score,
          questionsAnswered: newQuestionsAnswered,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
        });
      } else {
        // Start new story
        generateNewStory();
      }
    }, 1500);
  };

  if (gamePhase === 'reading') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
          <p className="font-body text-sage-green">Questions Answered: {questionsAnswered}/6</p>
          <p className="font-body text-sage-green">Score: {score}</p>
        </div>

        <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-6 mb-6">
            <PixelCharacter type="reader" scale={10} />
            <div>
              <h2 className="font-heading text-2xl text-sage-green mb-4">{currentStory?.title}</h2>
              <p className="font-body text-sage-green leading-relaxed text-xl">
                {currentStory?.text}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button onClick={startQuestions} className="pixel-button">
              I'm Ready for Questions!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center p-4 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <p className="font-body text-sage-green">Question: {questionIndex + 1}/{currentStory?.questions.length}</p>
        <p className="font-body text-sage-green">Score: {score}</p>
      </div>

      {/* Story Reference - Always Visible During Questions */}
      <div className="p-4 bg-butter-yellow border-2 border-sage-green">
        <h3 className="font-heading text-lg text-sage-green mb-2">📖 Story: {currentStory?.title}</h3>
        <p className="font-body text-sage-green text-sm leading-relaxed">
          {currentStory?.text}
        </p>
      </div>

      <div className="p-8 pixel-border bg-soft-white/80 backdrop-blur-sm">
        <h2 className="font-heading text-2xl text-sage-green mb-6 text-center">
          {currentQuestion?.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className={`pixel-button text-lg h-16 ${feedback && option === currentQuestion.correct ? 'active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <PixelCharacter type={feedback === 'correct' ? 'guide' : 'reader'} scale={8} />
            <div>
              <p className={`font-heading text-2xl ${feedback === 'correct' ? 'text-sage-green' : 'text-red-500'}`}>
                {feedback === 'correct' ? 'Great reading!' : 'Good try!'}
              </p>
              {feedback === 'incorrect' && (
                <p className="font-body text-sage-green">The correct answer was: {currentQuestion.correct}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
