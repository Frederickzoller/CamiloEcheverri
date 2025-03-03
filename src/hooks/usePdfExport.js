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
      // Scroll to top to ensure the entire page is rendered properly
      window.scrollTo(0, 0);
      
      // Small delay to ensure the page is fully rendered after scrolling
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
  };
};

export default usePdfExport; 