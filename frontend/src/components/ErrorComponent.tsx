import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";

type ErrorId = string;

type ErrorComponentProps = {
  errorMessage: string;
  errorId: string;
  autoDismiss?: boolean; // Optional auto-dismiss feature
  dismissTime?: number; // Time in milliseconds after which the error should be dismissed
  dismissError: (errorId: ErrorId) => void; // Optional callback to dismiss the error
};

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  errorMessage,
  errorId,
  autoDismiss = true,
  dismissTime = 6000, // Defaults to 6 seconds
  dismissError,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        dismissError(errorId);
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTime]);

  return (
    <Alert
      variant="filled"
      severity="error"
      // Hide
      sx={{ display: open ? "flex" : "none" }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            dismissError(errorId);
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
  );
};

export default ErrorComponent;
