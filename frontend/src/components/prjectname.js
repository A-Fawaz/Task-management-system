import React, { useState } from "react";
import { useNavigate  } from 'react-router-dom';

import axios from 'axios';
import "./ProjectNamePage.css"; // Import the CSS file

const ProjectNamePage = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (projectName.trim() !== "" && description.trim() !== "") {
    // Perform any necessary action with the project name
    // // For this example, we'll make an HTTP POST request to the backend API
    const storedUserString = localStorage.getItem('user');
    const storedUser = JSON.parse(storedUserString);
    const userid = storedUser._id;
    axios
      .post("http://localhost:8000/api/projects/", { project_name: projectName,
      project_description: description, creatorId:userid})
      .then((response) => {
        // Handle the response from the backend if needed
        console.log("Response from backend:", response.data);

        navigate('/invitation')
      })
      .catch((error) => {
        console.error("Error:", error.response.data);
  console.error("Status Code:", error.response.status);
      });
    }else{
      console.error("Project name and description must not be empty.");

    }

  };
  

  return (
    <div className="project-name-container">
      <div className="input-container">
        <div className="input-wrapper">
          <label style={{ fontSize: "20px" }} htmlFor="projectName">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Example:My Awesome Project"
            aria-label="Project Name Input"
          />
           <label style={{ fontSize: "20px" }} htmlFor="projectName">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            aria-label="Description Input"
          />
          <button onClick={handleSubmit}>Make Project</button>
        </div>
      </div>
      <div className="text-container">
        <h1>Project Name</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore,
          nulla dolorum ipsam nemo rerum quos?
        </p>
      </div>
    </div>
  );
};

export default ProjectNamePage;
