import React, { useState } from "react";

const HomePage = () => {
  // State to manage tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Handler to add new task
  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, newTask]);
    setNewTask("");
  };

  // Handler to remove task
  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <header>
        <h1>Task Management System</h1>
      </header>
      <section>
        <div>
          <h2>Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks added yet.</p>
          ) : (
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>
                  {task}{" "}
                  <button onClick={() => handleRemoveTask(index)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2>Add New Task</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task description"
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
