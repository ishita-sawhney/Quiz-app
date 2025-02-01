import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        background: 'linear-gradient(135deg, darkblue, #00A69D)', // Dark blue with peacock green shade
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
      }}
    >
      <h1>Welcome to the Quiz App!</h1>
      <p>Click below to start the quiz.</p>
      <Link to="/quiz">
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'white',
            color: 'darkblue',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Start Quiz
        </button>
      </Link>
    </div>
  );
};

export default Home;
