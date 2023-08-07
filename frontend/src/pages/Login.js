import React, { useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {

      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Save the JWT token and user details in the browser's local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Token:', localStorage.getItem('token'));
        console.log('User:', JSON.parse(localStorage.getItem('user')));

        // Redirect the user to the home page or dashboard after successful login
        // Replace '/home' with the URL for your home page or dashboard

        navigate('/homee');

      } else {
        // Display an error message if login is not successful
        setResponseMessage(data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Display a generic error message for any login errors
      setResponseMessage('An error occurred during login.');
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-20 py-20 rounded-3xl border-2 border-gray">
          <h1 className="text-5xl font-semibold">Welcome Back</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">Welcome back! Please enter your details.</p>
          <div className="mt-8">
            <label className="text-lg font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            />
          </div>
          <div>
            <label className="text-lg font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            />
          </div>

          <div className="mt-5 items-center justify-center flex">
            {/* Use the Link component to create a clickable link to the Forgot Password page */}
            <Link to="/forgot-password">
              <button className="font-medium text-base text-purple-500">Forgot password</button>
            </Link>
          </div>

          <div className="mt-8 flex flex-col">
            <button onClick={handleLogin} className="active:scale-[.98] py-3 rounded-xl bg-violet-500 text-white text-lg font-bold">
              Sign in
            </button>
          </div>

          {responseMessage && <p className="text-red-500 mt-4">{responseMessage}</p>}

          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Don't have an account?</p>
            <Link to="/signup">
              <button className="text-purple-500 text-base font-medium ml-2">Sign up</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full items-center w-1/2 justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-600 to-pink-600 rounded-full animate-bounce" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div>
      </div>
    </div>
  );
};

export default Login;
