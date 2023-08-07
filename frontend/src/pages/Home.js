import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform">
        <h1 className="text-4xl font-semibold text-center text-purple-500 mb-6">Welcome to Taskify</h1>
        <p className="text-gray-700 text-lg mb-6">
          Taskify is a powerful tasks management system that helps you stay organized and efficient.
          Sign up or log in to start managing your tasks today!
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
