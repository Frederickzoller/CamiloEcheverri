import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGenerating: false,
  progress: 0,
  error: null,
  options: {
    filename: 'Executive-CV.pdf',
    includeProjects: true,
    includeSkills: true,
    includeEducation: true,
    includeCertifications: true,
    includeLanguages: true,
  },
};

const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    startGenerating: (state) => {
      state.isGenerating = true;
      state.progress = 0;
      state.error = null;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    finishGenerating: (state) => {
      state.isGenerating = false;
      state.progress = 100;
    },
    setError: (state, action) => {
      state.isGenerating = false;
      state.error = action.payload;
    },
    updateOptions: (state, action) => {
      state.options = { ...state.options, ...action.payload };
    },
    resetError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startGenerating,
  updateProgress,
  finishGenerating,
  setError,
  updateOptions,
  resetError,
} = pdfSlice.actions;

export default pdfSlice.reducer; 