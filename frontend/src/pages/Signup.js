import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
      } else {
        setResponseMessage(data.error);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setResponseMessage('An error occurred during signup.');
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-20 py-20 rounded-3xl border-2 border-gray">
          <h1 className="text-5xl font-semibold">Welcome</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">Please create your account.</p>
          <div className="mt-8">
            <label className="text-lg font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            />
          </div>
          <div>
            <label className="text-lg font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            />
          </div>
          <div>
            <label className="text-lg font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            />
          </div>

          <div className="mt-8 flex flex-col">
            <button
              onClick={handleSignup}
              className="active:scale-[.98] py-3 rounded-xl bg-blue-500 text-white text-lg font-bold"
            >
              Sign up
            </button>
          </div>

          {responseMessage && <p className="text-red-500 mt-4">{responseMessage}</p>}

          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">already have an account?</p>
            <Link to="/login">
              <button className="text-blue-500 text-base font-medium ml-2">Sign in</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full items-center w-1/2 justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-blue-600 to-blue-200 rounded-full animate-spin" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div>
      </div>
    </div>
  );
};

export default Signup