import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import uiReducer from './slices/uiSlice';
import pdfReducer from './slices/pdfSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    ui: uiReducer,
    pdf: pdfReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Three.js objects
    }),
}); 