import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import Sidebar from '../components/Sidebar';
import { useStateContext } from '../contexts/ContextProvider';
import Navbar from '../components/Navbar';

import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';

import { kanbanGrid } from '../data/dummy';
import Header from '../components/Header';
import { useParams, useSearchParams } from 'react-router-dom';

const kanbanData = [
  {
    Id: 'Task 1',
    Title: 'Task - 29001',
    Status: 'Open',
    Summary: 'Analyze the new requirements gathered from the customer.',
    Priority: 'Low',
  },
  {
    Id: 'Task 2',
    Title: 'Task - 29001',
    Status: 'Open',
    Summary: 'Analyze the new requirements gathered from the customer.',
    Priority: 'High',
  }
];


const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTaskTitle, setSelectedTaskTitle] = useState(""); // Add this state
 
  // const openModal = (taskTitle) => {
  //   setSelectedTaskTitle(taskTitle); // Set the selected task title
  //   // Your modal opening logic
  // };
  console.log(searchParams.get('projectId'));
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks?projectId=' + projectId);
        console.log(response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getTasks();

  }, [])

  // const handleActionBegin = (args) => {
  //   if (args.requestType === 'cardChange') {
  //     const eventData = args.data;

  //     // Create the updated task object
  //     const updatedTask = {
  //       projectId: projectId,
  //       task_name: eventData.Title,
  //       task_description: eventData.Summary,
  //       status: eventData.Status,
  //       // Other properties mapping...
  //     };

      // Send a PATCH request to update the task
    //   axios.patch(`http://localhost:3001/api/tasks/${eventData.Id}`, updatedTask)
    //     .then((response) => {
    //       const updatedTasks = tasks.map((task) => {
    //         if (task._id === eventData.Id) {
    //           return { ...task, ...updatedTask };
    //         }
    //         return task;
    //       });
    //       setTasks(updatedTasks);
    //     })
    //     .catch((error) => {
    //       console.error('Error updating task:', error);
    //     });
    // }
    
  


  const transformedData = tasks.map((task) => ({
    Id: task._id,
    Title: task.task_name,
    Status: task.status,
    Summary: task.task_description,
    // Other properties mapping... 
  }));
  console.log(transformedData)
  const {activeMenu} = useStateContext();

  return (<>

    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
    <Navbar />
  </div>
    <div className='flex relative dark:bg-main-dark-bg'>
{activeMenu? (
  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-50'>
    <Sidebar />
  </div>
) : (
  <div className='w-0 dark:bg-secondary-dark-bg'>
    <Sidebar />
  </div>
)}
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Kanban" />
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={transformedData}
        cardSettings={{
          contentField: 'Summary',
          headerField: 'Id',
          template: props => (<div className="card-template ">
            <div className='e-card-content '>
              <table className="card-template-wrap ">
                <tbody>
                  <tr>
                    <td className="CardHeader"></td>
                    <td>{props.Title}</td>
                  </tr>
                  <tr>
                    <td className="CardHeader"></td>
                    <td>{props.Summary}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          )
        }}
        // actionBegin={handleActionBegin}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {kanbanGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
    </div>
    </>
  )
};

export default Kanban;