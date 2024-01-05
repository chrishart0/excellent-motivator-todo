import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Grid from '@mui/material/Grid';
import { format } from 'date-fns';

interface CardProps {
  id: string;
  title: string;
  owner: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  due_status: string;
}

interface TaskCardProps {
  cardProps: CardProps;
  handleOpen: (card: CardProps) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    // Updated to show only the date in a nice format (e.g., January 1, 2024)
    return format(new Date(dateString), 'PPP');
  } catch (error) {
    console.error('Invalid date format:', error);
    return 'Invalid date';
  }
};


const isDatePastDue = (due_status: string): boolean => {
  try {
    // Compare the current time with the end of the due date
    if (due_status === 'overdue') {
      return true;
    }
  } catch (error) {
    console.error('Error checking date:', error);
    return false;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ cardProps, handleOpen, onDelete, onMoveUp, onMoveDown }) => {
  if (!cardProps) return null;
  const dueDatePassed = cardProps.due_date ? isDatePastDue(cardProps.due_status) : false;


  return (
    <Grid item xs={12}>
      <Card variant='outlined' sx={{
        minWidth: 270,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow
        '&:hover': {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // more pronounced shadow on hover
        },
      }}>
        <CardContent>
          <Typography variant='h5' component='div'>
            {cardProps.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color='text.secondary'>
            Owner: {cardProps.owner}
          </Typography>
          <Typography variant='body2' style={{ whiteSpace: 'pre-wrap' }}>
            {cardProps.description}
          </Typography>
          {cardProps.due_date && (
            <Typography
              sx={{ fontSize: 14, mt: 2 }}
              color={dueDatePassed ? 'error' : 'primary'}
              display='block'
            >
              <strong>{dueDatePassed ? 'Overdue!' : 'Due Date:'}</strong> {formatDate(cardProps.due_date)}
            </Typography>
          )}
          <Chip
            label={cardProps.status}
            color='primary'
            style={{ marginTop: '10px' }}
          />
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            Created at: {formatDate(cardProps.created_at)}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color='text.secondary'>
            Updated at: {formatDate(cardProps.updated_at)}
          </Typography>
          <CardActions disableSpacing sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <Button
                variant='outlined'
                onClick={() => handleOpen(cardProps)}
                sx={{ mt: 2, mr: 1 }}
                aria-label='Edit task'
              >
                Edit
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={() => onDelete(cardProps.id)}
                sx={{ mt: 2 }}
                aria-label='Delete task'
              >
                Delete
              </Button>
            </div>
            <div>
              <IconButton
                color='primary'
                onClick={() => onMoveUp(cardProps.id)}
                aria-label='Move task up'
              >
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton
                color='secondary'
                onClick={() => onMoveDown(cardProps.id)}
                aria-label='Move task down'
              >
                <ArrowDownwardIcon />
              </IconButton>
            </div>
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default React.memo(TaskCard);
