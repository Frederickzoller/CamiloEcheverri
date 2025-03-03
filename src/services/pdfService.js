import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { store } from '../store';
import { 
  startGenerating, 
  updateProgress, 
  finishGenerating, 
  setError 
} from '../store/slices/pdfSlice';

// Helper function to create static representations of Three.js animations
const prepareAnimationsForPdf = async () => {
  // Find all canvas elements used by Three.js
  const canvasElements = document.querySelectorAll('.three-canvas');
  
  // Replace each canvas with a static image
  for (const canvas of canvasElements) {
    try {
      // Create a static image from the canvas
      const image = await html2canvas(canvas);
      
      // Store the original canvas
      const originalCanvas = canvas.cloneNode(true);
      originalCanvas.style.display = 'none';
      canvas.parentNode.appendChild(originalCanvas);
      
      // Replace the canvas with the image
      const img = document.createElement('img');
      img.src = image.toDataURL('image/png');
      img.className = 'three-static-image';
      img.style.width = '100%';
      img.style.height = 'auto';
      canvas.parentNode.insertBefore(img, canvas);
      canvas.style.display = 'none';
    } catch (error) {
      console.error('Error creating static image for animation:', error);
    }
  }
};

// Helper function to restore animations after PDF generation
const restoreAnimations = () => {
  // Find all static images
  const staticImages = document.querySelectorAll('.three-static-image');
  
  // Remove each static image and restore the original canvas
  for (const img of staticImages) {
    const canvas = img.nextSibling;
    const originalCanvas = canvas.nextSibling;
    
    // Restore the original canvas
    if (canvas && originalCanvas) {
      canvas.style.display = 'block';
      originalCanvas.remove();
    }
    
    // Remove the static image
    img.remove();
  }
};

// Main PDF generation function
export const generatePdf = async () => {
  try {
    // Start the PDF generation process
    store.dispatch(startGenerating());
    
    // Get PDF options from the store
    const { options } = store.getState().pdf;
    
    // Prepare the DOM for PDF generation
    await prepareAnimationsForPdf();
    store.dispatch(updateProgress(20));
    
    // Get the CV container element
    const element = document.getElementById('cv-container');
    if (!element) {
      throw new Error('CV container element not found');
    }
    
    // Calculate dimensions
    const { width, height } = element.getBoundingClientRect();
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scale ratio to fit entire content on one page
    // We need to consider both width and height constraints
    const scaleWidth = pdfWidth / width;
    const scaleHeight = pdfHeight / height;
    
    // Use the smaller scale to ensure content fits within page boundaries
    const scale = Math.min(scaleWidth, scaleHeight) * 0.95; // 0.95 to add a small margin
    
    store.dispatch(updateProgress(40));
    
    // Generate canvas from the element with appropriate scale
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    store.dispatch(updateProgress(70));
    
    // Calculate dimensions for the image in the PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * scale) / 2; // Divide by 2 to account for the scale:2 in html2canvas
    
    // Add the canvas to the PDF - centered on the page
    const imgData = canvas.toDataURL('image/png');
    const xPosition = 0;
    const yPosition = (pdfHeight - imgHeight) / 2; // Center vertically
    
    pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
    
    store.dispatch(updateProgress(90));
    
    // Save the PDF
    pdf.save(options.filename);
    
    // Restore animations
    restoreAnimations();
    
    // Finish the PDF generation process
    store.dispatch(finishGenerating());
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    store.dispatch(setError(error.message));
    
    // Restore animations even if there was an error
    restoreAnimations();
    
    return false;
  }
}; 