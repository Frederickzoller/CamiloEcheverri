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

// Helper function to hide the PDF loading overlay
const hidePdfLoadingOverlay = () => {
  const overlays = document.querySelectorAll('.pdf-loading-overlay');
  const originalStyles = [];
  
  overlays.forEach(overlay => {
    originalStyles.push({
      element: overlay,
      display: overlay.style.display,
      visibility: overlay.style.visibility,
      opacity: overlay.style.opacity,
      zIndex: overlay.style.zIndex
    });
    
    // Hide the overlay
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '-1';
  });
  
  return originalStyles;
};

// Helper function to restore the PDF loading overlay
const restorePdfLoadingOverlay = (originalStyles) => {
  originalStyles.forEach(style => {
    style.element.style.display = style.display;
    style.element.style.visibility = style.visibility;
    style.element.style.opacity = style.opacity;
    style.element.style.zIndex = style.zIndex;
  });
};

// Helper function to reorganize layout for PDF export
const reorganizeLayoutForPdf = () => {
  // Store original layout for restoration
  const originalLayout = {
    heroSection: {},
    heroContainer: {},
    heroContent: {},
    heroTop: {},
    heroTextContent: {},
    summaryParagraph: {},
    contactButton: {},
    metricsSection: {},
    threeCanvas: {}
  };

  // Get elements
  const heroSection = document.getElementById('hero');
  const heroContainer = heroSection ? heroSection.querySelector('.container') : null;
  const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
  const heroTop = heroContent ? heroContent.querySelector('.hero-top') : null;
  const heroTextContent = heroTop ? heroTop.querySelector('.hero-text-content') : null;
  const summaryParagraph = heroContent ? heroContent.querySelector('.hero-summary') : null;
  const contactButton = heroContent ? heroContent.querySelector('button') : null;
  const metricsSection = document.getElementById('metrics');
  const threeCanvas = document.querySelector('.three-canvas') || document.querySelector('.hero-animation');

  // Store original styles for restoration
  if (heroSection) {
    originalLayout.heroSection = {
      display: heroSection.style.display,
      position: heroSection.style.position
    };
  }

  if (heroContainer) {
    originalLayout.heroContainer = {
      display: heroContainer.style.display,
      position: heroContainer.style.position,
      gridTemplateColumns: heroContainer.style.gridTemplateColumns
    };
  }

  if (heroContent) {
    originalLayout.heroContent = {
      display: heroContent.style.display,
      position: heroContent.style.position,
      width: heroContent.style.width,
      gridColumn: heroContent.style.gridColumn
    };
  }

  if (summaryParagraph) {
    originalLayout.summaryParagraph = {
      marginTop: summaryParagraph.style.marginTop,
      gridColumn: summaryParagraph.style.gridColumn
    };
  }

  if (contactButton) {
    originalLayout.contactButton = {
      display: contactButton.style.display,
      gridColumn: contactButton.style.gridColumn
    };
  }

  if (metricsSection) {
    originalLayout.metricsSection = {
      display: metricsSection.style.display,
      position: metricsSection.style.position
    };
  }

  if (threeCanvas) {
    originalLayout.threeCanvas = {
      display: threeCanvas.style.display,
      position: threeCanvas.style.position
    };
    
    // Hide the Three.js canvas/animation
    threeCanvas.style.display = 'none';
  }

  // Set up grid layout for the hero section
  if (heroContainer) {
    // Convert container to grid
    heroContainer.style.display = 'grid';
    heroContainer.style.gridTemplateColumns = '1fr 1fr'; // Two equal columns
    heroContainer.style.gridGap = '2rem';
    
    // Position hero content in the left column
    if (heroContent) {
      heroContent.style.gridColumn = '1 / 2';
      heroContent.style.width = '100%';
    }
    
    if (summaryParagraph) {
      summaryParagraph.style.gridColumn = '1 / 2';
    }
    
    if (contactButton) {
      contactButton.style.gridColumn = '1 / 2';
    }
    
    // Create metrics container for the right column
    if (metricsSection) {
      const metricsContainer = document.createElement('div');
      metricsContainer.classList.add('metrics-container-clone');
      metricsContainer.style.gridColumn = '2 / 3';
      metricsContainer.style.alignSelf = 'start';
      metricsContainer.style.justifySelf = 'start';
      metricsContainer.style.padding = '1rem';
      metricsContainer.style.width = '100%';
      
      // Clone metrics content
      const metricsHeader = metricsSection.querySelector('.section-header');
      const metricsGrid = metricsSection.querySelector('.metrics-grid');
      
      if (metricsHeader && metricsGrid) {
        const metricsHeaderClone = metricsHeader.cloneNode(true);
        const metricsGridClone = metricsGrid.cloneNode(true);
        
        // Style header
        metricsHeaderClone.style.textAlign = 'center';
        metricsHeaderClone.style.marginBottom = '1rem';
        
        // Style grid
        metricsGridClone.style.display = 'grid';
        metricsGridClone.style.gridTemplateColumns = 'repeat(2, 1fr)';
        metricsGridClone.style.gap = '1rem';
        
        // Add content to container
        metricsContainer.appendChild(metricsHeaderClone);
        metricsContainer.appendChild(metricsGridClone);
        
        // Add container to hero section
        heroContainer.appendChild(metricsContainer);
        
        // Hide original metrics section
        metricsSection.style.display = 'none';
      }
    }
  }
  
  return originalLayout;
};

// Helper function to restore original layout
const restoreOriginalLayout = (originalLayout) => {
  // Get elements
  const heroSection = document.getElementById('hero');
  const heroContainer = heroSection ? heroSection.querySelector('.container') : null;
  const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
  const heroTop = heroContent ? heroContent.querySelector('.hero-top') : null;
  const summaryParagraph = heroContent ? heroContent.querySelector('.hero-summary') : null;
  const contactButton = heroContent ? heroSection.querySelector('button') : null;
  const metricsSection = document.getElementById('metrics');
  const threeCanvas = document.querySelector('.three-canvas') || document.querySelector('.hero-animation');

  // Restore hero section
  if (heroSection && originalLayout.heroSection) {
    heroSection.style.display = originalLayout.heroSection.display;
    heroSection.style.position = originalLayout.heroSection.position;
  }

  // Restore hero container
  if (heroContainer && originalLayout.heroContainer) {
    heroContainer.style.display = originalLayout.heroContainer.display;
    heroContainer.style.position = originalLayout.heroContainer.position;
    heroContainer.style.gridTemplateColumns = originalLayout.heroContainer.gridTemplateColumns;
  }

  // Restore hero content
  if (heroContent && originalLayout.heroContent) {
    heroContent.style.display = originalLayout.heroContent.display;
    heroContent.style.position = originalLayout.heroContent.position;
    heroContent.style.width = originalLayout.heroContent.width;
    heroContent.style.gridColumn = originalLayout.heroContent.gridColumn;
  }

  // Restore summary paragraph
  if (summaryParagraph && originalLayout.summaryParagraph) {
    summaryParagraph.style.marginTop = originalLayout.summaryParagraph.marginTop;
    summaryParagraph.style.gridColumn = originalLayout.summaryParagraph.gridColumn;
  }

  // Restore contact button
  if (contactButton && originalLayout.contactButton) {
    contactButton.style.display = originalLayout.contactButton.display;
    contactButton.style.gridColumn = originalLayout.contactButton.gridColumn;
  }

  // Restore metrics section
  if (metricsSection && originalLayout.metricsSection) {
    metricsSection.style.display = originalLayout.metricsSection.display;
    metricsSection.style.position = originalLayout.metricsSection.position;
  }

  // Restore three.js canvas/animation
  if (threeCanvas && originalLayout.threeCanvas) {
    threeCanvas.style.display = originalLayout.threeCanvas.display;
    threeCanvas.style.position = originalLayout.threeCanvas.position;
  }

  // Remove the cloned metrics container
  const metricsContainerClone = document.querySelector('.metrics-container-clone');
  if (metricsContainerClone) {
    metricsContainerClone.remove();
  }
};

// Helper function to optimize CV content for one-page PDF
const optimizeCVForPDF = () => {
  // Store original styles to restore later
  const originalStyles = {
    containers: [],
    sections: {},
    elements: {},
    body: {
      fontSize: document.body.style.fontSize,
    },
    header: null,
    footer: null,
    profileImage: null
  };
  
  // Temporarily increase base font size for better readability in PDF
  if (document.body.style.fontSize) {
    originalStyles.body.fontSize = document.body.style.fontSize;
  }
  document.body.style.fontSize = '20px'; // Increased to 20px for maximum readability
  
  // Optimize profile image for PDF
  const profileImage = document.querySelector('.profile-image-container');
  if (profileImage) {
    originalStyles.profileImage = {
      width: profileImage.style.width,
      height: profileImage.style.height,
      marginRight: profileImage.style.marginRight,
      borderWidth: profileImage.style.borderWidth
    };
    
    // Make profile image slightly smaller for PDF but still larger than before
    profileImage.style.width = '130px'; // Increased from 100px to 130px
    profileImage.style.height = '130px'; // Increased from 100px to 130px
    profileImage.style.marginRight = '1.5rem';
    profileImage.style.borderWidth = '1px';
    
    // Also ensure the image inside maintains its positioning
    const profileImg = profileImage.querySelector('img');
    if (profileImg) {
      originalStyles.profileImg = {
        objectPosition: profileImg.style.objectPosition
      };
      
      // Ensure the object-position is maintained
      profileImg.style.objectPosition = '60% center';
    }
  }
  
  // Hide header and footer for PDF generation
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  if (header) {
    originalStyles.header = {
      display: header.style.display
    };
    header.style.display = 'none';
  }
  
  if (footer) {
    originalStyles.footer = {
      display: footer.style.display
    };
    footer.style.display = 'none';
  }
  
  // Get the CV container
  const cvContainer = document.getElementById('cv-container');
  if (!cvContainer) return originalStyles;
  
  // Store original container styles
  originalStyles.cvContainer = {
    padding: cvContainer.style.padding,
    margin: cvContainer.style.margin,
    width: cvContainer.style.width,
    maxWidth: cvContainer.style.maxWidth,
    fontSize: cvContainer.style.fontSize
  };
  
  // Optimize container for balanced layout - set to 100% width for absolute maximum page utilization
  cvContainer.style.padding = '0';
  cvContainer.style.margin = '0 auto';
  cvContainer.style.width = '100%';  // Increased to 100% for absolute maximum page utilization
  cvContainer.style.maxWidth = 'none'; // Remove max-width constraint
  
  // Optimize all container divs for balanced layout
  const containerDivs = document.querySelectorAll('.container');
  containerDivs.forEach((container, index) => {
    originalStyles.containers.push({
      width: container.style.width,
      maxWidth: container.style.maxWidth,
      padding: container.style.padding,
      margin: container.style.margin
    });
    
    // Set container to use balanced width
    container.style.width = '100%';
    container.style.maxWidth = '100%';
    container.style.padding = '0 2px'; // Minimal padding
    container.style.margin = '0 auto';
  });
  
  // Optimize sections spacing
  const sections = ['hero', 'metrics', 'experience', 'skills', 'education', 'contact'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Store original section styles
      originalStyles.sections[sectionId] = {
        padding: section.style.padding,
        margin: section.style.margin,
        width: section.style.width,
        maxWidth: section.style.maxWidth
      };
      
      // Optimize section spacing and width
      section.style.padding = sectionId === 'hero' ? '0.4rem 0 0.3rem' : '0.3rem 0';
      section.style.margin = '0 auto';
      section.style.width = '100%';
      section.style.maxWidth = '100%';
    }
  });
  
  // Extra optimization for hero section to reduce its height
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    originalStyles.heroHeightStyles = {
      minHeight: heroSection.style.minHeight,
      height: heroSection.style.height,
    };
    
    // Reduce hero section height
    heroSection.style.minHeight = 'auto';
    heroSection.style.height = 'auto';
    
    // Find and optimize hero content padding
    const heroContent = heroSection.querySelector('div div');
    if (heroContent) {
      originalStyles.heroContent = {
        padding: heroContent.style.padding,
        margin: heroContent.style.margin,
      };
      
      heroContent.style.padding = '0';
      heroContent.style.margin = '0';
    }
  }
  
  // Optimize section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header, index) => {
    // Store original header styles
    originalStyles.elements[`header-${index}`] = {
      marginBottom: header.style.marginBottom,
      width: header.style.width,
      maxWidth: header.style.maxWidth
    };
    
    // Reduce header bottom margin and set proper width
    header.style.marginBottom = '0.15rem';
    header.style.width = '100%';
    header.style.maxWidth = '100%';
  });
  
  // Optimize experience items
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach((item, index) => {
    // Store original item styles
    originalStyles.elements[`exp-${index}`] = {
      marginBottom: item.style.marginBottom,
      padding: item.style.padding,
      width: item.style.width,
      maxWidth: item.style.maxWidth
    };
    
    // Reduce item spacing and set balanced width
    item.style.marginBottom = '0.3rem';
    item.style.padding = '0.4rem';
    item.style.width = '100%';
    item.style.maxWidth = '100%';
  });
  
  // Optimize education items
  const educationItems = document.querySelectorAll('.education-item');
  educationItems.forEach((item, index) => {
    // Store original item styles
    originalStyles.elements[`edu-${index}`] = {
      marginBottom: item.style.marginBottom,
      padding: item.style.padding,
    };
    
    // Reduce item spacing
    item.style.marginBottom = '0.3rem';
    item.style.padding = '0.4rem';
  });
  
  // Optimize skill items
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    // Store original item styles
    originalStyles.elements[`skill-${index}`] = {
      marginBottom: item.style.marginBottom,
    };
    
    // Reduce item spacing
    item.style.marginBottom = '0.2rem';
  });
  
  // Optimize grids
  const grids = document.querySelectorAll('.metrics-grid, .skills-grid');
  grids.forEach((grid, index) => {
    // Store original grid styles
    originalStyles.elements[`grid-${index}`] = {
      gap: grid.style.gap,
      width: grid.style.width,
      maxWidth: grid.style.maxWidth,
      marginTop: grid.style.marginTop,
    };
    
    // Optimize grid spacing and width
    grid.style.gap = '0.4rem';
    grid.style.width = '100%';
    grid.style.maxWidth = '100%';
    grid.style.marginTop = '0.5rem';
  });
  
  // Optimize typography
  const typographies = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
  typographies.forEach((text, index) => {
    if (!originalStyles.elements.typography) {
      originalStyles.elements.typography = [];
    }
    
    originalStyles.elements.typography.push({
      marginBottom: text.style.marginBottom,
      fontSize: text.style.fontSize,
    });
    
    // Reduce margin for better spacing in PDF
    if (text.style.marginBottom) {
      text.style.marginBottom = '0.1rem';
    }
  });
  
  return originalStyles;
};

// Helper function to restore original styles
const restoreOriginalStyles = (originalStyles) => {
  // Restore body font size
  if (originalStyles.body && originalStyles.body.fontSize) {
    document.body.style.fontSize = originalStyles.body.fontSize;
  }
  
  // Restore profile image styles
  const profileImage = document.querySelector('.profile-image-container');
  if (profileImage && originalStyles.profileImage) {
    profileImage.style.width = originalStyles.profileImage.width;
    profileImage.style.height = originalStyles.profileImage.height;
    profileImage.style.marginRight = originalStyles.profileImage.marginRight;
    profileImage.style.borderWidth = originalStyles.profileImage.borderWidth;
    
    // Also restore the image positioning
    const profileImg = profileImage.querySelector('img');
    if (profileImg && originalStyles.profileImg) {
      profileImg.style.objectPosition = originalStyles.profileImg.objectPosition;
    }
  }
  
  // Restore header and footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  if (header && originalStyles.header) {
    header.style.display = originalStyles.header.display;
  }
  
  if (footer && originalStyles.footer) {
    footer.style.display = originalStyles.footer.display;
  }
  
  // Restore container styles
  const cvContainer = document.getElementById('cv-container');
  if (cvContainer && originalStyles.cvContainer) {
    cvContainer.style.padding = originalStyles.cvContainer.padding;
    cvContainer.style.margin = originalStyles.cvContainer.margin;
    cvContainer.style.width = originalStyles.cvContainer.width;
    cvContainer.style.maxWidth = originalStyles.cvContainer.maxWidth;
    cvContainer.style.fontSize = originalStyles.cvContainer.fontSize;
  }
  
  // Restore container divs
  const containerDivs = document.querySelectorAll('.container');
  containerDivs.forEach((container, index) => {
    if (originalStyles.containers[index]) {
      container.style.width = originalStyles.containers[index].width;
      container.style.maxWidth = originalStyles.containers[index].maxWidth;
      container.style.padding = originalStyles.containers[index].padding;
      container.style.margin = originalStyles.containers[index].margin;
    }
  });
  
  // Restore section styles
  const sections = ['hero', 'metrics', 'experience', 'skills', 'education', 'contact'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section && originalStyles.sections[sectionId]) {
      section.style.padding = originalStyles.sections[sectionId].padding;
      section.style.margin = originalStyles.sections[sectionId].margin;
      section.style.width = originalStyles.sections[sectionId].width;
      section.style.maxWidth = originalStyles.sections[sectionId].maxWidth;
    }
  });
  
  // Restore hero section height
  const heroSection = document.getElementById('hero');
  if (heroSection && originalStyles.heroHeightStyles) {
    heroSection.style.minHeight = originalStyles.heroHeightStyles.minHeight;
    heroSection.style.height = originalStyles.heroHeightStyles.height;
    
    // Restore hero content padding
    const heroContent = heroSection.querySelector('div div');
    if (heroContent && originalStyles.heroContent) {
      heroContent.style.padding = originalStyles.heroContent.padding;
      heroContent.style.margin = originalStyles.heroContent.margin;
    }
  }
  
  // Restore section header styles
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header, index) => {
    if (originalStyles.elements[`header-${index}`]) {
      header.style.marginBottom = originalStyles.elements[`header-${index}`].marginBottom;
      header.style.width = originalStyles.elements[`header-${index}`].width;
      header.style.maxWidth = originalStyles.elements[`header-${index}`].maxWidth;
    }
  });
  
  // Restore experience item styles
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach((item, index) => {
    if (originalStyles.elements[`exp-${index}`]) {
      item.style.marginBottom = originalStyles.elements[`exp-${index}`].marginBottom;
      item.style.padding = originalStyles.elements[`exp-${index}`].padding;
      item.style.width = originalStyles.elements[`exp-${index}`].width;
      item.style.maxWidth = originalStyles.elements[`exp-${index}`].maxWidth;
    }
  });
  
  // Restore education item styles
  const educationItems = document.querySelectorAll('.education-item');
  educationItems.forEach((item, index) => {
    if (originalStyles.elements[`edu-${index}`]) {
      item.style.marginBottom = originalStyles.elements[`edu-${index}`].marginBottom;
      item.style.padding = originalStyles.elements[`edu-${index}`].padding;
    }
  });
  
  // Restore skill item styles
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    if (originalStyles.elements[`skill-${index}`]) {
      item.style.marginBottom = originalStyles.elements[`skill-${index}`].marginBottom;
    }
  });
  
  // Restore grid styles
  const grids = document.querySelectorAll('.metrics-grid, .skills-grid');
  grids.forEach((grid, index) => {
    if (originalStyles.elements[`grid-${index}`]) {
      grid.style.gap = originalStyles.elements[`grid-${index}`].gap;
      grid.style.width = originalStyles.elements[`grid-${index}`].width;
      grid.style.maxWidth = originalStyles.elements[`grid-${index}`].maxWidth;
      grid.style.marginTop = originalStyles.elements[`grid-${index}`].marginTop;
    }
  });
  
  // Restore typography styles
  if (originalStyles.elements.typography) {
    const typographies = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
    typographies.forEach((text, index) => {
      if (originalStyles.elements.typography[index]) {
        if (originalStyles.elements.typography[index].marginBottom) {
          text.style.marginBottom = originalStyles.elements.typography[index].marginBottom;
        }
        if (originalStyles.elements.typography[index].fontSize) {
          text.style.fontSize = originalStyles.elements.typography[index].fontSize;
        }
      }
    });
  }
};

// Helper function to swap Key Achievements and Contact sections for PDF
const swapSectionsForPdf = (options = {}) => {
  console.log('Running swapSectionsForPdf with layout handling...');
  
  const originalPositions = {
    heroAnimation: null,
    contact: null,
    keyAchievements: null,
    heroLayout: null,
    documentAdditions: []
  };

  // Ensure options are defined
  options = options || {};
  const layoutTimeout = options.layoutTimeout || 300;
  
  // Get the hero section and its animation
  const heroSection = document.getElementById('hero');
  let heroAnimation = null;
  
  if (heroSection) {
    // Find the three.js animation element in hero section
    heroAnimation = heroSection.querySelector('.hero-animation');
  } else {
    console.warn('Hero section not found');
    return originalPositions;
  }
  
  // Find contact section and key achievements by their heading text
  const allSections = document.querySelectorAll('.section-header');
  let contactSection = null;
  let keyAchievementsSection = null;
  let keyAchievementsContainer = null;
  
  allSections.forEach(section => {
    const heading = section.querySelector('h1');
    if (heading && heading.textContent === 'Contact Information') {
      contactSection = section.closest('.container');
    } else if (heading && heading.textContent === 'Key Achievements') {
      keyAchievementsSection = section;
      keyAchievementsContainer = section.closest('.container');
    }
  });
  
  if (!contactSection) {
    console.warn('Contact section not found');
    return originalPositions;
  }

  // IMPORTANT: Force a layout computation to ensure elements are positioned
  document.body.getBoundingClientRect();
  
  // Store the original layout before making changes
  originalPositions.heroLayout = {
    width: heroSection.style.width,
    display: heroSection.style.display,
    position: heroSection.style.position
  };
  
  // Create a dedicated style element for our PDF layout
  const styleElement = document.createElement('style');
  styleElement.id = 'pdf-export-style-overrides';
  styleElement.innerHTML = `
    /* Core layout fixes */
    #hero {
      position: relative !important;
      display: flex !important;
      width: 100% !important;
      min-height: auto !important;
      margin-bottom: 2rem !important;
    }
    #hero .container {
      display: flex !important;
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      justify-content: space-between !important;
    }
    .pdf-hero-content {
      width: auto !important;
      flex: 1 1 auto !important;
      padding-right: 15px !important;
      box-sizing: border-box !important;
      max-width: 60% !important;
    }
    .pdf-contact-wrapper {
      width: 50% !important;
      flex: 0 0 50% !important;
      padding-left: 15px !important;
      box-sizing: border-box !important;
      position: relative !important;
      border-left: 1px solid rgba(0,0,0,0.1) !important;
    }
    .pdf-hero-content img {
      width: 130px !important;
      height: 130px !important;
    }
    .pdf-hero-content .hero-top {
      margin-bottom: 1.2rem !important;
    }
    .pdf-contact-wrapper h1, .pdf-contact-wrapper h2 {
      font-size: 1.5rem !important;
      margin-bottom: 8px !important;
      border-bottom: 1px solid #eee !important;
      padding-bottom: 8px !important;
      text-align: center !important;
    }
    .pdf-contact-wrapper p {
      font-size: 0.9rem !important;
      margin-bottom: 15px !important;
      text-align: center !important;
    }
    .pdf-contact-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      grid-gap: 10px !important;
      width: 100% !important;
    }
    .pdf-contact-item {
      display: flex !important;
      align-items: flex-start !important;
      width: 100% !important;
    }
    .pdf-contact-icon {
      margin-right: 6px !important;
      flex-shrink: 0 !important;
    }
    .pdf-contact-label {
      font-size: 0.75rem !important;
      color: var(--color-text-light) !important;
      margin-bottom: 2px !important;
    }
    /* Critical override to prevent empty space */
    @media print {
      .pdf-hero-content, .pdf-contact-wrapper {
        display: block !important;
      }
      .pdf-hero-content {
        width: auto !important;
        flex: 1 1 auto !important;
        max-width: 60% !important;
      }
      #hero .container {
        justify-content: space-between !important;
        align-items: flex-start !important;
        width: 100% !important;
      }
      .pdf-contact-grid {
        display: grid !important;
        width: 100% !important;
      }
      .pdf-contact-item {
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(styleElement);
  originalPositions.documentAdditions.push(styleElement);

  // Handle key achievements section - remove from original position
  if (keyAchievementsContainer) {
    originalPositions.keyAchievements = {
      element: keyAchievementsContainer,
      parentNode: keyAchievementsContainer.parentNode,
      nextSibling: keyAchievementsContainer.nextSibling
    };
    
    // Clone and move to end
    const keyAchievementsClone = keyAchievementsContainer.cloneNode(true);
    keyAchievementsContainer.parentNode.removeChild(keyAchievementsContainer);
    originalPositions.keyAchievements.removed = true;
    
    const mainContent = document.querySelector('main') || document.body;
    mainContent.appendChild(keyAchievementsClone);
    originalPositions.keyAchievementsClone = keyAchievementsClone;
  }
  
  // Hide the hero animation
  if (heroAnimation) {
    originalPositions.heroAnimation = {
      element: heroAnimation,
      display: heroAnimation.style.display
    };
    heroAnimation.style.display = 'none';
  }
  
  // Store and hide original contact info
  originalPositions.contact = {
    element: contactSection,
    parentNode: contactSection.parentNode,
    nextSibling: contactSection.nextSibling,
    display: contactSection.style.display
  };
  contactSection.style.display = 'none';
  
  // Get the hero container
  const heroContainer = heroSection.querySelector('.container');
  if (heroContainer) {
    // Store original state
    originalPositions.heroContainer = {
      element: heroContainer,
      innerHTML: heroContainer.innerHTML
    };
    
    // Extract contact information data
    const contactData = {
      title: '',
      subtitle: '',
      items: []
    };
    
    // Get header information
    const contactHeader = contactSection.querySelector('.section-header');
    if (contactHeader) {
      const title = contactHeader.querySelector('h1');
      const subtitle = contactHeader.querySelector('p');
      if (title) contactData.title = title.textContent;
      if (subtitle) contactData.subtitle = subtitle.textContent;
    }
    
    // Get contact items
    const contactItems = contactSection.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      const icon = item.querySelector('.sc-sediK');
      const label = item.querySelector('.sc-haUlXw');
      const value = item.querySelector('.sc-gIivzS');
      
      if (label && value) {
        contactData.items.push({
          icon: icon ? icon.innerHTML : '',
          label: label.textContent,
          value: value.textContent
        });
      }
    });
    
    // CRITICAL FIX: Use direct HTML injection to ensure proper layout
    const heroContentDiv = document.createElement('div');
    heroContentDiv.className = 'pdf-hero-content';
    
    // Get original hero content (except animation)
    const originalHeroContent = heroContainer.querySelector('.sc-gpHbIA');
    if (originalHeroContent) {
      const clonedContent = originalHeroContent.cloneNode(true);
      const animationInClone = clonedContent.querySelector('.hero-animation');
      if (animationInClone) {
        animationInClone.remove();
      }
      heroContentDiv.appendChild(clonedContent);
    }
    
    // Create contact section wrapper
    const contactWrapper = document.createElement('div');
    contactWrapper.className = 'pdf-contact-wrapper';
    
    // Build contact content with precise structure
    contactWrapper.innerHTML = `
      <h1>${contactData.title}</h1>
      <p>${contactData.subtitle}</p>
      <div class="pdf-contact-grid">
        ${contactData.items.map(item => `
          <div class="pdf-contact-item">
            <div class="pdf-contact-icon">${item.icon}</div>
            <div>
              <div class="pdf-contact-label">${item.label}</div>
              <div>${item.value}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Clear container and add our new layout
    heroContainer.innerHTML = '';
    heroContainer.appendChild(heroContentDiv);
    heroContainer.appendChild(contactWrapper);
    
    // CRITICAL FIX: Add a validation/correction timeout to ensure proper rendering
    const validationTimeout = setTimeout(() => {
      const contactWrapperCheck = document.querySelector('.pdf-contact-wrapper');
      if (contactWrapperCheck && contactWrapperCheck.offsetWidth < 10) {
        console.log('Fixing contact wrapper visibility...');
        contactWrapperCheck.style.cssText = 'width: 45% !important; display: block !important; visibility: visible !important;';
        
        // Force repaint
        contactWrapperCheck.getBoundingClientRect();
      }
    }, layoutTimeout);
    originalPositions.validationTimeout = validationTimeout;
  }
  
  return originalPositions;
};

// Helper function to restore original section positions
const restoreSectionPositions = (originalPositions) => {
  if (!originalPositions) {
    return;
  }

  // Clear any validation timeout
  if (originalPositions.validationTimeout) {
    clearTimeout(originalPositions.validationTimeout);
  }
  
  // Remove any added style elements
  if (originalPositions.documentAdditions) {
    originalPositions.documentAdditions.forEach(element => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  }

  // Restore hero section animation
  if (originalPositions.heroAnimation && originalPositions.heroAnimation.element) {
    originalPositions.heroAnimation.element.style.display = originalPositions.heroAnimation.display;
  }
  
  // Restore hero layout
  if (originalPositions.heroLayout) {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.style.width = originalPositions.heroLayout.width;
      heroSection.style.display = originalPositions.heroLayout.display;
      heroSection.style.position = originalPositions.heroLayout.position;
    }
  }
  
  // Restore hero container
  if (originalPositions.heroContainer && originalPositions.heroContainer.element) {
    originalPositions.heroContainer.element.innerHTML = originalPositions.heroContainer.innerHTML;
  }
  
  // Restore contact section
  if (originalPositions.contact && originalPositions.contact.element) {
    originalPositions.contact.element.style.display = originalPositions.contact.display;
  }
  
  // Restore key achievements section
  if (originalPositions.keyAchievements && originalPositions.keyAchievements.element && originalPositions.keyAchievements.removed) {
    // Re-insert the original key achievements section at its original position
    if (originalPositions.keyAchievements.nextSibling) {
      originalPositions.keyAchievements.parentNode.insertBefore(
        originalPositions.keyAchievements.element,
        originalPositions.keyAchievements.nextSibling
      );
    } else {
      originalPositions.keyAchievements.parentNode.appendChild(
        originalPositions.keyAchievements.element
      );
    }
  }
  
  // Remove the cloned key achievements that was appended to the bottom
  if (originalPositions.keyAchievementsClone) {
    originalPositions.keyAchievementsClone.remove();
  }
};

// Main PDF generation function
export const generatePdf = async (options = {}) => {
  let originalStyles = {};
  let overlayStyles = [];
  let originalLayout = null;
  let originalSectionPositions = null;
  
  try {
    // Start the PDF generation process
    store.dispatch(startGenerating());
    
    // Prepare the DOM for PDF generation
    await prepareAnimationsForPdf();
    store.dispatch(updateProgress(20));
    
    // Swap sections for PDF - pass the options
    originalSectionPositions = swapSectionsForPdf(options);
    
    // Reorganize layout for PDF
    originalLayout = reorganizeLayoutForPdf();
    
    // Optimize CV layout for PDF
    originalStyles = optimizeCVForPDF();
    
    // Get the CV container element
    const element = document.getElementById('cv-container');
    if (!element) {
      throw new Error('CV container element not found');
    }
    
    // Hide the PDF loading overlay before capturing
    overlayStyles = hidePdfLoadingOverlay();
    
    // Create PDF document with A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // A4 dimensions in mm
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate margins to ensure content occupies approximately 99% of the page width
    const contentWidthPercentage = 0.99;
    const desiredContentWidth = pageWidth * contentWidthPercentage;
    const horizontalMargin = (pageWidth - desiredContentWidth) / 2; // Equal margins on both sides
    const verticalMargin = 2; // Reduced to 2mm to give maximum vertical space
    
    const contentWidth = desiredContentWidth;
    const contentHeight = pageHeight - (verticalMargin * 2);
    
    store.dispatch(updateProgress(40));
    
    // Generate canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      width: element.scrollWidth, // Capture full width
      height: element.scrollHeight,
      windowWidth: element.scrollWidth, // Use actual width
      // Ignore elements with specific classes
      ignoreElements: (element) => {
        return element.classList && 
               (element.classList.contains('pdf-loading-overlay') || 
                element.classList.contains('PdfLoadingOverlay'));
      }
    });
    
    // Restore the PDF loading overlay after capturing
    restorePdfLoadingOverlay(overlayStyles);
    
    store.dispatch(updateProgress(70));
    
    // Calculate dimensions to fill the page height while maintaining aspect ratio
    const elementAspectRatio = canvas.width / canvas.height;
    
    // Prioritize filling the height while maintaining aspect ratio
    const imgHeight = contentHeight;
    const imgWidth = imgHeight * elementAspectRatio;
    
    // Center the image horizontally
    let xPosition = horizontalMargin;
    
    // If the calculated width is less than our desired content width,
    // center it within the content area
    if (imgWidth < contentWidth) {
      xPosition = horizontalMargin + ((contentWidth - imgWidth) / 2);
    }
    
    // Add the canvas to the PDF - centered and with proper margins
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(
      imgData, 
      'JPEG', 
      xPosition, 
      verticalMargin, 
      Math.min(imgWidth, contentWidth), // Ensure it doesn't exceed content width
      imgHeight
    );
    
    store.dispatch(updateProgress(90));
    
    // Save the PDF
    pdf.save(options.filename);
    
    // Restore original section positions
    if (originalSectionPositions) {
      restoreSectionPositions(originalSectionPositions);
    }
    
    // Restore original layout
    if (originalLayout) {
      restoreOriginalLayout(originalLayout);
    }
    
    // Restore original styles
    restoreOriginalStyles(originalStyles);
    
    // Restore animations
    restoreAnimations();
    
    // Finish the PDF generation process
    store.dispatch(finishGenerating());
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    store.dispatch(setError(error.message));
    
    // Restore the PDF loading overlay if it was hidden
    if (overlayStyles.length > 0) {
      restorePdfLoadingOverlay(overlayStyles);
    }
    
    // Restore original section positions
    if (originalSectionPositions) {
      restoreSectionPositions(originalSectionPositions);
    }
    
    // Restore original layout
    if (originalLayout) {
      restoreOriginalLayout(originalLayout);
    }
    
    // Restore original styles
    restoreOriginalStyles(originalStyles);
    
    // Restore animations even if there was an error
    restoreAnimations();
    
    return false;
  }
}; 