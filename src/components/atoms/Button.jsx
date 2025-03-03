import React from 'react';
import styled, { css } from 'styled-components';
import { getTransition } from '../../utils/themeUtils';

// Button variants
const variants = {
  primary: css`
    background-color: var(--color-primary);
    color: white;
    border: none;
    
    &:hover {
      background-color: #1a2530;
    }
    
    &:active {
      background-color: #0f1720;
    }
  `,
  secondary: css`
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    
    &:hover {
      background-color: rgba(44, 62, 80, 0.1);
    }
    
    &:active {
      background-color: rgba(44, 62, 80, 0.2);
    }
  `,
  download: css`
    background-color: var(--color-secondary);
    color: white;
    border: none;
    
    &:hover {
      background-color: #2980b9;
    }
    
    &:active {
      background-color: #2471a3;
    }
  `,
};

// Button sizes
const sizes = {
  small: css`
    padding: 8px 16px;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 12px 24px;
    font-size: 1rem;
  `,
  large: css`
    padding: 16px 32px;
    font-size: 1.125rem;
  `,
};

// Styled button component
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 500;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: ${getTransition(['background-color', 'transform', 'box-shadow'])};
  box-shadow: var(--shadow-sm);
  outline: none;
  position: relative;
  overflow: hidden;
  
  /* Apply variant styles */
  ${props => variants[props.variant] || variants.primary}
  
  /* Apply size styles */
  ${props => sizes[props.size] || sizes.medium}
  
  /* Disabled state */
  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
        box-shadow: var(--shadow-sm);
      }
    `}
  
  /* Full width */
  ${props =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
    
  /* Icon spacing */
  & > svg {
    margin-right: ${props => (props.iconPosition === 'left' ? '8px' : '0')};
    margin-left: ${props => (props.iconPosition === 'right' ? '8px' : '0')};
  }
  
  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

/**
 * Button component with multiple variants and sizes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      iconPosition={iconPosition}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </StyledButton>
  );
};

export default Button; 