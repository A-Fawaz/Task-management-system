import "./inv.css";

import React, { useState, useEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import axios from 'axios';



const InvitationPage = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedProject, setSelectedProject] = useState(""); // State to store the selected project name
  const [projectNames, setProjectNames] = useState([]);
  const [errorText, setErrorText] = useState("");
  const storedUserString = localStorage.getItem('user');
  const storedUser = JSON.parse(storedUserString);
  const userid = storedUser._id;

  const fetchProjectNames = useCallback(() => {
    const creatorId = userid;
    console.log(creatorId);
    axios
      .get("http://localhost:8000/api/projects/:id", { params: { creatorId } })
      .then((response) => {
        setProjectNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching project names:", error);
      });
  }, [userid]);



  useEffect(() => {
    setIsAnimated(true);
    fetchProjectNames();
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getRandomTranslate() {
      const randomX = getRandomNumber(0, 400);
      const randomY = getRandomNumber(0, 400);
      return `translate(${randomX}%, ${randomY}%)`;
    }
    const star1 = document.querySelector('.animate-star1');
    star1.style.transform = getRandomTranslate();
  }, [fetchProjectNames]);
  
  const handleInvite = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    if (selectedProject === "") {
      alert("Please select a project.");
      return;
    }

    try {
      const jwtToken = localStorage.getItem('token');
      console.log(jwtToken);
  console.log(selectedProject);
      // Make an API call using Axios and include the token in the headers
      axios
        .post("http://localhost:8000/api/users/invite", { email,selectedProject }, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          // Handle success response
          console.log("Invitation sent successfully:", response.data);
        setErrorText("Invitation sent successfully");
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            setErrorText( error.response.data.error);
          } else {
            setErrorText("An unknown error occurred while sending the invitation.");
          }
          console.error("Error sending invitation:", error);
        });
    } catch (error) {
      console.error("Error accessing cookie:", error);
    }
  };
  
  const animationStyle = {
    background: "linear-gradient(-45deg, #000000, #001144, #000000)",
    backgroundSize: "600% 600%",
    animation: "gradientAnimation 10s ease infinite",
  };

  return (
    <CSSTransition in={isAnimated} timeout={500} classNames="fade">
      <div style={animationStyle} className="flex h-screen items-center justify-center relative ">
        {/* Background Stars */}
        <div className="absolute top-0 left-0 right-0 bottom-0 ">
         
          {/* Add as many stars as you like */}
        </div>
        {/* Moving Stars */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="absolute w-3 h-3 text-white animate-star1">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l2.4 7.3h7.7l-6 4.6 2.4 7.3L12 18.2l-6 4.6 2.4-7.3-6-4.6h7.7z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="absolute w-3 h-3 text-white animate-star2">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l2.4 7.3h7.7l-6 4.6 2.4 7.3L12 18.2l-6 4.6 2.4-7.3-6-4.6h7.7z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="absolute w-3 h-3 text-white animate-star3">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l2.4 7.3h7.7l-6 4.6 2.4 7.3L12 18.2l-6 4.6 2.4-7.3-6-4.6h7.7z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* Add more moving stars with different animation classes */}
        </div>
        <div className="max-w-sm p-8 border rounded shadow-lg bg-white z-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            INVITE YOUR TEAM
          </h2>
          <div className="relative">
          {errorText && <p className="text-red-500 text-sm mb-2">{errorText}</p>}

            <input
              type="email"
              className="w-full py-2 pl-3 pr-10 border rounded focus:outline-none focus:ring focus:border-blue-300 transition-all"
              placeholder="Enter your email address"
              value={email} // Set the input value to the state variable
              onChange={(e) => setEmail(e.target.value)} // Update the state with the entered email
          
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-bold text-gray-900 mb-2">
              Select Project:
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full py-2 px-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition-all"
            >
              <option value="">Select a project</option>
              {projectNames.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleInvite} className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
            INVITE
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default InvitationPage;
