// ForgotPassword.js
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
      } else {
        setResponseMessage(data.error);
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      setResponseMessage('An error occurred during password reset.');
    }
  };

  return (
    <div className='h-screen items-center justify-center flex'>
      <div className="bg-white m-5 px-10 py-10 rounded-3xl border-2 border-gray">
      <h1 className="text-5xl font-semibold text-purple-500">Forgot Password</h1>
        <div className="mt-8">
          <label className="text-lg font-medium">Email</label>
          <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" 
          className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"/>
        </div>
        <div className="mt-5 items-center justify-center flex">
          <button onClick={handleForgotPassword} className="active:scale-[.98] py-3 px-3 rounded-xl bg-violet-500 text-white text-lg font-bold">Reset Password</button>
        </div>
        {responseMessage && <p className='text-red-500 text-center mt-3'>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
