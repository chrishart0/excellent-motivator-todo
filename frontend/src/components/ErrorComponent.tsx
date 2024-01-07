import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Stack from "@mui/material/Stack";

type ErrorComponentProps = {
  errorMessage: string;
  onRetry?: () => void; // Optional retry function
  autoDismiss?: boolean; // Optional auto-dismiss feature
  dismissTime?: number; // Time in milliseconds after which the error should be dismissed
};

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  errorMessage,
  onRetry,
  autoDismiss = true,
  dismissTime = 5000, // Defaults to 5 seconds
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoDismiss) {
      timer = setTimeout(() => {
        setVisible(false);
      }, dismissTime);
    }
    return () => {
      if (timer) clearTimeout(timer); // Clean up the timer
    };
  }, [autoDismiss, dismissTime]);

  if (!visible) return null; // Don't render the component if it's not visible

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ReportProblemIcon color="error" sx={{ fontSize: 40 }} />
        <Typography
          id="error-modal-title"
          variant="h6"
          component="h2"
          sx={{ mt: 2 }}
        >
          An Error Occurred
        </Typography>
        <Typography id="error-modal-description" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
        {onRetry && (
          <Button color="primary" onClick={onRetry} sx={{ mt: 2 }}>
            Retry
          </Button>
        )}
        <Button color="secondary" onClick={handleClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorComponent;
