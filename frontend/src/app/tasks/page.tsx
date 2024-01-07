"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Custom Components
import ErrorComponent from "@/components/ErrorComponent";
import TasksList from "@/components/TasksList";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskRefresher from "@/components/TaskRefresher";

// const BASE_URL = "http://localhost:8010"
const BASE_URL = "http://192.168.1.216:8010";

async function getItems() {
  try {
    const response = await fetch(`${BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error; // Re-throw the error to be caught in the component
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshFrequency, setRefreshFrequency] = useState(60000);

  useEffect(() => {
    const fetchData = () => {
      getItems()
        .then((items) => {
          setTasks(items);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`${BASE_URL}/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();
      console.log("Updated task: ", newTask);
      setTasks(tasks.map((task) => (task.id === taskId ? newTask : task))); // Update the state to include the new task
    } catch (error) {
      setError(error.message);
      console.error("Failed to update task:", error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const response = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdTask = await response.json();
      setTasks([...tasks, createdTask]); // Update the state to include the new task
      console.log("Created task: ", createdTask);
    } catch (error) {
      setError(error.message);
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/todos/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks(tasks.filter((task) => task.id !== taskId)); // Remove the task from the UI
    } catch (error) {
      setError(error.message);
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
      <ErrorComponent errorMessage={`Error loading tasks: ${error}`} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h1" gutterBottom>
          Tasks Page
        </Typography>
        <CreateTaskForm onCreate={handleCreateTask} />
        <Typography variant="h2" gutterBottom>
          Tasks
        </Typography>
        <Box sx={{ mb: "1vh" }}>
          <TaskRefresher
            fetchTasks={getItems}
            onRefresh={setTasks}
            refreshInterval={refreshFrequency}
          />
        </Box>
        <TasksList
          items={tasks}
          setTasks={setTasks}
          onDelete={handleDeleteTask}
          onEdit={handleUpdateTask}
        />
      </Box>
    </>
  );
}
