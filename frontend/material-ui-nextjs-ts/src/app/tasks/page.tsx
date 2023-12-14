'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorComponent from '@/components/ErrorComponent';
import TasksList from '@/components/TasksList';

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
        <Typography variant="body1" gutterBottom>
          Tasks Page
        </Typography>
        <TasksList items={tasks} />
      </Box>
    </Container>
  );
}
