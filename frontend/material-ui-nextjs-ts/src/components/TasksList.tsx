import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import EditTaskForm from '@/components/EditTaskForm';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'PPpp');
};

const EditItemModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function TasksList({ items, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleOpen = (task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map(item => (
        <Card key={item.id} variant="outlined" sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Owner: {item.owner}
            </Typography>
            <Typography variant="body2">
              {item.description}
            </Typography>
            <Chip label={item.status} color="primary" style={{ marginTop: '10px' }} />
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Created at: {formatDate(item.created_at)}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              Updated at: {formatDate(item.updated_at)}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => handleOpen(item)}
              sx={{ mt: 2 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(item.id)}
              sx={{ mt: 2 }}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      <Modal
        open={open}
        onClose={handleClose}
      // ... other modal props
      >
        <Box sx={EditItemModal}>
          {currentTask && (
            <EditTaskForm task={currentTask} onUpdate={onEdit} />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default TasksList;
