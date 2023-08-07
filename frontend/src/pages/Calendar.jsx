import React, { useEffect, useState,useCallback } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import  axios  from "axios";
import { scheduleData } from '../data/dummy';
import  Header  from '../components/Header';
import { useParams, useSearchParams,useNavigate } from 'react-router-dom';


// eslint-disable-next-line react/destructuring-assignment
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Scheduler = () => {
  const navigate = useNavigate();

  const [scheduleObj, setScheduleObj] = useState();
  const [tasks, setTasks] = useState([]); 
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedProject, setSelectedProject] = useState(""); 
  const [projectNames, setProjectNames] = useState([]);
  const storedUserString = localStorage.getItem('user');
  const storedUser = JSON.parse(storedUserString);
  const userid = storedUser._id;

  const fetchProjectNames = useCallback(() => {
    const creatorId = userid;
    console.log(creatorId);
    axios
      .get("http://localhost:8000/api/projects/:id", { params: { creatorId } })
      .then((response) => {
        setProjectNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching project names:", error);
      });
  }, [userid]);

  const handleProjectChange = async (newValue) => {
    setSelectedProject(newValue);

    // Send data to the backend
    try {
      const response = await axios.post('http://localhost:8000/api/users/finding', {
        selectedProject: newValue,
      });
      const projectId = response.data.projectid._id;
      navigate('/calendar?projectId='+projectId)
      console.log('Project Id: ',projectId)
      // Handle the response as needed
      console.log('Backend response:', response.data);
    } catch (error) {
      // Handle error
      console.error('Error sending data to backend:', error);
    }
  };


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
  fetchProjectNames();
 
 async function getTasks() {
      try {
        const response = await axios.get('http://localhost:8000/api/tasks?projectId=' + projectId);
        console.log(response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getTasks();

}, [fetchProjectNames])

const transformedData = tasks.map((task) => ({
  Id: task._id,
  Subject: task.task_name,
  StartTime: new Date(task.createdAt),
  EndTime: new Date(task.due_date),
  Location: task.status,
  // Other properties mapping...
}));
console.log(transformedData)
  const change = (args) => {
    scheduleObj.selectedDate = args.value;
    scheduleObj.dataBind();
  };

  const onDragStart = (arg) => {
    // eslint-disable-next-line no-param-reassign
    arg.navigation.enable = true;
  };

  return (
    
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
       <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full py-2 px-3 border rounded focus:outline-none focus:ring focus:border-blue-300 transition-all"
            >
              <option value="">Select a project</option>              
              {projectNames.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </select>
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date(2023, 0, 10)}
        eventSettings={{ dataSource: transformedData }}
        dragStart={onDragStart}
      >
        <ViewsDirective>
          { ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => <ViewDirective key={item} option={item} />)}
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
                  value={new Date(2023, 0, 10)}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;