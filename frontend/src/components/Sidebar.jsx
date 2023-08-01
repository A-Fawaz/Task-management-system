import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiTask } from 'react-icons/si';
import { FiPercent, FiEdit, FiPieChart, FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';

import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

// import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const   Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
 
  const userRole = 'admin';

  let links = [];
  if (userRole === 'admin') {
    // Add admin-specific routes here
     links = [
      {
        title: 'Dashboard',
        links: [
          {
            route: '',
            name: 'Stats',
            icon: <FiPercent />,
          },
        ],
      },
    
      {
        title: 'Pages',
        links: [
          {
            route: 'Tasks',
            name: 'Tasks',
            icon: <FiEdit />,
          },
        
          
        ],
      },
      {
        title: 'Apps',
        links: [
          {
            route: 'calendar',
            name: 'calendar',
            icon: <AiOutlineCalendar />,
          },
          {
            route: 'kanban',
            name: 'kanban',
            icon: <BsKanban />,
          },
          {
            route: 'editor',
            name: 'editor',
            icon: <FiEdit />,
          },
       
        ],
      },
     
    ];
  } else if (userRole === 'user') {
    // Add user-specific routes here
     links = [
      {
        title: 'Pages',
        links: [
          {
            route: 'Tasks',
            name: 'Tasks',
            icon: <FiEdit />,
          },
        
          
        ],
      },
      {
        title: 'Apps',
        links: [
          {
            route: 'calendar',
            name: 'calendar',
            icon: <AiOutlineCalendar />,
          },
          {
            route: 'kanban',
            name: 'kanban',
            icon: <BsKanban />,
          },
          {
            route: 'editor',
            name: 'editor',
            icon: <FiEdit />,
          },
       
        ],
      },
     
    ];
    // Additional routes for 'user' role can be added here, if needed
  }
  
  // Now, 'filteredLinks' will contain the routes based on the userRole
  console.log(links);



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
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 ">
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