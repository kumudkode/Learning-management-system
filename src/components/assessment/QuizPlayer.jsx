import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/buttons/Button';

export default function QuizPlayer({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit || null);
  const router = useRouter();
  
  useEffect(() => {
    if (!timeRemaining) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);
  
  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    // Calculate score
    let score = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswerId) {
        score += question.points || 1;
      }
    });
    
    // Submit results
    onComplete({
      quizId: quiz.id,
      answers,
      score,
      totalPossible: quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0),
      timeSpent: quiz.timeLimit ? quiz.timeLimit - timeRemaining : null
    });
  };
  
  const question = quiz.questions[currentQuestion];
  
  return (
    <div className="quiz-player">
      {timeRemaining && (
        <div className="timer">
          Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      )}
      
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(currentQuestion / quiz.questions.length) * 100}%` }} />
      </div>
      
      <div className="question-container">
        <h2>Question {currentQuestion + 1} of {quiz.questions.length}</h2>
        <div className="question-text">
          {question.text}
        </div>
        
        <div className="answers">
          {question.answers.map(answer => (
            <div 
              key={answer.id}
              className={`answer-option ${answers[question.id] === answer.id ? 'selected' : ''}`}
              onClick={() => handleAnswer(question.id, answer.id)}
            >
              {answer.text}
            </div>
          ))}
        </div>
      </div>
      
      <div className="navigation">
        <Button 
          variant="outlined" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button 
            variant="primary"
            onClick={handleNext}
            disabled={!answers[question.id]}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="success"
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}