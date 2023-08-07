// PasswordResetPage.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const PasswordResetPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Use the `useParams` hook to extract the token from the URL parameters
  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setResponseMessage('Passwords do not match');
      return;
    }

    // Perform the password reset request to the backend
    try {
      const response = await fetch(`http://localhost:3000/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage('Password reset successfully');
      } else {
        setResponseMessage(data.error);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setResponseMessage('An error occurred during password reset.');
    }
  };

  return (
    <div className='h-screen items-center justify-center flex'>
      <div className="bg-white m-5 px-10 py-10 rounded-3xl border-2 border-gray">
      <h1 className="text-5xl font-semibold text-blue-500">Reset Password</h1>
      <div className="mt-8">
        <label className="text-lg font-medium">New Password</label>
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Enter your new password"
        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" />
      </div>
      <div>
        <label className="text-lg font-medium">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirm your new password" 
        className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"/>
      </div>
      <div className="mt-5 items-center justify-center flex">
        <button className="active:scale-[.98] py-3 px-3 rounded-xl bg-blue-500 text-white text-lg font-bold" onClick={handleResetPassword}>Reset Password</button>
      </div>
      {responseMessage && <p className='text-red-500 text-center mt-3'>{responseMessage}</p>}
      </div>
    </div>
  );
};

export default PasswordResetPage;
