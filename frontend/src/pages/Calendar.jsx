import React, { useEffect, useState } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import axios from "axios";
import { scheduleData } from '../data/dummy';
import Header from '../components/Header';
import { useParams, useSearchParams } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
import { useStateContext } from '../contexts/ContextProvider';
// import Navbar from '../components/Navbar';
import jwt_decode from 'jwt-decode';
import { useCookies } from 'react-cookie'; 


const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState();
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);



  
  
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
    const scheduleForm = document.querySelector('.e-schedule-form.e-lib.e-formvalidator');
  
    if (scheduleForm && !scheduleForm.querySelector('select[name="AssignedTo"]')) {
      const selectElement = document.createElement('select');
      selectElement.className = 'e-field';
      selectElement.name = 'AssignedTo';
  
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Assign to member';
      selectElement.appendChild(defaultOption);
  
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = user.username;
        selectElement.appendChild(option);
      });
  
      scheduleForm.appendChild(selectElement);
  
      selectElement.addEventListener('change', (event) => {
        setSelectedUser(event.target.value);
      });
    } else {
      console.log('Schedule form not found or select element already exists.');
    }
  }, []);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    getUsers();
  }, [users]);
  
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

  //   const token = cookies.jwt;

  // if (token) {
  //   const decodedToken = jwt_decode(token);
  //   const userRole = decodedToken.role;
  //   setUserRole(userRole);
  // }

    
  }, [projectId])

 

// ...

const [userRole, setUserRole] = useState(null);
const [cookies] = useCookies(['jwt']); 




  const handleActionBegin = (args) => {
    console.log('Event Data:', args.data);
    console.log('Action type:', args.requestType);
    console.log('Args:', args);
  console.log('args.data:', args.data);
  
  // if (userRole === 'creator') {
    if (args.requestType === 'eventRemove') {
      const deletedEventId = args.data[0].Id; // Assuming your data has an "Id" field 

      axios.delete(`http://localhost:3001/api/tasks/${deletedEventId}`)
        .then((response) => { 

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
        StartTime: eventData.StartTime, 
        assigned_to: selectedUser  // Add the assigned user's ID here
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
        StartTime: eventData.StartTime,
        assigned_to: selectedUser, // Add the assigned user's ID here

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
  // } else {
  //     console.log('User does not have permission to perform this action.');
  //   }
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
    Description: task.task_description,
    AssignedTo: task.assigned_to
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


    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date(2023, 7, 10)}
        eventSettings={{
          dataSource: transformedData, allowEditing: true,
          allowDeleting: true,
        
         
        }}
        dragStart={onDragStart}
        actionBegin={handleActionBegin}
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
                  // PopupOpen={handlePopupOpen}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
    </>
  );
};

export default Scheduler;

