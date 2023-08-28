import React, { useState } from 'react';
import { GoMoveToStart } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { useEffect } from 'react';
import Stacked from '../components/Stacked';
import  SparkLine  from '../components/Stacked';
import  Pie  from '../components/Stacked';
import  Button  from '../components/Stacked';
import  LineChart  from '../components/Stacked';
import { medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import product9 from '../data/product9.jpg';
import axios from 'axios';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiPercent, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart,FiList } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsDatabaseFillGear, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


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

  const dashboardData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: `${usersCount}`,
      // percentage: '-4%',
      title: 'Users',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <BsDatabaseFillGear />,
      amount: `${projectsCount}`,
      // percentage: '+23%',
      title: 'Projects',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <FiList />,
      amount: `${tasksCount}`,
      // percentage: '+38%',
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


    // async function getTasks() {
    //   try {
    //     const response = await axios.get('http://localhost:3001/api/tasks');
    //     console.log(response.data);
    //     setTasks(response.data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // }
    // getTasks();


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
              {/* <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" /> */}
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
              {/* <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" /> */}
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
            {/* <div className="mt-4">
              <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div> */}
          </div>

        </div>
       
        {/* <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3"> */}
          {/* <div className="flex justify-between">
            <p className="text-xl font-semibold">Recent Tasks</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>
          <div className="mt-10">
            <img
              className="md:w-96 h-50 "
              src={product9}
              alt=""
            />
            <div className="mt-8">
              <p className="font-semibold text-lg">React 18 coming soon!</p>
              <p className="text-gray-400 ">By Johnathan Doe</p>
              <p className="mt-8 text-sm text-gray-400">
                This will be the small description for the news you have shown
                here. There could be some great info.
              </p>
              <div className="mt-3">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Read More"
                  borderRadius="10px"
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    
</>
  );
};

export default Dashboard;