import { store } from '../store';
import { initializeResponsive } from '../store/slices/uiSlice';

// Breakpoints for different device types
const BREAKPOINTS = {
  mobile: {
    max: 767,
  },
  tablet: {
    min: 768,
    max: 1023,
  },
  desktop: {
    min: 1024,
  },
};

// Class to manage responsive behavior
class ResponsiveService {
  constructor() {
    this.initialized = false;
  }
  
  // Initialize the responsive service
  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Initialize responsive state
    this.updateResponsiveState();
    
    // Listen for window resize events
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for orientation change events on mobile devices
    window.addEventListener('orientationchange', this.handleResize.bind(this));
  }
  
  // Handle window resize events
  handleResize() {
    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.updateResponsiveState();
    }, 250);
  }
  
  // Update the responsive state in Redux
  updateResponsiveState() {
    store.dispatch(initializeResponsive());
  }
  
  // Get the current device type
  getDeviceType() {
    const width = window.innerWidth;
    
    if (width <= BREAKPOINTS.mobile.max) {
      return 'mobile';
    } else if (width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  
  // Check if the current device is mobile
  isMobile() {
    return this.getDeviceType() === 'mobile';
  }
  
  // Check if the current device is a tablet
  isTablet() {
    return this.getDeviceType() === 'tablet';
  }
  
  // Check if the current device is a desktop
  isDesktop() {
    return this.getDeviceType() === 'desktop';
  }
  
  // Check if the current device supports touch
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  // Get the appropriate animation complexity for the current device
  getAnimationComplexity() {
    const deviceType = this.getDeviceType();
    
    switch (deviceType) {
      case 'mobile':
        return 'low';
      case 'tablet':
        return 'medium';
      case 'desktop':
        return 'high';
      default:
        return 'medium';
    }
  }
}

// Create and export a singleton instance
const responsiveService = new ResponsiveService();
export default responsiveService; 