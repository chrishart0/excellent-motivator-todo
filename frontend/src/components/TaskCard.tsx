import React from 'react';
import PropTypes from 'prop-types';
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

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return format(new Date(dateString), 'PPpp');
    } catch (error) {
        console.error('Invalid date format:', error);
        return 'Invalid date';
    }
};

function TaskCard({ cardProps, handleOpen, onDelete, onMoveUp, onMoveDown }) {
    if (!cardProps) return null;

    return (
        <Grid item xs={12}>
            <Card variant='outlined' sx={{ minWidth: 270 }}>
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
}

TaskCard.propTypes = {
    cardProps: PropTypes.object.isRequired,
    handleOpen: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onMoveUp: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
};

export default React.memo(TaskCard);
