import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '../atoms/Typography';
import AnimatedElement from '../atoms/AnimatedElement';
import { getBoxShadow } from '../../utils/themeUtils';

// Styled card container
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: ${getBoxShadow(0, 4, 12, 0, 'rgba(0, 0, 0, 0.08)')};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${getBoxShadow(0, 8, 20, 0, 'rgba(0, 0, 0, 0.12)')};
  }
`;

// Styled metric value with animation
const MetricValue = styled(Typography)`
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

// Styled metric label
const MetricLabel = styled(Typography)`
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 1;
`;

// Styled metric period
const MetricPeriod = styled(Typography)`
  position: relative;
  z-index: 1;
`;

// Styled animation background
const AnimationBackground = styled(AnimatedElement)`
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.1;
`;

/**
 * MetricCard component for displaying key achievement metrics with animations
 */
const MetricCard = ({
  label,
  value,
  period,
  icon,
  color = 'var(--color-secondary)', // Default to secondary color from theme
  animationType = 'particles',
  className,
  ...props
}) => {
  // State for animated counting effect
  const [displayValue, setDisplayValue] = useState('0');
  
  // Animate the value when component mounts
  useEffect(() => {
    // Parse the numeric part of the value
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    const prefix = value.match(/^[^0-9]*/)[0];
    const suffix = value.match(/[^0-9]*$/)[0];
    
    if (!isNaN(numericValue)) {
      // Animate the value over time
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep += 1;
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        const currentValue = Math.round(numericValue * easedProgress);
        setDisplayValue(`${prefix}${currentValue}${suffix}`);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayValue(value);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value]);
  
  return (
    <CardContainer className={className} {...props}>
      <AnimationBackground
        type={animationType}
        backgroundColor="transparent"
        options={{ color: 0x333333 }} // Updated to dark gray
      />
      
      <MetricValue variant="metric" color={color}>
        {displayValue}
      </MetricValue>
      
      <MetricLabel variant="subheading" size="lg" noMargin>
        {label}
      </MetricLabel>
      
      {period && (
        <MetricPeriod variant="caption" color="var(--color-text-light)" noMargin>
          {period}
        </MetricPeriod>
      )}
    </CardContainer>
  );
};

export default MetricCard; 