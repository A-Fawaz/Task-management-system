import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";

import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';

import { kanbanGrid } from '../data/dummy';
import Header from '../components/Header';
import { useParams, useSearchParams } from 'react-router-dom';

const kanbanData = [
  {
    Id: 'Task 1',
    Title: 'Task - 29001',
    Status: 'Open',
    Summary: 'Analyze the new requirements gathered from the customer.',
    Priority: 'Low',
  },
  {
    Id: 'Task 2',
    Title: 'Task - 29001',
    Status: 'Open',
    Summary: 'Analyze the new requirements gathered from the customer.',
    Priority: 'High',
  }
];


const Kanban = () => {
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('projectId'));
  const projectId = searchParams.get('projectId');

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

  const transformedData = tasks.map((task) => ({
    Id: task._id,
    Title: task.task_name,
    Status: task.status,
    Summary: task.task_description,
    // Other properties mapping... 
  }));
  console.log(transformedData)

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Kanban" />
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={transformedData}
        cardSettings={{
          contentField: 'Summary',
          headerField: 'Id',
          template: props => (<div className="card-template ">
            <div className='e-card-content '>
              <table className="card-template-wrap ">
                <tbody>
                  <tr>
                    <td className="CardHeader"></td>
                    <td>{props.Title}</td>
                  </tr>
                  <tr>
                    <td className="CardHeader"></td>
                    <td>{props.Summary}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          )
        }}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {kanbanGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  )
};

export default Kanban;