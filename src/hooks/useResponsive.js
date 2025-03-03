import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import responsiveService from '../services/responsiveService';
import { initializeResponsive } from '../store/slices/uiSlice';

/**
 * Custom hook for responsive design functionality
 * @returns {Object} Responsive state and helper functions
 */
const useResponsive = () => {
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.ui);
  
  useEffect(() => {
    // Initialize responsive service
    responsiveService.initialize();
    
    // Initialize responsive state
    dispatch(initializeResponsive());
    
    // Clean up event listeners when component unmounts
    return () => {
      // No cleanup needed as listeners are managed by the service
    };
  }, [dispatch]);
  
  return {
    // Device information
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
    
    // Helper functions
    isTouchDevice: responsiveService.isTouchDevice(),
    
    // Current device type
    deviceType: device.isMobile ? 'mobile' : device.isTablet ? 'tablet' : 'desktop',
  };
};

export default useResponsive; 