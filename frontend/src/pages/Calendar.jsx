import React, { useEffect, useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import axios from "axios";
import { scheduleData } from '../data/dummy';
import Header from '../components/Header';
import { useParams, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useStateContext } from '../contexts/ContextProvider';
import Navbar from '../components/Navbar';



// eslint-disable-next-line react/destructuring-assignment
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState();
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  
  
  const scheduleData = [
    {
      Id: 1,
      Subject: 'Explosion of Betelgeuse Star',
      Location: 'Space Center USA',
      StartTime: '2021-01-10T04:00:00.000Z',
      EndTime: '2021-01-10T05:30:00.000Z',
      CategoryColor: '#1aaa55',
    },

  ];


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

  const handlePopupOpen = (args) => {
    if (args.type === 'Editor') {
      // Access the default editor elements
      const editorElement = args.element.querySelector('.e-schedule-form');
      const titleElement = editorElement.querySelector('.e-subject');
      const locationElement = editorElement.querySelector('.e-quick-popup-wrapper .e-location-icon');
      const descriptionElement = editorElement.querySelector('.e-description');

  //     if (titleElement?.parentElement?.previousSibling) {
  //       titleElement.parentElement.previousSibling.innerText = 'Task Name';
  //     }
  if (locationElement) {
    locationElement.style.setProperty('display', 'none', 'important');

  }
      const priorityContainer = document.createElement('div');
      priorityContainer.classList.add('e-form-icon');
     
       if (locationElement.parentElement) {
      locationElement.parentElement.parentElement.insertBefore(
        priorityContainer,
        locationElement.parentElement
      );
    }

  //     descriptionElement.value = 'Custom description goes here';
  //     const prioritySelect = editorElement.querySelector('.e-priority');
  //     prioritySelect.value = 'medium'; // Set a default value
  //     locationElement.parentElement.style.display = 'none';
  }}
  const handleActionBegin = (args) => {
    console.log('Event Data:', args.data);
    console.log('Action type:', args.requestType);
    console.log('Args:', args);
  console.log('args.data:', args.data);
  
    if (args.requestType === 'eventRemove') {
      const deletedEventId = args.data[0].Id; // Assuming your data has an "Id" field
      // Send a DELETE request to your backend API
      axios.delete(`http://localhost:3001/api/tasks/${deletedEventId}`)
        .then((response) => {
          // Remove the deleted task from your frontend state
          const updatedTasks = tasks.filter((task) => task._id !== deletedEventId);
          setTasks(updatedTasks);
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    }


    if (args.requestType === 'eventCreate') {
      const eventData = args.data[0];



      if (!eventData.Subject || !eventData.StartTime || !eventData.EndTime) {
        console.error('Invalid event data.');
        return;
      }
      eventData.StartTime = eventData.StartTime.toISOString();
      eventData.EndTime = eventData.EndTime.toISOString();

      // Parse date strings and convert them into Date objects
      const startDate = new Date(eventData.StartTime);
      const endDate = new Date(eventData.EndTime);

      // Check if the parsed dates are valid
      if (isNaN(startDate) || isNaN(endDate)) {
        console.error('Invalid start time or end time.');
        return;
      }
      eventData.StartTime = startDate;
      eventData.EndTime = endDate;
      const newTask = {
        projectId: projectId, // Use 'projectId' field name expected by the backend
        task_name: eventData.Subject, // Use 'task_name' field name expected by the backend
        task_description: eventData.Description, // You can set this based on your requirements
        status: eventData.Location, // Use 'status' field name expected by the backend
        priority: 'medium', // You can set this based on your requirements
        due_date: eventData.EndTime, // Use 'due_date' field name expected by the backend
        StartTime: eventData.StartTime
      };

      axios.post('http://localhost:3001/api/tasks', newTask)
        .then((response) => {
          const createdTask = response.data;
          setTasks([...tasks, createdTask]);
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    }



    if (args.requestType === 'eventChange') {
      const eventData = args.data;
      console.log('eventData:', eventData);
  console.log('Description:', eventData.Description);
    console.log('Event Data:', eventData);
      if (!eventData.Subject || !eventData.StartTime || !eventData.EndTime) {
        console.error('Invalid event data.');
        return; 
      }
  
      // Parse date strings and convert them into Date objects
      const startDate = new Date(eventData.StartTime);
      const endDate = new Date(eventData.EndTime);
  
      // Check if the parsed dates are valid
      if (isNaN(startDate) || isNaN(endDate)) {
        console.error('Invalid start time or end time.');
        return;
      }
  
      // Create the updated task object
      const updatedTask = {
        projectId: projectId, // Use 'projectId' field name expected by the backend
        task_name: eventData.Subject, // Use 'task_name' field name expected by the backend
        task_description: eventData.Description, // You can set this based on your requirements
        status: eventData.Location, // Use 'status' field name expected by the backend
        priority: 'medium', // You can set this based on your requirements
        due_date: eventData.EndTime, // Use 'due_date' field name expected by the backend
        StartTime: eventData.StartTime

      };
  
      // Send a PATCH request to update the task
      axios.patch(`http://localhost:3001/api/tasks/${eventData.Id}`, updatedTask)
        .then((response) => {
          const updatedTasks = tasks.map((task) => {
            if (task._id === eventData.Id) {
              return { ...task, ...updatedTask };     
            }
            return task;
          });
          setTasks(updatedTasks);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const transformedData = tasks.map((task) => ({
    Id: task._id,
    Subject: task.task_name,
    StartTime: new Date(task.StartTime),
    EndTime: new Date(task.due_date),
    Location: task.status,
    Description: task.task_description
    // Other properties mapping...
  }));
  // console.log(transformedData)
  const change = (args) => {
    scheduleObj.selectedDate = args.value;
    scheduleObj.dataBind();
  };

  const onDragStart = (arg) => {
    // eslint-disable-next-line no-param-reassign
    arg.navigation.enable = true;
  };
  const {activeMenu} = useStateContext();
  
  return (<>

    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
       <div className='flex relative dark:bg-main-dark-bg h-full '>
{activeMenu? (
  <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-50 h-full'>
    <Sidebar />
  </div>
) : (
  <div className='w-0 dark:bg-secondary-dark-bg'>
    <Sidebar />
  </div>
)}
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date(2023, 7, 10)}
        eventSettings={{
          dataSource: transformedData, allowEditing: true,
          allowDeleting: true
        }}
        dragStart={onDragStart}
        actionBegin={handleActionBegin}
        // popupOpen={handlePopupOpen}
      >

        <ViewsDirective>
          {['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => <ViewDirective key={item} option={item} />)}
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <PropertyPane>
        <table
          style={{ width: '100%', background: 'white' }}
        >
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={new Date(2023, 7, 10)}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                  PopupOpen={handlePopupOpen}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
    </div>
    </>
  );
};

export default Scheduler;