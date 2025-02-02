import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const { score, totalQuestions, questions: passedQuestions } = location.state || {
    score: 0,
    totalQuestions: 0,
    questions: [],
  };

  const [questions, setQuestions] = useState(passedQuestions || []);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null); // Track slide direction
  const slideBoxRef = useRef(null);
  const containerRef = useRef(null); // Ref for the container

  useEffect(() => {
    if (!passedQuestions || passedQuestions.length === 0) {
      fetch("https://api.jsonserve.com/Uw5CrX")
        .then((response) => response.json())
        .then((data) => {
          if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            console.error("Invalid data format or empty questions array");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [passedQuestions]);

  const safeQuestions = Array.isArray(questions) ? questions : [];

  const nextQuestion = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % safeQuestions.length);
  };

  const prevQuestion = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) => (prevIndex - 1 + safeQuestions.length) % safeQuestions.length);
  };

  // Get container width to ensure the box doesn't go beyond screen
  const containerWidth = 1000;
  const slideBoxWidth = 1000; // Assuming your box width is fixed to 1000px

  // Calculate the maximum translation based on the container width and box width
  const maxTranslateX = containerWidth - slideBoxWidth;

  // Function to handle the sliding position, ensuring smooth movement
  const getSlidePosition = () => {
    if (direction === "right") {
      return Math.min(currentIndex * slideBoxWidth, maxTranslateX);
    }
    if (direction === "left") {
      return -Math.min(currentIndex * slideBoxWidth, 0);
    }
    return 0;
  };

  const handleAnswerSelection = (questionId, selectedAnswer) => {
    console.log("Selected Answer:", selectedAnswer); // Debugging the selected answer
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, selectedAnswer };
      }
      return question;
    });
    console.log("Updated Questions:", updatedQuestions); // Debugging the updated state
    setQuestions(updatedQuestions);
  };
  

  const formatExplanation = (text) => {
    return (
      <div>
        {text.split("\n").map((line, index) => {
          // Clean the line by removing unwanted characters (e.g., zero-width spaces)
          let cleanedLine = line.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\*/g, '').trim();
  
          // 1. Handle "Label: Value" format
          const match = cleanedLine.match(/^(.*?):\s*(.*)/);
          if (match && cleanedLine.length < 60) {
            return (
              <p key={index}>
                <strong>{match[1]}:</strong> {match[2]}
              </p>
            );
          }
  
          // 2. Handle '?' by splitting at the last full stop (.)
          if (cleanedLine.includes('?')) {
            const lastPeriodIndex = cleanedLine.lastIndexOf('.');
            if (lastPeriodIndex !== -1) {
              return (
                <div key={index}>
                  <p>{cleanedLine.slice(0, lastPeriodIndex + 1).trim()}</p>
                  <p>{cleanedLine.slice(lastPeriodIndex + 1).trim()}</p>
                </div>
              );
            }
          }
  
          // 3. Handle ".1.", ".2.", etc. as bullet points
          if (cleanedLine.match(/\.\d+\./)) {
            return (
              <div key={index}>
                {cleanedLine.split(/(?=\.\d+\.)/).map((part, i) => (
                  <p key={`${index}-${i}`} className="bullet-point">
                    {part.trim()}
                  </p>
                ))}
              </div>
            );
          }
  
          // 4. Handle text that should stay in a single line (e.g., "5′ AAAT3′")
          // Use a <span> for text that should not break into multiple lines
          return <span key={index}>{cleanedLine} </span>;
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        textAlign: "center",
        background: "linear-gradient(135deg, darkblue, #00A69D)",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <h1>Quiz Completed!</h1>
      <p>Your Score: {score} / {totalQuestions}</p>
      <div style={{ marginTop: "20px" }}>
        <h2>Summary of Results</h2>
        {loading ? (
          <p>Loading questions...</p>
        ) : safeQuestions.length > 0 ? (
          <div
            ref={containerRef}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden", // Prevents scrolling outside the container
            }}
          >
            <button
              onClick={prevQuestion}
              style={{
                fontSize: "150px", // Increase the size of the arrows
                background: "transparent",
                border: "none",
                color: "lightgray",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "lightblue")}
              onMouseOut={(e) => (e.target.style.color = "lightgray")}
            >
              &#171;
            </button>
            <div
              ref={slideBoxRef}
              style={{
                backgroundColor: "lightblue",
                color: "darkblue",
                padding: "25px",
                borderRadius: "10px",
                textAlign: "left",
                width: `1300px`,
                marginBottom: "50px",
                transition: "transform 0.5s ease-in-out", // Enable smooth sliding
                transform: `translateX(${getSlidePosition()}px)`, // Dynamic position based on direction
              }}
            >
              <h3>{safeQuestions[currentIndex]?.topic}</h3>
              <p><strong>Question {currentIndex + 1}:</strong> {safeQuestions[currentIndex]?.description}</p>
              <div>
              {safeQuestions[currentIndex]?.options.map((option) => (
                <button
                  key={option.description}
                  onClick={() => handleAnswerSelection(safeQuestions[currentIndex]?.id, option.description)}
                  style={{
                    backgroundColor: safeQuestions[currentIndex]?.selectedAnswer === option.description ? "lightgreen" : "white",
                    margin: "8px", // Add space between buttons
        padding: "12px 20px", // Optional: Adjust padding if needed
        borderRadius: "5px",
                  }}
                >
                  {option.description}
                </button>
              ))}
            </div>
              <p><strong>Your Answer:</strong> {safeQuestions[currentIndex]?.selectedAnswer ? safeQuestions[currentIndex]?.selectedAnswer : "No answer selected"}</p>
              <p><strong>Correct Answer:</strong> {safeQuestions[currentIndex]?.options.find((opt) => opt.is_correct)?.description}</p>
              {formatExplanation(safeQuestions[currentIndex]?.detailed_solution || "No detailed solution available.")}
            </div>
            <button
              onClick={nextQuestion}
              style={{
                fontSize: "150px", // Increase the size of the arrows
                background: "transparent",
                border: "none",
                color: "lightgray",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "lightblue")}
              onMouseOut={(e) => (e.target.style.color = "lightgray")}
            >
              &#187;
            </button>
          </div>
        ) : (
          <p>No questions found.</p>
        )}
      </div>
      <Link to="/">
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "white",
            color: "darkblue",
            border: "none",
            borderRadius: "5px",
            transition: 'all 0.2s ease',
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </Link>
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
  );
};

export default Results;