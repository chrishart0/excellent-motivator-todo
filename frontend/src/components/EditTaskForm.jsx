import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditTaskForm = ({ task, onEdit, setEditTaskModelOpen }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.due_date);
  }, [task]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Recreate the task object with the new values dynamically finding all values and only setting the ones that have changed
    const newTask = {
      ...task,
      title,
      description,
      status,
      due_date: dueDate,
    };

    // onEdit(newTask);
    onEdit(task.id, newTask);
    setEditTaskModelOpen(false);
  };

  // Function to get today's date in YYYY-MM-DD format
  const getYesterdayString = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Set to yesterday
    return today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* X button at top of card to close this form */}
      <Button
        onClick={() => setEditTaskModelOpen(false)}
        sx={{ position: "absolute", top: 0, right: 0 }}
      >
        <CloseIcon />
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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update Task
      </Button>
    </Box>
  );
};

export default EditTaskForm;
