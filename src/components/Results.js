// src/components/Results.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 0 };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Quiz Completed!</h1>
      <p>Your Score: {score} / {totalQuestions}</p>
      <Link to="/">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Back to Home</button>
      </Link>
    </div>
  );
};

export default Results;
