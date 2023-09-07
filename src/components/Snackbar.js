// src/components/Snackbar.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { closeSnackbar } from '../store/slices/snackbarSlice';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Adjust as needed
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
