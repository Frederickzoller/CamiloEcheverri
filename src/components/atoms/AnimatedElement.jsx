import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import useAnimations from '../../hooks/useAnimations';

// Styled container for the animation
const AnimationContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height || '300px'};
  overflow: hidden;
  border-radius: ${props => props.borderRadius || 'var(--border-radius-md)'};
  background-color: ${props => props.backgroundColor || 'transparent'};
`;

/**
 * Base component for Three.js animations
 */
const AnimatedElement = ({
  id,
  type = 'particles',
  height,
  borderRadius,
  backgroundColor,
  text,
  options = {},
  className,
}) => {
  const containerRef = useRef(null);
  const { animations } = useSelector(state => state.ui);
  const { isEnabled, createScene, createParticlesAnimation, createFloatingTextAnimation, cleanupScene } = useAnimations();
  
  // Generate a unique ID if not provided
  const animationId = id || `animation-${Math.random().toString(36).substr(2, 9)}`;
  
  useEffect(() => {
    // Skip animation creation if animations are disabled
    if (!isEnabled) return;
    
    // Create the scene when the component mounts
    if (containerRef.current) {
      // Initialize the scene
      createScene(animationId, {
        backgroundColor: backgroundColor || null,
        ...options,
      });
      
      // Create the appropriate animation based on type
      switch (type) {
        case 'particles':
          createParticlesAnimation(animationId, options);
          break;
        case 'floatingText':
          createFloatingTextAnimation(animationId, text || '', options);
          break;
        default:
          createParticlesAnimation(animationId, options);
      }
    }
    
    // Clean up the scene when the component unmounts
    return () => {
      cleanupScene(animationId);
    };
  }, [animationId, type, isEnabled, createScene, createParticlesAnimation, createFloatingTextAnimation, cleanupScene, backgroundColor, text, options]);
  
  return (
    <AnimationContainer
      id={animationId}
      ref={containerRef}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      className={className}
    >
      {!isEnabled && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: backgroundColor || 'transparent',
          color: 'var(--color-text-light)',
          fontSize: '0.875rem',
        }}>
          Animations disabled
        </div>
      )}
    </AnimationContainer>
  );
};

export default AnimatedElement; 