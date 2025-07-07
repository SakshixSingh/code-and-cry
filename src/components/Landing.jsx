import React from 'react';
import LoginOptions from './LoginOptions';

const Landing = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-center mb-4">💻 Code & Cry 😭</h1>
      <p className="text-center mb-4">Where code breaks and so do we.</p>
      <LoginOptions />
    </div>
  );
};

export default Landing;
