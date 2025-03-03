import React from 'react';
import styled, { css } from 'styled-components';

// Divider variants
const variants = {
  solid: css`
    border-top-style: solid;
  `,
  dashed: css`
    border-top-style: dashed;
  `,
  dotted: css`
    border-top-style: dotted;
  `,
  double: css`
    border-top-style: double;
    border-top-width: 4px;
  `,
  gradient: css`
    border: none;
    height: 1px;
    background: ${props => 
      `linear-gradient(to right, transparent, ${props.color || 'var(--color-border)'}, transparent)`
    };
  `,
};

// Styled divider component
const StyledDivider = styled.hr`
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '1.5rem 0'};
  border: none;
  border-top-width: ${props => props.thickness || '1px'};
  border-top-color: ${props => props.color || 'var(--color-border)'};
  
  /* Apply variant styles */
  ${props => variants[props.variant] || variants.solid}
  
  /* Apply vertical style */
  ${props =>
    props.vertical &&
    css`
      width: ${props.thickness || '1px'};
      height: ${props.height || 'auto'};
      margin: ${props.margin || '0 1.5rem'};
      border-top: none;
      border-left-width: ${props.thickness || '1px'};
      border-left-style: ${props.variant === 'gradient' ? 'none' : props.variant || 'solid'};
      border-left-color: ${props.color || 'var(--color-border)'};
      align-self: stretch;
      
      ${props.variant === 'gradient' &&
        css`
          width: 1px;
          background: linear-gradient(
            to bottom,
            transparent,
            ${props.color || 'var(--color-border)'},
            transparent
          );
        `}
    `}
    
  /* Apply text divider style */
  ${props =>
    props.withText &&
    css`
      display: flex;
      align-items: center;
      text-align: center;
      border: none;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        border-top: ${props.thickness || '1px'} ${props.variant === 'gradient' ? 'solid' : props.variant || 'solid'} ${props.color || 'var(--color-border)'};
      }
      
      &::before {
        margin-right: 1rem;
      }
      
      &::after {
        margin-left: 1rem;
      }
    `}
`;

// Text container for divider with text
const TextContainer = styled.span`
  padding: 0 1rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
  white-space: nowrap;
`;

/**
 * Divider component for section separation with subtle styling
 */
const Divider = ({
  variant = 'solid',
  width,
  thickness,
  color,
  margin,
  vertical = false,
  height,
  withText = false,
  text,
  className,
  ...props
}) => {
  if (withText) {
    return (
      <StyledDivider
        as="div"
        variant={variant}
        thickness={thickness}
        color={color}
        margin={margin}
        withText
        className={className}
        {...props}
      >
        <TextContainer>{text}</TextContainer>
      </StyledDivider>
    );
  }
  
  return (
    <StyledDivider
      variant={variant}
      width={width}
      thickness={thickness}
      color={color}
      margin={margin}
      vertical={vertical}
      height={height}
      className={className}
      {...props}
    />
  );
};

export default Divider; 