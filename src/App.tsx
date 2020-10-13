import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
//components
import Question from './Components/Question';
//types
import { QuestionState, Difficulty } from './API';
// tyles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTION = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }
  
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //users answer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      //add score if answer is correct
      if(correct) {
        setScore(prev => prev + 1);
      }
      //save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    //move onto the next question if it's not the last question
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTION) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div>
      <GlobalStyle />
      <Wrapper className="App">
     <h1>React QUIZ</h1>
     {
        gameOver || userAnswers.length === TOTAL_QUESTION ?(
          <button className="start" onClick={startTrivia}>
            Start!
          </button>
        ) : null
     }

      {!gameOver ? <p className="score">Score: {score}</p> : null}
      {loading && <p>Loading questions...</p>}
     {
       !loading && !gameOver && (
        <Question 
          questionNr={number + 1}
          totalQuestion={TOTAL_QUESTION}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
       )
     }
     {
       !gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
       ) : null
     }
    </Wrapper>
    </div>
  );
}

export default App;
