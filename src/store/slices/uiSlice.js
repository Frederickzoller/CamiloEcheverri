import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSection: 'hero',
  isMenuOpen: false,
  device: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  },
  animations: {
    isEnabled: true,
    complexity: 'high', // 'low', 'medium', 'high'
    isLoaded: false,
  },
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    initializeResponsive: (state) => {
      const width = window.innerWidth;
      state.device = {
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      };
      
      // Adjust animation complexity based on device
      if (state.device.isMobile) {
        state.animations.complexity = 'low';
      } else if (state.device.isTablet) {
        state.animations.complexity = 'medium';
      } else {
        state.animations.complexity = 'high';
      }
    },
    setAnimationsEnabled: (state, action) => {
      state.animations.isEnabled = action.payload;
    },
    setAnimationsLoaded: (state, action) => {
      state.animations.isLoaded = action.payload;
    },
    setAnimationComplexity: (state, action) => {
      state.animations.complexity = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setActiveSection,
  toggleMenu,
  closeMenu,
  initializeResponsive,
  setAnimationsEnabled,
  setAnimationsLoaded,
  setAnimationComplexity,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 