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
      await new Promise((resolve) => setTimeout(resolve, 150));
      
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
      
      // Configure PDF options with improved spacing settings
      const updatedOptions = {
        ...options,
        ensureProperLayout: true,
        layoutTimeout: 400, // Increase timeout to ensure layout renders properly
        spacing: {
          compact: true,           // Enable compact spacing
          sideBySideGap: 10,       // Reduced gap between left and right sections
          itemSpacing: 10,         // Compact spacing between items
          verticalSpacing: 12      // Reduced vertical spacing
        },
        equalColumns: true         // Ensure equal column widths (50/50)
      };
      
      // Update options in store
      dispatch(updateOptions(updatedOptions));
      
      // Clear any previous errors
      dispatch(resetError());
      
      // Generate the PDF with enhanced spacing options
      const success = await generatePdf(updatedOptions);
      
      if (!success) {
        console.error('PDF generation failed');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }, [dispatch, options]);
  
  // Set PDF export options
  const setOptions = useCallback((newOptions) => {
    dispatch(updateOptions(newOptions));
  }, [dispatch]);
  
  // Clear any PDF export errors
  const clearError = useCallback(() => {
    dispatch(resetError());
  }, [dispatch]);
  
  // Set the content width percentage for PDF export
  const setContentWidthPercentage = useCallback((percentage) => {
    dispatch(updateOptions({ contentWidthPercentage: percentage }));
  }, [dispatch]);
  
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