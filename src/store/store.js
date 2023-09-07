// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import snackbarSlice from './slices/snackbarSlice';

export const store = configureStore({
  reducer: {
    snackbar: snackbarSlice,
    // Add other reducers here if you have them
  },
});

