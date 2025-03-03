import { useCallback } from 'react';
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
      
      // Small delay to ensure the page is fully rendered and all styles are applied
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Generate the PDF
      const result = await generatePdf();
      return result;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return false;
    }
  }, []);
  
  // Update PDF export options
  const setOptions = useCallback((newOptions) => {
    dispatch(updateOptions(newOptions));
  }, [dispatch]);
  
  // Clear any PDF generation errors
  const clearError = useCallback(() => {
    dispatch(resetError());
  }, [dispatch]);
  
  // Set content width percentage for PDF
  const setContentWidthPercentage = useCallback((percentage) => {
    if (percentage >= 0.5 && percentage <= 0.99) {
      dispatch(updateOptions({ contentWidthPercentage: percentage }));
    }
  }, [dispatch]);
  
  return {
    // State
    isGenerating,
    progress,
    error,
    options,
    
    // Functions
    exportPdf,
    setOptions,
    clearError,
    setContentWidthPercentage,
  };
};

export default usePdfExport; 