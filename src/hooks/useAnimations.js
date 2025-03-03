import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import animationService from '../services/animationService';
import { setAnimationsLoaded, setAnimationsEnabled } from '../store/slices/uiSlice';

/**
 * Custom hook for Three.js animations
 * @returns {Object} Animation state and functions
 */
const useAnimations = () => {
  const dispatch = useDispatch();
  const { animations, device } = useSelector((state) => state.ui);
  
  // Initialize animation service
  useEffect(() => {
    animationService.initialize();
  }, []);
  
  // Create a new Three.js scene
  const createScene = useCallback((containerId, options = {}) => {
    return animationService.createScene(containerId, options);
  }, []);
  
  // Create particles animation
  const createParticlesAnimation = useCallback((containerId, options = {}) => {
    return animationService.createParticlesAnimation(containerId, options);
  }, []);
  
  // Create floating text animation
  const createFloatingTextAnimation = useCallback((containerId, text, options = {}) => {
    return animationService.createFloatingTextAnimation(containerId, text, options);
  }, []);
  
  // Enable or disable animations
  const setEnabled = useCallback((enabled) => {
    dispatch(setAnimationsEnabled(enabled));
  }, [dispatch]);
  
  // Clean up animations when component unmounts
  const cleanupScene = useCallback((containerId) => {
    animationService.destroyScene(containerId);
  }, []);
  
  // Mark animations as loaded
  const setLoaded = useCallback(() => {
    dispatch(setAnimationsLoaded(true));
  }, [dispatch]);
  
  return {
    // State
    isEnabled: animations.isEnabled,
    complexity: animations.complexity,
    isLoaded: animations.isLoaded,
    isMobile: device.isMobile,
    
    // Functions
    createScene,
    createParticlesAnimation,
    createFloatingTextAnimation,
    setEnabled,
    cleanupScene,
    setLoaded,
  };
};

export default useAnimations; 