// TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks whenever tasks or searchTerm changes
  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tasks`);
      setTasks(response.data);
      setFilteredTasks(response.data); // Initialize filteredTasks
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/task/${id}`);
      // Update the state by removing the deleted task
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div>
        <input
          type="text"
          placeholder="Search by task name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <div key={task._id} className="m-5 d-flex">
            <div className="bg-light border-0 shadow-lg card m-5 p-5">
              <div className="px-5 fs-1 fw-bold text-dark">
                {task.name}
              </div>
              <div className="px-5 fs-4 mx-5 mt-3 text-dark">
                <p>Description: {task.description}</p>
              </div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-danger ms-3"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
