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
      
      // Longer delay to ensure the page is fully rendered and all styles are applied
      await new Promise(resolve => setTimeout(resolve, 1200)); // Increased to 1200ms for better rendering
      
      // Generate the PDF
      await generatePdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, []);
  
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