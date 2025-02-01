import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://api.jsonserve.com/Uw5CrX")
      .then((response) => {
        console.log("Quiz data fetched:", response.data);

        if (response.data && Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
        } else {
          console.error("Invalid data structure:", response.data);
          setQuestions([]);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
        setIsLoading(false);
      });
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
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
  };

  const handleFinishQuiz = () => {
    let finalScore = score;
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer) {
      const correctOption = currentQuestion.options.find((opt) => opt.is_correct);
      finalScore += selectedAnswer === correctOption?.description ? 4 : -1;
    }
    navigate("/results", { state: { score: finalScore, totalQuestions: questions.length * 4 } });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledOptions = currentQuestion.options.sort(() => Math.random() - 0.5);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        background: "linear-gradient(135deg, darkblue, #00A69D)", // Dark blue with peacock green shade
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.description || "No question available"}</p>

      <div>
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              margin: "5px",
              backgroundColor: selectedAnswer === option.description ? "lightgreen" : "white",
              color: selectedAnswer === option.description ? "black" : "darkblue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleAnswerSelection(option.description)}
          >
            {option.description}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleFinishQuiz}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "white",
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
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
