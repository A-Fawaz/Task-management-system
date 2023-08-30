import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SiTask } from 'react-icons/si';
import { FiPercent, FiEdit} from 'react-icons/fi';
import { AiOutlineCalendar} from 'react-icons/ai';
import { BsKanban } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useParams, useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';



// import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const   Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [links, setLinks] = useState([]);
  const [toValue, setToValue] = useState('/');
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('projectId'));
  const projectId = searchParams.get('projectId');
  const [userRole, setUserRole] = useState(null);

  // const userRole = 'admin';
  const updateToValue = (value) => {
    setToValue(value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwt_decode(token);
      const fetchedUserRole = decodedToken.role;
  
      setUserRole(fetchedUserRole);
    }
  }, []);
  useEffect(() => {
  
  if (userRole === 'admin') {
    updateToValue('/');
    // Add admin-specific routes here
    setLinks([
      {
        title: 'Dashboard',
        links: [
          {
            route: 'dashboard',
            name: 'Stats',
            icon: <FiPercent />,
          },
        ],
      },
    
      {
        title: 'Pages',
        links: [
          {
            route: 'payment',
            name: 'Payment',
            icon: <FiEdit />,
          },
          {
            route: 'profits',
            name: 'Profits',
            icon: <FiEdit />,
          }
          
        
          
        ],
      },
 
     
    ]);
  } else if (userRole === 'user') {
    updateToValue('/userhomepage');
    setLinks( [
      {
        title: 'Projects',
        links: [
          {
            route: 'Project1',
            name: 'project1',
            icon: <FiEdit />,
          },
          {
            route: 'Project2',
            name: 'project2',
            icon: <FiEdit />,
          },
          {
            route: 'Project3',
            name: 'project3',
            icon: <FiEdit />,
          },
          
          
        ],
      },
      {
        title: 'Apps',
        links: [
          {
            route: 'calendar/?projectId='+ projectId,
            name: 'calendar',
            icon: <AiOutlineCalendar />,
          },
          {
            route: 'kanban/?projectId='+ projectId,
            name: 'kanban',
            icon: <BsKanban />,
          }
        ],
      },  
      {
        title: 'Options',
        links: [
          {
            route: 'createproject',
            name: 'Create a project',
            icon: <AiOutlineCalendar />,
          },
          {
            route: 'addtask',
            name: 'Add a task',
            icon: <BsKanban />,
          },
       
        ],
      },
     
    ]);
    // Additional routes for 'user' role can be added here, if needed
  }
}, [userRole, projectId]);
  
  // Now, 'filteredLinks' will contain the routes based on the userRole
  



  const handleCloseSideBar = () => { 
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-black  text-md m-2 bg-light-gray m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 z-50 ">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center z-40">
            
            <Link id='a' to={toValue} onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 ">
              <SiTask /> <span>Task MS</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block ">
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          
          <div className="mt-10 ">
          <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 ">
            </Link>
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.route}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;