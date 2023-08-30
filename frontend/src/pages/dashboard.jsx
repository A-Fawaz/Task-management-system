import React, { useState } from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useEffect } from 'react';
import { dropdownData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiList } from 'react-icons/fi';
import { BsDatabaseFillGear} from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import jwt_decode from 'jwt-decode';
import {Navigate} from 'react-router-dom';



const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Dashboard = () => {
  const { currentColor, currentMode } = useStateContext();
  const [projectsCount, setProjectsCount] = useState();
  const [usersCount, setUsersCount] = useState();
  const [tasksCount, setTasksCount] = useState();
  const [users, setUsers] = useState();
  // const [tasks, setTasks] = useState();
  const [projects, setProjects] = useState();
  const [TasksWithProjectInfo, setTasksWithProjectInfo] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  // useEffect(() => {
  //   async function checkAdminRole() {
  //     const token = cookies.jwt;
  
  //     if (token) {
  //       const decodedToken = jwt_decode(token);
  //       const userRole = decodedToken.role;
  
  //       setIsAdmin(userRole === 'admin');
  //     }
  //   }
  
  //   checkAdminRole();
  // }, []);
 

  const dashboardData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: `${usersCount}`,
      title: 'Users',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <BsDatabaseFillGear />,
      amount: `${projectsCount}`,
      title: 'Projects',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <FiList />,
      amount: `${tasksCount}`,
      title: 'Tasks',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
  
      pcColor: 'green-600',
    }
  ];


  useEffect(() => {
    async function getProjectsCount() {
      try {
        const response = await axios.get('http://localhost:3001/api/projects/count');
        console.log(response.data);
        setProjectsCount(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getProjectsCount();

    async function getTasksCount() {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks/count');
        console.log(response.data);
        setTasksCount(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getTasksCount();



    async function getTasksWithProjectInfo() {
      try {
        const response = await axios.get('http://localhost:3001/api/tasks/TasksWithProjectInfo');
        setTasksWithProjectInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getTasksWithProjectInfo();


    async function getUsersCount() {
      try {
        const response = await axios.get('http://localhost:3001/api/users/count');
        console.log(response.data);
        setUsersCount(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getUsersCount();


    async function getUsers() {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getUsers();
    async function getProjects() {
      try {
        const response = await axios.get('http://localhost:3001/api/projects');
        console.log(response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getProjects();
  }, []);
  const {activeMenu} = useStateContext();
  return (
<>
{/* {isAdmin ? ( <div> */}

    <div className="mt-10 ml-32">
      
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {dashboardData.map((item) => (
            <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-72  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      

     

      <div className="flex flex-wrap justify-center">
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Recent Users</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
            <MdOutlineSupervisorAccount />
            </button>
          </div>

          <div className="mt-10 max-h-96 overflow-y-scroll">
            {(users ?? []).map((item) => (
              <div key={item._id} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
              
                  <div>
                    <p className="text-md font-semibold">{item.username}</p>
                    <p className="text-sm text-gray-400">{item.email}</p>
                  </div>
                </div>

                <p className={`text-${item.pcColor}`}>{item.status}</p>
              </div>
            ))}
            <div className="mt-4">
            </div>
          </div>

        </div>
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Recent Projects</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
            <BsDatabaseFillGear />
            </button>
          </div>

          <div className="mt-10 max-h-96 overflow-y-scroll">
            {(projects ?? []).map((item) => (
              <div key={item._id} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
              
                  <div>
                    <p className="text-md font-semibold">{item.project_name}</p>
                    <p className="text-sm text-gray-400">{item.project_description}</p>
                  </div>
                </div>

                <p className={`text-${item.pcColor}`}>{item.status}</p>
              </div>
            ))}
            <div className="mt-4">
            </div>
          </div>

        </div>
       
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Recent Tasks</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
            <FiList />
            </button>
          </div>

          <div className="mt-10 max-h-96 overflow-y-scroll">
            {(TasksWithProjectInfo ?? []).map((item) => (
              <div key={item._id} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
              
                  <div>
                    <p className="text-md font-semibold">{item.task_name}</p>
                    <p className="text-sm text-gray-400">{item.task_description}</p>
                  </div>
                </div>

                <p className={`text-${item.pcColor}`}>{item.project.project_name}</p>
              </div>
            ))}
          
          </div>

        </div>
        </div>
      </div>
    {/* </div>
     ) : (
      <Navigate to="/unauthorized" />
    )} */}
</>
  );
};

export default Dashboard;