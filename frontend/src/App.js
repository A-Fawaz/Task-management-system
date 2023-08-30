
// import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {FiSettings} from 'react-icons/fi';
import {TooltipComponent} from '@syncfusion/ej2-react-popups';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard';
import { useStateContext } from './contexts/ContextProvider';
import { Orders,Calendar,Kanban,} from './pages';
import './App.css'
import Scheduler from './pages/Calendar';
import UnauthorizedPage from './pages/UnauthorizedPage';
const App = () => {
  const {activeMenu} = useStateContext();
  return (
    <div>
    <BrowserRouter>
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


<div className={
`dark:bg-main-bg
bg-main-bg
min-h-screen w-full ${activeMenu ?
'md:m1-72' : 'flex-2'}`
}>
 <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={<Dashboard />}/>
                <Route path="/dashboard" element={<Dashboard />}/>

                {/* pages  */}
                <Route path="/tasks" element={<tasks />} />

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />}/>
                <Route path="/calendar" element={<Scheduler />}/>
                <Route path="/unauthorized" element={<UnauthorizedPage />}/>

              

              </Routes>
            </div>
            {/* <Footer /> */}
</div>
      </div>
    </BrowserRouter>
    </div>
  )
}

export default App
