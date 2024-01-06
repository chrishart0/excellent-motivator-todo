// frontend/src/components/TasksList.tsx
import React, { useState, useCallback, useMemo, memo } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TodayIcon from '@mui/icons-material/Today';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import EditTaskForm from '@/components/EditTaskForm';
import TaskCard from '@/components/TaskCard';
import StrictModeDroppable from '@/components/StrictModeDroppable';

// Move styles to a separate file to keep your component file clean
import { EditItemModalStyle, KanbanBoardStyle, KanbanColumnStyle, ColumnHeaderStyle } from "@/components/TasksList.styles"

const TasksList = React.memo(({ items, setTasks, onDelete, onEdit })  => {
  const [editTaskModelOpen, setEditTaskModelOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showOnlyDueToday, setShowOnlyDueToday] = useState(false);
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);

  const toggleShowOnlyDueToday = () => setShowOnlyDueToday((prev) => !prev);
  const toggleShowOnlyOverdue = () => setShowOnlyOverdue((prev) => !prev);


  const handleOpenEditModel = (task) => {
    setCurrentTask(task);
    setEditTaskModelOpen(true);
  };

  const handleCloseEditModel = () => {
    setEditTaskModelOpen(false);
  };

  // Reset function for filters
  const resetFilters = () => {
    setShowOnlyDueToday(false);
    setShowOnlyOverdue(false);
  };

  const handleOnDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list or no movement
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const task = items.find(item => item.id === draggableId);
    if (!task) return; // Task not found

    // Sort items of destination column in descending order of position
    const destinationItems = items.filter(item => item.status === destination.droppableId)
      .sort((a, b) => b.position - a.position) // 200 is higher than 100
      .filter(item => item.id !== task.id); // Remove dragged task from the list if present

    let newPosition;
    if (destinationItems.length === 0) {
      // If the destination column is empty
      newPosition = 1;
    } else if (destination.index === 0) {
      // If the card is moved to the top of the column
      newPosition = destinationItems[0].position + 1;
    } else if (destination.index === destinationItems.length) {
      // If the card is moved to the bottom of the column
      newPosition = destinationItems[destinationItems.length - 1].position - 1;
    } else {
      // If the card is placed between two other cards
      const aboveItem = destinationItems[destination.index - 1];
      const belowItem = destinationItems[destination.index];
      newPosition = (aboveItem.position + belowItem.position) / 2;
    }

    // Construct the updated task
    const updatedTask = { ...task, status: destination.droppableId, position: newPosition };

    // Update the task using the provided onEdit function
    onEdit(task.id, updatedTask);

    // Update the parent state with the new task data
    setTasks(currentItems => {
      return currentItems.map(item => item.id === updatedTask.id ? updatedTask : item);
    });
  }, [items, setTasks, onEdit]);


  // ToDo: move these large, non-rendering related functions outside of your component
  // Function to handle moving a task up in the list (towards a higher position)
  const handleMoveUp = async (taskId) => {
    const currentTask = items.find(item => item.id === taskId);
    if (!currentTask) return; // Early exit if task not found

    // Get tasks with the same status and sort them in descending order of position
    const sameColumnItems = items.filter(item => item.status === currentTask.status)
      .sort((a, b) => b.position - a.position);
    const currentIndex = sameColumnItems.findIndex(item => item.id === taskId);

    if (currentIndex > 0) { // Check if it's not already the topmost item in its column
      const itemAbove = sameColumnItems[currentIndex - 1];
      // Swap positions (increase currentTask position to move it up)
      const updatedTask = { ...currentTask, position: itemAbove.position };
      const updatedItemAbove = { ...itemAbove, position: currentTask.position };

      await onEdit(taskId, updatedTask); // Update the current task
      await onEdit(itemAbove.id, updatedItemAbove); // Update the task above

      setTasks(currentItems => {
        return currentItems.map(item => {
          if (item.id === updatedTask.id) {
            return updatedTask;
          } else if (item.id === updatedItemAbove.id) {
            return updatedItemAbove;
          }
          return item;
        });
      });
    }
  };

  // Function to handle moving a task down in the list (towards a lower position)
  const handleMoveDown = async (taskId) => {
    const currentTask = items.find(item => item.id === taskId);
    if (!currentTask) return; // Early exit if task not found

    // Get tasks with the same status and sort them in descending order of position
    const sameColumnItems = items.filter(item => item.status === currentTask.status)
      .sort((a, b) => b.position - a.position);
    const currentIndex = sameColumnItems.findIndex(item => item.id === taskId);
    console.log("Current index: ", currentIndex);
    console.log("Same column items: ", sameColumnItems);

    if (currentIndex < sameColumnItems.length - 1) { // Check if it's not already the bottom item in its column
      const itemBelow = sameColumnItems[currentIndex + 1];
      console.log("Item below position: ", itemBelow.position);
      console.log("Current task position: ", currentTask.position);
      // Swap positions (decrease currentTask position to move it down)
      const updatedTask = { ...currentTask, position: itemBelow.position };
      const updatedItemBelow = { ...itemBelow, position: currentTask.position };

      await onEdit(taskId, updatedTask); // Update the current task
      await onEdit(itemBelow.id, updatedItemBelow); // Update the task below

      // Update the parent state with the new positions
      setTasks(currentItems => {
        return currentItems.map(item => {
          if (item.id === updatedTask.id) {
            return updatedTask;
          } else if (item.id === updatedItemBelow.id) {
            return updatedItemBelow;
          }
          return item;
        });
      });
    } else { console.log("Already at bottom of column") }
  };

  // Memoize the statuses to prevent unnecessary re-renders
  const statuses = useMemo(() => ['ToDo', 'InProgress', 'Done'], []);

  // Use useMemo to avoid unnecessary recalculations
  const getFilteredAndSortedItems = useCallback(
    (status) => {
      let filteredItems = items
        .filter((item) => item.status === status)
        .sort((a, b) => b.position - a.position);

      if (showOnlyDueToday && showOnlyOverdue) {
        // Show items that are either due today or overdue
        filteredItems = filteredItems.filter((item) => item.due_status === "today" || item.due_status === "overdue");
      } else if (showOnlyDueToday) {
        // Show only items that are due today
        filteredItems = filteredItems.filter((item) => item.due_status === "today");
      } else if (showOnlyOverdue) {
        // Show only items that are overdue
        filteredItems = filteredItems.filter((item) => item.due_status === "overdue");
      }

      return filteredItems;
    },
    [items, showOnlyDueToday, showOnlyOverdue]
  );

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {/* Filter buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <ToggleButtonGroup
          value={[]}
          exclusive
          onChange={(event, newAlignment) => {
            if (newAlignment !== null) {
              setShowOnlyDueToday(newAlignment.includes('today'));
              setShowOnlyOverdue(newAlignment.includes('overdue'));
            }
          }}
          aria-label="text formatting"
        >
          <Tooltip title="Show only tasks due today">
            <ToggleButton
              value="today"
              selected={showOnlyDueToday}
              onChange={toggleShowOnlyDueToday}
              aria-label="Show only due today"
            >
              <TodayIcon />
              &nbsp;Due Today
            </ToggleButton>
          </Tooltip>

          <Tooltip title="Show only overdue tasks">
            <ToggleButton
              value="overdue"
              selected={showOnlyOverdue}
              onChange={toggleShowOnlyOverdue}
              aria-label="Show only overdue"
            >
              <ErrorOutlineIcon />
              &nbsp;Overdue
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Button
            variant="outlined"
            onClick={resetFilters}
            aria-label="Reset filters"
          >
            Reset Filters
          </Button>
      </Box>
      <Box sx={{ width: '100vw', }}>
        <Box sx={{ overflowX: 'auto', minWidth: '100vw', width: '100vw', WebkitOverflowScrolling: 'touch' }}>
          <Grid container sx={KanbanBoardStyle}>
            {statuses.map((status) => (
              <StrictModeDroppable droppableId={status} >
                {(provided) => (
                  <div style={{ minHeight: "40vh" }} {...provided.droppableProps} ref={provided.innerRef}>
                    <Grid key={status} item xs={4} sx={KanbanColumnStyle}>
                      <Typography variant="h6" component="div" sx={ColumnHeaderStyle}>
                        {status}
                      </Typography>
                      {getFilteredAndSortedItems(status).map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                cardProps={item}
                                handleOpen={handleOpenEditModel}
                                onDelete={onDelete}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                    </Grid>
                  </div>
                )}
              </StrictModeDroppable>
            ))}
          </Grid>
        </Box>

      </Box>

      <Modal open={editTaskModelOpen} onClose={handleCloseEditModel}>
        <Box sx={EditItemModalStyle}>
          {currentTask && (
            <EditTaskForm
              task={currentTask}
              onEdit={onEdit}
              setEditTaskModelOpen={setEditTaskModelOpen}
            />
          )}
        </Box>
      </Modal>
    </DragDropContext>
  );
});

export default TasksList;
