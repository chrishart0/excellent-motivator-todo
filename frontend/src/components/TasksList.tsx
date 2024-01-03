import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DragDropContext, Draggable } from "react-beautiful-dnd";

import EditTaskForm from "@/components/EditTaskForm";
import TaskCard from "@/components/TaskCard"
import StrictModeDroppable from "@/components/StrictModeDroppable"

const EditItemModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const KanbanBoard = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingTop: "20px",
};

const KanbanColumn = {
  bgcolor: "grey.200",
  minHeight: "20vh",
  padding: "5px",
  borderRadius: "5px",
  border: "1px solid rgba(0, 0, 0, 0.2)",
};

function TasksList({ items, onDelete, onEdit }) {
  const [editTaskModelOpen, setEditTaskModelOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleOpen = (task) => {
    setCurrentTask(task);
    setEditTaskModelOpen(true);
  };

  const handleClose = () => {
    setEditTaskModelOpen(false);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // dropped outside the list

    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      // Call function to update the task status to the new status
      const taskId = draggableId;
      const newStatus = destination.droppableId;
      // Find the task in the items array
      const task = items.find((item) => item.id === taskId);
      const updatedTask = { ...task, status: newStatus };

      onEdit(task.id, updatedTask);
    }
  };

  // Function to handle moving a task up in the 
  const handleMoveUp = async (taskId) => {

  }

  const handleMoveDown = async (taskId) => {
  }

  const getFilteredAndSortedItems = (status) => {
    return items
      .filter((item) => item.status === status)
      .sort((a, b) => b.position - a.position);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Grid container spacing={2} sx={KanbanBoard}>
        {['ToDo', 'InProgress', 'Done'].map((status) => (
          <Grid key={status} item xs={12} sm={4} sx={KanbanColumn}>
            <StrictModeDroppable droppableId={status}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Typography variant="h6" component="div">
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
                            handleOpen={handleOpen}
                            onDelete={onDelete}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </Grid>
        ))}
      </Grid>

      <Modal open={editTaskModelOpen} onClose={handleClose}>
        <Box sx={EditItemModal}>
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
}

export default TasksList;
