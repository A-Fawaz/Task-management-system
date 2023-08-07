import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './index.css'; // Import the styles
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homee from './pages/Homee';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetPage from './pages/PasswordResetPage ';
import InvitationPage from './pages/invitation';
import Home2 from './pages/home2';
import {FiSettings} from 'react-icons/fi';
import {TooltipComponent} from '@syncfusion/ej2-react-popups';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ThemeSettings from './components/ThemeSettings';
import Dashboard from './pages/dashboard';
import { ContextProvider,useStateContext } from './contexts/ContextProvider';
import { Orders,Calendarlendar,Kanban,} from './pages';
import './App.css'
import Scheduler from './pages/Calendar';

function App() {
  const {activeMenu} = useStateContext();
  return (
    <div>
    <BrowserRouter>
    <div className='flex relative dark:bg-main-dark-bg'>
<div className="fixed right-4 bottom-4" style={{zIndex:'1000'}}>
  <TooltipComponent content="Settings" position="Top" >
    <button type='button' className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray texte-white'
    style={{background:"purple", borderRadius:'50%'}}>
      <FiSettings />
    </button>
  </TooltipComponent>
</div>
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homee" element={<Homee />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/invitation" element={<InvitationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<PasswordResetPage />} /> {/* Correct the component name */}
        <Route path="/" element={<Dashboard />}/>
                <Route path="/ecommerce" element={<Dashboard />}/>

                {/* pages  */}
                <Route path="/tasks" element={<tasks />} />

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />}/>
                <Route path="/editor" element={<editor />}/>
                <Route path="/calendar" element={<Scheduler />}/>
                <Route path="/color-picker" element={<color-picker />} />
                </Routes>
        </div>
    </div>
      </div>
      </BrowserRouter>
    </div>
    
      
      
    
    
  );
}
function ParentComponent() {
  return (
    <ContextProvider>
      <App />
    </ContextProvider>
  );
}


export default ParentComponent;
