import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #001f3f, #00A69D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
          zIndex: -1,
        }}
      ></div>

      <h1
        style={{
          fontSize: "3.5rem",
          marginBottom: "20px",
          fontWeight: "700",
          letterSpacing: "3px",
          textShadow: "2px 2px 15px rgba(0, 0, 0, 0.5)",
          animation: "fadeIn 2s ease-in-out",
        }}
      >
        Quiz Time! 🎉
      </h1>
      <p
        style={{
          fontSize: "1.3rem",
          marginBottom: "40px",
          maxWidth: "700px",
          opacity: "0.9",
          lineHeight: "1.5",
          animation: "fadeIn 2.5s ease-in-out",
        }}
      >
        Challenge yourself with fun and exciting quizzes. Click the button below to begin your adventure!
      </p>

      {loading ? (
        <div>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <Link to="/quiz">
          <button className="start-btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </Link>
      )}

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .start-btn {
            padding: 18px 36px;
            font-size: 20px;
            font-weight: bold;
            background-color: #00A69D;
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
            margin-top: 40px;
            letter-spacing: 1px;
            transform: scale(1);
          }

          .start-btn:hover {
            background-color: #00C8A9;
            transform: scale(1.1);
            box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.3);
          }

          .start-btn:active {
            transform: scale(1);
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
          }

          .spinner {
            border: 6px solid rgba(255, 255, 255, 0.3);
            border-top: 6px solid white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
