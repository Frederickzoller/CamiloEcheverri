import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CVLandingPage from './pages/CVLandingPage';
import { initializeResponsive } from './store/slices/uiSlice';

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize responsive detection
    dispatch(initializeResponsive());
    
    // Handle window resize events
    const handleResize = () => {
      dispatch(initializeResponsive());
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);
  
  return (
    <Routes>
      <Route path="/" element={<CVLandingPage />} />
    </Routes>
  );
};

export default App; 