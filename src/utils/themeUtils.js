/**
 * Get a color with adjusted opacity
 * @param {string} color - Hex color code
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
export const getColorWithOpacity = (color, opacity) => {
  // Convert hex to RGB
  let r, g, b;
  
  if (color.startsWith('#')) {
    // Remove the hash
    const hex = color.substring(1);
    
    // Parse the hex values
    if (hex.length === 3) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return color;
    }
  } else if (color.startsWith('rgb')) {
    // Parse RGB values
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
    } else {
      return color;
    }
  } else {
    return color;
  }
  
  // Return RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get a color with adjusted brightness
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to adjust brightness (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export const adjustColorBrightness = (color, percent) => {
  if (!color) return color;
  
  let R, G, B;
  
  if (color.startsWith('#')) {
    // Remove the hash
    const hex = color.substring(1);
    
    // Parse the hex values
    if (hex.length === 3) {
      R = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      G = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      B = parseInt(hex.charAt(2) + hex.charAt(2), 16);
    } else if (hex.length === 6) {
      R = parseInt(hex.substring(0, 2), 16);
      G = parseInt(hex.substring(2, 4), 16);
      B = parseInt(hex.substring(4, 6), 16);
    } else {
      return color;
    }
  } else {
    return color;
  }
  
  // Adjust brightness
  R = Math.max(0, Math.min(255, R + (percent * 255) / 100));
  G = Math.max(0, Math.min(255, G + (percent * 255) / 100));
  B = Math.max(0, Math.min(255, B + (percent * 255) / 100));
  
  // Convert back to hex
  const RR = Math.round(R).toString(16).padStart(2, '0');
  const GG = Math.round(G).toString(16).padStart(2, '0');
  const BB = Math.round(B).toString(16).padStart(2, '0');
  
  return `#${RR}${GG}${BB}`;
};

/**
 * Get a contrasting text color (black or white) based on background color
 * @param {string} backgroundColor - Hex color code
 * @returns {string} Contrasting text color (#000000 or #FFFFFF)
 */
export const getContrastingTextColor = (backgroundColor) => {
  if (!backgroundColor || !backgroundColor.startsWith('#')) {
    return '#000000';
  }
  
  // Remove the hash
  const hex = backgroundColor.substring(1);
  
  // Parse the hex values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return '#000000';
  }
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Get a CSS box shadow with specified parameters
 * @param {number} offsetX - Horizontal offset
 * @param {number} offsetY - Vertical offset
 * @param {number} blurRadius - Blur radius
 * @param {number} spreadRadius - Spread radius
 * @param {string} color - Shadow color
 * @returns {string} CSS box shadow value
 */
export const getBoxShadow = (
  offsetX = 0,
  offsetY = 4,
  blurRadius = 6,
  spreadRadius = 0,
  color = 'rgba(0, 0, 0, 0.1)'
) => {
  return `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;
};

/**
 * Get a CSS gradient with specified colors
 * @param {string} direction - Gradient direction
 * @param {Array} colors - Array of color stops
 * @returns {string} CSS gradient value
 */
export const getGradient = (direction = 'to right', colors = ['#3498db', '#2c3e50']) => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

/**
 * Get a CSS transition with specified properties
 * @param {Array} properties - Array of CSS properties to transition
 * @param {number} duration - Transition duration in seconds
 * @param {string} timingFunction - Transition timing function
 * @returns {string} CSS transition value
 */
export const getTransition = (
  properties = ['all'],
  duration = 0.3,
  timingFunction = 'ease'
) => {
  return properties
    .map(property => `${property} ${duration}s ${timingFunction}`)
    .join(', ');
}; 