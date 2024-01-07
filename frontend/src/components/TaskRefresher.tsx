// frontend/src/components/TaskRefresher.tsx

import { useEffect } from 'react';

type RefresherProps = {
  fetchTasks: () => Promise<Task[]>;  // Function that returns a promise of an array of tasks
  onRefresh: (newTasks) => void;
  refreshInterval: number;
};

const TaskRefresher: React.FC<RefresherProps> = ({ fetchTasks, onRefresh, refreshInterval }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching tasks...");
        const items = await fetchTasks();
        onRefresh(items);
      } catch (error) {
        console.error("Failed to refresh tasks:", error);
        // Handle error appropriately, maybe pass it to onRefresh as well
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchTasks, refreshInterval, onRefresh]);

  return (
    <>
    </>
  ); // This component doesn't render anything
};

export default TaskRefresher;
