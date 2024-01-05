import React, { useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const CreateTaskForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ToDo');
  const [dueDate, setDueDate] = useState(undefined);

  // Function to get today's date in YYYY-MM-DD format
  const getYesterdayString = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Set to yesterday
    return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newTask = { title, description, status, "due_date": dueDate };
    onCreate(newTask); // Callback to handle the creation
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        required
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mt: 1 }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mt: 1 }}
      />
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="ToDo">ToDo</MenuItem>
          <MenuItem value="InProgress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
        {/* Due date picker limited to just day*/}
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          sx={{ mt: 1 }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getYesterdayString(), // Limit the date to today or future
          }}
        />
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Create Task
      </Button>
    </Box>
  );
};

export default CreateTaskForm;
