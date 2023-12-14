import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'PPpp');
};

function TasksList({ items }) {
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default TasksList;
