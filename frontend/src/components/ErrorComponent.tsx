import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime]);

  const handleClose = () => setOpen(false);

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
