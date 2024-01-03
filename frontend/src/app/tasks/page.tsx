'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorComponent from '@/components/ErrorComponent';
import TasksList from '@/components/TasksList';
import CreateTaskForm from '@/components/CreateTaskForm';


const BASE_URL = "http://localhost:8010"

async function getItems() {
  try {
    const response = await fetch(`${BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;  // Re-throw the error to be caught in the component
  }
}


export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then(items => {
        setTasks(items);
        console.log(items);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (error) {
    return <ErrorComponent errorMessage={`Error loading tasks: ${error}`} />;
  }

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${BASE_URL}/todos/${taskId}`, {
        method: 'PUT', // or PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();
      console.log("Updated task: ", newTask);
      setTasks(tasks.map(task => task.id === taskId ? newTask : task)); // Update the state to include the new task
    } catch (error) {
      setError(error.message);
      console.error("Failed to update task:", error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]); // Update the state to include the new task
    } catch (error) {
      setError(error.message);
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/todos/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks(tasks.filter(task => task.id !== taskId)); // Remove the task from the UI
    } catch (error) {
      setError(error.message);
      console.error("Failed to delete task:", error);
    }
  };

  const onMoveUp = async (taskId, taskColumnList) => {
    console.log("Move up task: ", taskId);

    console.log("Task column list: ", taskColumnList);
  }

  const onMoveDown = async (taskId) => {
    console.log("Move down task: ", taskId);
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1" gutterBottom>
          Tasks Page
        </Typography>
        <CreateTaskForm onCreate={handleCreateTask} />
        <TasksList items={tasks} onDelete={handleDeleteTask} onEdit={handleUpdateTask}/>
      </Box>
    </Container>
  );
}
