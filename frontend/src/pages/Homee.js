import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import ProjectNamePage from '../components/prjectname';
import '../index.css';
import axios from 'axios';
const Homee = () => {
  
  async function verifyUser() {
    try {
      const storedUserString = localStorage.getItem('user');
      const storedUser = JSON.parse(storedUserString);
      console.log(storedUser);
  
      if (!storedUser || !storedUser.email) {
        console.log('User data not found or email is missing!');
        return;
      }
  
      const userEmail = storedUser.email;
      console.log('User Email:', userEmail);
  
      const response = await axios.post('http://localhost:8000/api/users/checking', {
        email: userEmail,
      });
      if (response.status !== 200) {
        console.log('User verification failed!');
        navigate('/login')
      }
    } catch (error) {
      console.error(error);
    }
  }
  const navigate = useNavigate();

  verifyUser();
  
  


 
  return (
    <div>
      <Link to="/">Go back home</Link>
      <ProjectNamePage />
      
    </div>
  );
};

export default Homee;
