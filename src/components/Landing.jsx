import React from 'react';
import LoginOptions from './LoginOptions';
import '../styles/Landing.css'; // Import custom styles

const Landing = () => {
  return (
    <div className="landing-page">
      <h1 className="landing-title"> Welcome to Code & Cry 💻 😭</h1>
      <LoginOptions />
    </div>
  );
};

export default Landing;
