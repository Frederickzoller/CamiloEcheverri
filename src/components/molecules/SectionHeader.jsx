import React from 'react';
import styled from 'styled-components';
import Typography from '../atoms/Typography';
import Divider from '../atoms/Divider';

// Styled header container
const HeaderContainer = styled.div`
  margin-bottom: ${props => props.marginBottom || '2rem'};
  text-align: ${props => props.align || 'left'};
  max-width: ${props => props.maxWidth || '100%'};
`;

// Styled title with optional accent - updated for black and white theme
const Title = styled(Typography)`
  position: relative;
  display: inline-block;
  
  ${props => props.withAccent && `
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 3rem;
      height: 3px;
      background-color: var(--color-secondary);
      border-radius: 1.5px;
    }
  `}
`;

// Styled subtitle
const Subtitle = styled(Typography)`
  max-width: ${props => props.maxWidth || '800px'};
  margin: ${props => props.align === 'center' ? '0 auto' : '0'};
  margin-top: 1rem;
`;

/**
 * SectionHeader component for consistent headers for each content section
 */
const SectionHeader = ({
  title,
  subtitle,
  align = 'left',
  withDivider = false,
  withAccent = true,
  dividerVariant = 'gradient',
  marginBottom,
  maxWidth,
  titleProps = {},
  subtitleProps = {},
  className,
  ...props
}) => {
  return (
    <HeaderContainer 
      align={align} 
      marginBottom={marginBottom}
      maxWidth={maxWidth}
      className={className}
      {...props}
    >
      <Title 
        variant="heading" 
        align={align}
        withAccent={withAccent && !withDivider}
        {...titleProps}
      >
        {title}
      </Title>
      
      {withDivider && (
        <Divider 
          variant={dividerVariant} 
          margin="1.5rem 0"
          width={align === 'center' ? '80%' : '100%'}
          style={align === 'center' ? { margin: '1.5rem auto' } : {}}
        />
      )}
      
      {subtitle && (
        <Subtitle 
          variant="body" 
          align={align}
          maxWidth={maxWidth}
          color="var(--color-text-light)"
          {...subtitleProps}
        >
          {subtitle}
        </Subtitle>
      )}
    </HeaderContainer>
  );
};

export default SectionHeader; 