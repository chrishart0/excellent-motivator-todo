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
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleOpen = (task) => {
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return; // dropped outside the list

    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      console.log("Moving task from", source, "to", destination);

      // Call function to update the task status to the new status
      const taskId = draggableId;
      const newStatus = destination.droppableId;
      console.log("Updating task", taskId, "to status", newStatus);
      console.log(items)
      // Find the task in the items array
      const task = items.find((item) => item.id === taskId);
      console.log("task: ", task)
      console.log("task.status: ", task.status)
      const updatedTask = { ...task, status: newStatus };

      onEdit(task.id, updatedTask);
    }
  };

  // Order todo items by item.position
  const todoItems = items.filter((item) => item.status === "ToDo").sort((a, b) => b.position - a.position );
  const inProgressItems = items.filter((item) => item.status === "InProgress").sort((a, b) => b.position - a.position );
  const doneItems = items.filter((item) => item.status === "Done").sort((a, b) => b.position - a.position );

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Grid container spacing={2} sx={KanbanBoard}>
        <Grid item sm={12} md={6} lg={4} sx={KanbanColumn}>
          <StrictModeDroppable droppableId="ToDo">
            {/* use a unique ID for each column */}
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={
                  {
                    /* styling here */
                  }
                }
              >
                <Typography variant="h6" component="div">
                  ToDo
                </Typography>
                {todoItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard cardProps={item} handleOpen={handleOpen} onDelete={onDelete}/>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </Grid>

        {/* Column for InProgress */}
        <Grid item xs={12} sm={4} sx={KanbanColumn}>
          <StrictModeDroppable droppableId="InProgress">
            {/* use a unique ID for each column */}
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={
                  {
                    /* styling here */
                  }
                }
              >
                <Typography variant="h6" component="div">
                  InProgress
                </Typography>
                {inProgressItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      // ... more styling and props
                      >
                        <TaskCard cardProps={item} handleOpen={handleOpen} onDelete={onDelete}/>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </StrictModeDroppable>
        </Grid>

        {/* Column for Done */}
        <Grid item xs={12} sm={4} sx={KanbanColumn}>
          <StrictModeDroppable droppableId="Done">
            {/* use a unique ID for each column */}
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={
                  {
                    /* styling here */
                  }
                }
              >
                <Typography variant="h6" component="div">
                  Done
                </Typography>
                {doneItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      // ... more styling and props
                      >
                        <TaskCard cardProps={item} handleOpen={handleOpen} onDelete={onDelete}/>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </StrictModeDroppable>
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
        // ... other modal props
        >
          <Box sx={EditItemModal}>
            {currentTask && (
              <EditTaskForm task={currentTask} onEdit={onEdit} />
            )}
          </Box>
        </Modal>
      </Grid>
    </DragDropContext>
  );
}

export default TasksList;
