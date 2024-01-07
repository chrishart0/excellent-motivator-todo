import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";

type ErrorComponentProps = {
  errorMessage: string;
  autoDismiss?: boolean; // Optional auto-dismiss feature
  dismissTime?: number; // Time in milliseconds after which the error should be dismissed
};

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  errorMessage,
  autoDismiss = true,
  dismissTime = 100000, // Defaults to 10 seconds
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
          margin: "auto",
          width: "80%",
          marginTop: "10%",
        }}
      >
        <Alert
          variant="filled"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Error</AlertTitle>
          <Typography id="error-modal-description" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        </Alert>
      </Box>
    </Modal>
  );
};

export default ErrorComponent;
