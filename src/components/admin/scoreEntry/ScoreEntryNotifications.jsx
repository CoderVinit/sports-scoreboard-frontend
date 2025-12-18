import { Snackbar, Alert as MuiAlert } from '@mui/material';

const ScoreEntryNotifications = ({ 
  successMessage, 
  error, 
  onClearSuccess, 
  onClearError 
}) => {
  return (
    <>
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={3000} 
        onClose={onClearSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert severity="success" onClose={onClearSuccess}>
          {successMessage}
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={onClearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert severity="error" onClose={onClearError}>
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ScoreEntryNotifications;
