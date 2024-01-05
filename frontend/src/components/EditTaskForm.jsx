import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
 

const EditTaskForm = ({ task, onEdit, setEditTaskModelOpen }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  }, [task]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onEdit(task.id, { title, description, status });
    setEditTaskModelOpen(false)
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* X button at top of card to close this form */}
      <Button
        onClick={() => setEditTaskModelOpen(false)}
        sx={{ position: 'absolute', top: 0, right: 0 }}
      >
        <CloseIcon/>
      </Button>
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
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mt: 1 }}
        multiline
        rows={4}
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
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Update Task
      </Button>
    </Box>
  );
};

export default EditTaskForm;
