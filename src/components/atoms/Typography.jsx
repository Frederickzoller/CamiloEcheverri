import React from 'react';
import styled, { css } from 'styled-components';

// Typography variants
const variants = {
  heading: css`
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: var(--color-primary);
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  `,
  subheading: css`
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 0.75rem;
    color: var(--color-primary);
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  `,
  body: css`
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: var(--color-text);
  `,
  caption: css`
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text-light);
  `,
  metric: css`
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 3rem;
    line-height: 1.1;
    color: var(--color-secondary);
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  `,
};

// Typography sizes
const sizes = {
  xs: css`
    font-size: 0.75rem;
  `,
  sm: css`
    font-size: 0.875rem;
  `,
  md: css`
    font-size: 1rem;
  `,
  lg: css`
    font-size: 1.25rem;
  `,
  xl: css`
    font-size: 1.5rem;
  `,
  xxl: css`
    font-size: 2rem;
  `,
  xxxl: css`
    font-size: 2.5rem;
  `,
};

// Styled component for typography
const StyledTypography = styled.div`
  /* Apply variant styles */
  ${props => variants[props.variant] || variants.body}
  
  /* Apply size styles (overrides variant size) */
  ${props => props.size && sizes[props.size]}
  
  /* Apply color */
  ${props => props.color && `color: ${props.color};`}
  
  /* Apply font weight */
  ${props => props.weight && `font-weight: ${props.weight};`}
  
  /* Apply text alignment */
  ${props => props.align && `text-align: ${props.align};`}
  
  /* Apply text transform */
  ${props => props.transform && `text-transform: ${props.transform};`}
  
  /* Apply margin */
  ${props => props.noMargin && 'margin: 0;'}
  
  /* Apply custom styles */
  ${props => props.customStyles}
`;

/**
 * Typography component with multiple variants and customization options
 */
const Typography = ({
  children,
  variant = 'body',
  component,
  size,
  color,
  weight,
  align,
  transform,
  noMargin = false,
  customStyles,
  ...props
}) => {
  // Determine the HTML element to use
  let Component = component;
  
  if (!Component) {
    // Default element based on variant
    switch (variant) {
      case 'heading':
        Component = 'h1';
        break;
      case 'subheading':
        Component = 'h2';
        break;
      case 'body':
        Component = 'p';
        break;
      case 'caption':
        Component = 'span';
        break;
      case 'metric':
        Component = 'div';
        break;
      default:
        Component = 'p';
    }
  }
  
  return (
    <StyledTypography
      as={Component}
      variant={variant}
      size={size}
      color={color}
      weight={weight}
      align={align}
      transform={transform}
      noMargin={noMargin}
      customStyles={customStyles}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

export default Typography; 