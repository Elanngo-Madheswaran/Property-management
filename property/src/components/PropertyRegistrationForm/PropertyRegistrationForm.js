// TodoForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
require('dotenv').config();

const TodoForm = ({ taskToEdit, onSave }) => {
  const [task, setTask] = useState({
    name: '',
    description: ''
  });

  // Set task for editing if provided
  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    }
  }, [taskToEdit]);

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!task.name || !task.description) {
      alert('Both fields are required!');
      return;
    }

    try {
      if (task._id) {
        // Update existing task
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/task/${task._id}`, task);
      } else {
        // Create a new task
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/task`, task);
      }

      // Trigger the parent component to update the task list
      onSave();

      // Reset the form
      setTask({
        name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error saving task', error);
    }
  };

  return (
    <div className="m-5 p-5">
      <h2>{task._id ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit} className="d-flex m-5 flex-column justify-content-center align-items-center">
        <input
          className="m-2 form-control w-50"
          type="text"
          name="name"
          placeholder="Task Name"
          value={task.name}
          onChange={handleChange}
          required
        />
        <textarea
          className="m-2 form-control-lg w-50"
          type="text"
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          required
        />
        <button className="btn btn-success m-3" type="submit">
          {task._id ? 'Update Task' : 'Save Task'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
