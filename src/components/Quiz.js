import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [loading, setLoading] = useState(true); // New loading state
    const [error, setError] = useState(false); // New error state
  
    const navigate = useNavigate();
  
    useEffect(() => {
        
      axios
      
        .get("https://api.jsonserve.com/Uw5CrX")
        
        .then((response) => {
          console.log("Quiz data fetched:", response.data);
  
          if (response.data && Array.isArray(response.data.questions)) {
            const updatedQuestions = response.data.questions.map((question) => {
              const shuffledOptions = question.options.sort(() => Math.random() - 0.5);
              return { ...question, options: shuffledOptions };
            });
            setQuestions(updatedQuestions);
          } else {
            console.error("Invalid data structure:", response.data);
            setQuestions([]);
          }
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => {
          console.error("Error fetching quiz data:", error);
          setError(true); // Set error state if there's an issue fetching data
          setLoading(false); // Set loading to false in case of error
        });
        setTimeout(() => {
            setLoading(false);
          }, 500);
    }, []);
  
    const handleNextQuestion = useCallback(() => {
      const currentQuestion = questions[currentQuestionIndex];
  
      if (selectedAnswer) {
        const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
  
        if (selectedAnswer === correctOption?.description) {
          setScore(score + 4);
        } else {
          setScore(score - 1);
        }
      }
  
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimer(10); // Reset the timer for the next question
    }, [questions, currentQuestionIndex, selectedAnswer, score]); // Add dependencies here
  
    useEffect(() => {
      if (timer === 0) {
        handleNextQuestion();
      } else {
        const countdown = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(countdown);
      }
    }, [timer, handleNextQuestion]); // Add handleNextQuestion to the dependency array
  
    const handleAnswerSelection = (answer) => {
      setSelectedAnswer(answer);
    };
  
    const handleFinishQuiz = () => {
    let finalScore = score;
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer) {
        const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
        finalScore += selectedAnswer === correctOption?.description ? 4 : -1;
    }

    console.log("Final Questions Sent to Results:", questions);

    navigate("/results", { 
        state: { 
            score: finalScore, 
            totalQuestions: questions.length * 4,
            selectedAnswers: questions.map(q => q.selectedAnswer || "No answer selected") 
        } 
    });
};


    // Loading or error state logic
    if (loading) {
      return <div style={{ color: 'white' }}>Loading quiz...</div>;
    }
  
    if (error) {
      return <div style={{ color: 'white' }}>Error loading quiz. Please try again later.</div>;
    }
  
    if (questions.length === 0) {
      return <div style={{ color: 'white' }}>No questions found</div>;
    }
  
    const currentQuestion = questions[currentQuestionIndex];
  
    return (
      <div
        style={{
          textAlign: "center",
          background: "linear-gradient(135deg, darkblue, #00A69D)",
          minHeight: "100vh",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Timer in the top-right corner */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "24px",
            backgroundColor: "white",
            color: "darkblue",
            padding: "10px 20px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {timer < 10 ? `00:0${timer}` : `00:${timer}`}
        </div>
  
        {/* Question 1 text in top-left corner */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontSize: "24px",
            color: "white",
          }}
        >
          Question {currentQuestionIndex + 1}
        </div>
  
        {/* Topic in the center */}
        <div
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            marginBottom: "40px",
            color: "white",
            fontSize: "24px",
          }}
        >
          {currentQuestion.topic || "No topic available"}
        </div>
  
        {/* Question container */}
        <div
          style={{
            backgroundColor: "white",
            color: "darkblue",
            paddingLeft: "40px",
            padding: "20px",
            borderRadius: "10px",
            width: "80%",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          {/* Question text */}
          <p>{currentQuestion.description || "No question available"}</p>
  
          {/* Options container */}
          <div style={{ marginTop: "20px" }}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  checked={selectedAnswer === option.description}
                  onChange={() => handleAnswerSelection(option.description)}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "15px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                />
                <label
                  htmlFor={`option-${index}`}
                  style={{
                    fontSize: "16px",
                    color: selectedAnswer === option.description ? "white" : "darkblue",
                    backgroundColor: selectedAnswer === option.description ? "darkblue" : "white",
                    padding: "10px 20px",
                    borderRadius: "50px",
                    border: "2px solid darkblue",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                  }}
                >
                  {option.description}
                </label>
              </div>
            ))}
          </div>
        </div>
  
        {/* Next/Finish button */}
        <div style={{ marginTop: "20px" }}>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleFinishQuiz}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "white",
                transition: 'all 0.2s ease',
                color: "darkblue",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "white",
                color: "darkblue",
                transition: 'all 0.2s ease',
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Next Question
            </button>
          )}
          <style>
            {`
              button:active {
                background-color: #e0e0e0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                transform: scale(0.98);
              }
              button:hover {
                background-color: #f0f0f0;
                transform: scale(1.24);
              }
            `}
          </style>
        </div>
      </div>
    );
  };
  
  export default Quiz;
  
