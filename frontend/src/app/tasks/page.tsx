"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";


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
  const [errorList, setErrorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshFrequency, setRefreshFrequency] = useState(60000);

  type Error = {
    message: string;
  };

  const addError = useCallback((error: Error) => {
    const id = uuid();
    setErrorList((prev) => [...prev, { error: error, id }]);
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrorList((prev) => prev.filter((error) => error.id !== id));
  }, []);

  function ErrorListDisplay() {
    if (errorList.length === 0) return null;

    console.log("ErrorListDisplay: ", errorList);
  
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingTop: "5vh",
          // Float the error list above the rest of the content and follow screen 
          position: "sticky",
          zIndex: 100,
          top: 50,
        }}
      >
        <Stack sx={{ width: "100%" }} spacing={2}>
          {errorList.map((error) => (
            <ErrorComponent 
              key={error.id} 
              errorMessage={error.error} 
              errorId={error.id}
              dismissError={() => dismissError(error.id)} // Pass a function to dismiss this specific error
            />
          ))}
        </Stack>
      </Box>
    );
  }

  useEffect(() => {
    const fetchData = () => {
      getItems()
        .then((items) => {
          setTasks(items);
          setLoading(false);
        })
        .catch((error) => {
          addError(error.message);
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
      addError(error.message);
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
      addError(error.message);
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
      addError(error.message);
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
      <ErrorListDisplay />
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
