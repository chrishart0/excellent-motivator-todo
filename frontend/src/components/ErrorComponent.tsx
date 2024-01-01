import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';

// ErrorComponent takes in an error message as a prop
const ErrorComponent = ({ errorMessage }) => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Alert severity="error">{errorMessage}</Alert>
    </Container>
  );
};

export default ErrorComponent;
