// frontend/src/components/TaskRefresher.tsx

import { useEffect, useState } from "react";

// MUI Components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// MUI Icons
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

type RefresherProps = {
  fetchTasks: () => Promise<any[]>; // Function that returns a promise of an array of tasks
  onRefresh: (newTasks: any[]) => void; // Specify the correct type for your tasks
  refreshInterval: number;
};

const TaskRefresher: React.FC<RefresherProps> = ({
  fetchTasks,
  onRefresh,
  refreshInterval,
}) => {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(
    refreshInterval / 1000
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching tasks...");
        const items = await fetchTasks();
        onRefresh(items);
        setSecondsUntilRefresh(refreshInterval / 1000); // Reset the countdown
      } catch (error) {
        console.error("Failed to refresh tasks:", error);
        // Handle error appropriately, maybe pass it to onRefresh as well
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    const countdown = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [fetchTasks, refreshInterval, onRefresh]);

  const handleManualRefresh = async () => {
    try {
      console.log("Manually fetching tasks...");
      const items = await fetchTasks();
      onRefresh(items);
      setSecondsUntilRefresh(refreshInterval / 1000); // Reset the countdown
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
      // Handle error appropriately, maybe pass it to onRefresh as well
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
      onClick={handleManualRefresh}
    >
      <CircularProgress
        variant="determinate"
        value={(secondsUntilRefresh / (refreshInterval / 1000)) * 100}
        size={20}
        thickness={4}
        sx={{ color: "primary.main" }}
      />
      <Typography variant="body1" sx={{ marginLeft: 2, fontSize: 14 }}>
        Next refresh in {secondsUntilRefresh} seconds
      </Typography>
      <IconButton size="small" sx={{ marginLeft: 2 }}>
        <RefreshIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TaskRefresher;
