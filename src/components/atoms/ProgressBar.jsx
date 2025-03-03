import React from 'react';
import styled, { keyframes } from 'styled-components';
import { getColorWithOpacity } from '../../utils/themeUtils';

// Animation for progress bar filling
const fillAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: var(--progress-width);
  }
`;

// Styled container for the progress bar
const ProgressContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '8px'};
  background-color: ${props => props.backgroundColor || getColorWithOpacity('#000000', 0.2)};
  border-radius: ${props => props.borderRadius || 'var(--border-radius-sm)'};
  overflow: hidden;
  position: relative;
`;

// Styled progress indicator
const ProgressIndicator = styled.div`
  height: 100%;
  width: var(--progress-width);
  background-color: ${props => props.color || 'var(--color-secondary)'};
  border-radius: ${props => props.borderRadius || 'var(--border-radius-sm)'};
  transition: width 0.5s ease;
  animation: ${fillAnimation} ${props => props.animationDuration || '1s'} ease-out;
  animation-fill-mode: forwards;
  position: relative;
  
  /* Gradient effect */
  ${props => props.gradient && `
    background: linear-gradient(to right, ${props.gradient.join(', ')});
  `}
  
  /* Striped effect */
  ${props => props.striped && `
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  `}
  
  /* Animated stripes */
  ${props => props.animatedStripes && `
    @keyframes progressStripes {
      from { background-position: 1rem 0; }
      to { background-position: 0 0; }
    }
    animation: progressStripes 1s linear infinite, ${fillAnimation} ${props.animationDuration || '1s'} ease-out;
  `}
`;

// Styled label for the progress value
const ProgressLabel = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.labelColor || 'white'};
  z-index: 1;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  opacity: ${props => (props.showLabel ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

/**
 * Progress bar component for visual representation of skills or metrics
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  height,
  color,
  backgroundColor,
  borderRadius,
  showLabel = true,
  labelColor,
  gradient,
  striped = false,
  animatedStripes = false,
  animationDuration = '1s',
  className,
  ...props
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <ProgressContainer
      height={height}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      className={className}
      {...props}
    >
      <ProgressIndicator
        style={{ '--progress-width': `${progressPercentage}%` }}
        color={color}
        borderRadius={borderRadius}
        gradient={gradient}
        striped={striped}
        animatedStripes={animatedStripes}
        animationDuration={animationDuration}
      />
      <ProgressLabel
        showLabel={showLabel && progressPercentage > 5}
        labelColor={labelColor}
      >
        {progressPercentage}%
      </ProgressLabel>
    </ProgressContainer>
  );
};

export default ProgressBar; 