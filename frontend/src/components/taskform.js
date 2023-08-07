import React, { useState,useEffect, useCallback } from 'react';
import axios from 'axios';

function TaskForm() {
  const [task_name, setTaskName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAssignList, setShowAssignList] = useState(false);
  const [assignedTo, setassignedTo] = useState('');
  const [showTimeInputDue, setShowTimeInputDue] = useState(false);
  const [task_description, setDescription] = useState('');
  const [due_date, setdue_date] = useState('');
  const [showTimeInputStart, setShowTimeInputStart] = useState(false);
  const [due_start, setdue_start] = useState('');
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [priority, setPriority] = useState('');
  const priorityOptions = ['Low', 'Normal', 'High'];
  const [selectedProject, setSelectedProject] = useState(""); 
  const [projectNames, setProjectNames] = useState([]);


  const handleChange = (event) => {
    setTaskName(event.target.value);
    
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
     event.preventDefault();
     const storedUserString = localStorage.getItem('user');
    const storedUser = JSON.parse(storedUserString);
    const userid = storedUser._id;
    console.log(userid);
  // Prepare the task data to be sent to the backend
  const taskData = {

    taskName:task_name,
    taskDescription:task_description,
    assignTo: assignedTo,
    projectName:selectedProject,
    dueDate:due_date,
    startDate:due_start,
    priority:priority,
    createdBy:userid
  };
  console.log('Sending task data:', taskData);
  axios.post('http://localhost:8000/api/tasks', taskData)
  .then((response) => {
    console.log('Task created successfully:', response.data);
    setTaskName(''); // Clear the input field after successful submission
    // Add any other logic you want to perform after successful submission
  })
  .catch((error) => {
    console.error('Error creating task:', error);
    // Handle the error if the task creation fails
  });
};
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleAssignList = () => {
    setShowAssignList(!showAssignList);
  };

  const toggleTimeInputDue = () => {
    setShowTimeInputDue(!showTimeInputDue);
  };

  const toggleTimeInputStart = () => {
    setShowTimeInputStart(!showTimeInputStart);
  };

  const togglePriorityOptions = () => {
    setShowPriorityOptions(!showPriorityOptions);
  };

  const handleNameSelection = (name) => {
    setassignedTo(name);
    setShowAssignList(false); // Hide the dropdown after selecting a name
  };

  const handleTimeChangeDue = (event) => {
    setdue_date(event.target.value);
  };

  const handleTimeChangeStart = (event) => {
    setdue_start(event.target.value);
  };

  const handlePrioritySelection = (selectedPriority) => {
    setPriority(selectedPriority);
    setShowPriorityOptions(false); // Hide the priority options after selecting
  };
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
    fetchProjectNames();
    
  }, [fetchProjectNames]);
  
  // Example list of names (replace with your actual data)
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Lee'];

  return (
    <>
    <center>
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
      <button onClick={toggleForm}>New Task</button></center>
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={task_name}
            onChange={handleChange}
            placeholder="Task Name"
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            {/* "Assign" button with dropdown behavior */}
            <div style={styles.dropdownContainer}>
              <button
                type="button"
                style={styles.dropdownButton}
                onClick={toggleAssignList}
              >
                {assignedTo || 'Assign'}
              </button>
              {/* Show the dropdown when "Assign" button is clicked */}
              {showAssignList && (
                <ul style={styles.nameList}>
                  {names.map((name, index) => (
                    <li
                      key={index}
                      style={styles.nameListItem}
                      onClick={() => handleNameSelection(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* "Set Due" button with time input */}
            <button
              type="button"
              style={styles.button}
              onClick={toggleTimeInputDue}
            >
              <span>Set Due</span>
            </button>
            {/* Show the time input when "Set Due" button is clicked */}
            {showTimeInputDue && (
              <input
                type="date"
                value={due_date}
                onChange={handleTimeChangeDue}
                style={styles.timeInput}
              />
            )}
            {/* "Set Start" button with time input */}
            <button
              type="button"
              style={styles.button}
              onClick={toggleTimeInputStart}
            >
              <span>Set Start</span>
            </button>
            {/* Show the time input when "Set Start" button is clicked */}
            {showTimeInputStart && (
              <input
                type="date"
                value={due_start}
                onChange={handleTimeChangeStart}
                style={styles.timeInput}
              />
            )}
            {/* "Priority" button with options */}
            <div style={styles.dropdownContainer}>
              <button
                type="button"
                style={styles.dropdownButton}
                onClick={togglePriorityOptions}
              >
                {priority || 'Priority'}
              </button>
              {/* Show the priority options when "Priority" button is clicked */}
              {showPriorityOptions && (
                <ul style={styles.priorityList}>
                  {priorityOptions.map((option, index) => (
                    <li
                      key={index}
                      style={styles.priorityListItem}
                      onClick={() => handlePrioritySelection(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <textarea
            value={task_description}
            onChange={handleDescriptionChange}
            placeholder="Description"
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Create Task
          </button>
        </form>
      )}
    </>
  );
}



// Inline styles (updated with dropdown styles)
const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px',
    margin: '0 auto',
  },
  input: {
    padding: '8px',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  button: {
    cursor: 'pointer',
    marginRight: '5px',
  },
  submitButton: {
    cursor: 'pointer',
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
  },
  dropdownContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownButton: {
    cursor: 'pointer',
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
  },
  nameList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    zIndex: 1,
  },
  nameListItem: {
    padding: '8px',
    cursor: 'pointer',
  },
  timeInput: {
    padding: '8px',
    marginRight: '5px',
  },
  priorityList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    zIndex: 1,
  },
  priorityListItem: {
    padding: '8px',
    cursor: 'pointer',
  },
};

export default TaskForm;
