import { useCallback } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generatePdf } from '../services/pdfService';
import { updateOptions, resetError } from '../store/slices/pdfSlice';

/**
 * Custom hook for PDF export functionality
 * @returns {Object} PDF export state and functions
 */
const usePdfExport = () => {
  const dispatch = useDispatch();
  const { isGenerating, progress, error, options } = useSelector((state) => state.pdf);
  const profileData = useSelector((state) => state.profile);
  
  // Generate and download the PDF
  const exportPdf = useCallback(async () => {
    try {
      // Ensure the page is in a clean state
      window.scrollTo(0, 0);
      
      // Remove any selection that might be active
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      
      // Make sure layout is properly rendered before proceeding
      // This ensures all DOM elements are properly positioned
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Force a layout pass to ensure elements are properly positioned
      document.body.getBoundingClientRect();
      
      // Ensure all elements are loaded before PDF generation
      await new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      });
      
      // Store Redux state in a global variable to make it accessible to the PDF generation service
      if (window) {
        window.__REDUX_STATE__ = profileData;
      }
      
      // Configure PDF options with improved layout settings
      const updatedOptions = {
        ...options,
        filename: options.filename || 'camilo-echeverri-cv.pdf',
        ensureProperLayout: true,
        layoutTimeout: 500, // Increased timeout for reliable layout rendering
        twoColumnLayout: true, // Enable two-column layout
        spacing: {
          compact: true,           // Enable compact spacing
          sideBySideGap: 15,       // Gap between left and right sections
          itemSpacing: 10,         // Compact spacing between items
          verticalSpacing: 12      // Reduced vertical spacing
        },
        layout: {
          profileSide: 'left',     // Profile on left
          contactSide: 'right',    // Contact on right
          profileWidth: '60%',     // Profile takes 60% width
          contactWidth: '40%',     // Contact takes 40% width
        },
        scale: 2,                  // Higher scale for better quality
        quality: 0.95,             // High quality output
        margin: {
          top: 5,                  // Top margin in mm
          right: 5,                // Right margin in mm
          bottom: 5,               // Bottom margin in mm
          left: 5                  // Left margin in mm
        },
        // Include contact specific settings - ensure ALL contact types are included
        contact: {
          includeEmail: true,
          includePhone: true,
          includeLocation: true,
          includeLinkedin: true,
          includeTwitter: true,
          includeGithub: true,
          includeWebsite: true,
          includeSkype: true,
          includeAllContactTypes: true, // Ensure we don't filter any contact types
          // Provide fallback values directly from Redux store
          fallbackData: {
            email: profileData?.personalInfo?.contact?.email || '',
            phone: profileData?.personalInfo?.contact?.phone || '',
            location: profileData?.personalInfo?.contact?.location || '',
            linkedin: profileData?.personalInfo?.contact?.linkedin || '',
            twitter: profileData?.personalInfo?.contact?.twitter || '',
            github: profileData?.personalInfo?.contact?.github || '',
            website: profileData?.personalInfo?.contact?.website || '',
            skype: profileData?.personalInfo?.contact?.skype || ''
          }
        }
      };
      
      // Update options in store
      dispatch(updateOptions(updatedOptions));
      
      // Clear any previous errors
      dispatch(resetError());
      
      // Generate the PDF with enhanced layout options
      const success = await generatePdf(updatedOptions);
      
      if (!success) {
        console.error('PDF generation failed');
      }
      
      // Clean up global state reference
      if (window && window.__REDUX_STATE__) {
        delete window.__REDUX_STATE__;
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      
      // Clean up global state reference even in case of error
      if (window && window.__REDUX_STATE__) {
        delete window.__REDUX_STATE__;
      }
    }
  }, [dispatch, options, profileData]);
  
  // Set PDF export options
  const setOptions = useCallback((newOptions) => {
    dispatch(updateOptions({
      ...options,
      ...newOptions,
      // Always ensure these key layout settings are preserved
      twoColumnLayout: true,
      layout: {
        ...(options.layout || {}),
        ...(newOptions.layout || {}),
        profileSide: 'left',
        contactSide: 'right'
      },
      // Preserve contact settings - ensure ALL contact types are included
      contact: {
        ...(options.contact || {}),
        ...(newOptions.contact || {}),
        includeEmail: true,
        includePhone: true,
        includeLocation: true,
        includeLinkedin: true,
        includeTwitter: true,
        includeGithub: true,
        includeWebsite: true,
        includeSkype: true,
        includeAllContactTypes: true
      }
    }));
  }, [dispatch, options]);
  
  // Clear any PDF export errors
  const clearError = useCallback(() => {
    dispatch(resetError());
  }, [dispatch]);
  
  // Set the content width percentage for PDF export
  const setContentWidthPercentage = useCallback((percentage) => {
    dispatch(updateOptions({ 
      ...options,
      contentWidthPercentage: percentage 
    }));
  }, [dispatch, options]);
  
  return {
    isGenerating,
    progress,
    error,
    options,
    exportPdf,
    setOptions,
    clearError,
    setContentWidthPercentage
  };
};

export default usePdfExport; 