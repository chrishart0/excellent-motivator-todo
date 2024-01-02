const updateTask = async (taskId, updatedTask) => {
    const BASE_URL = "http://localhost:8010"

    try {
      const response = await fetch(`${BASE_URL}/todos/${taskId}`, {
        method: 'PUT', // or PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTask = await response.json();
      console.log("Updated task: ", newTask);
      setTasks(tasks.map(task => task.id === taskId ? newTask : task)); // Update the state to include the new task
    } catch (error) {
      setError(error.message);
      console.error("Failed to update task:", error);
    }
  };

const updateTaskStatus = async (taskId, newStatus, setError) => {
    try {
      const updatedTask = { status: newStatus };
      await updateTask(taskId, updatedTask);
      console.log(`Task ${taskId} status updated to ${newStatus}`);
    } catch (error) {
      setError(error.message);
      console.error("Failed to update task status:", error);
    }
  };
  
export default updateTaskStatus;