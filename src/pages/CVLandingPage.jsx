import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Typography from '../components/atoms/Typography';
import Button from '../components/atoms/Button';
import AnimatedElement from '../components/atoms/AnimatedElement';
import MetricCard from '../components/molecules/MetricCard';
import SectionHeader from '../components/molecules/SectionHeader';
import ProgressBar from '../components/atoms/ProgressBar';
import Divider from '../components/atoms/Divider';
import useResponsive from '../hooks/useResponsive';
import usePdfExport from '../hooks/usePdfExport';
import useAnimations from '../hooks/useAnimations';
import { setActiveSection, closeMenu } from '../store/slices/uiSlice';

// Styled page container
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
`;

// Styled header
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: var(--shadow-sm);
  z-index: 100;
  padding: 1rem 0;
`;

// Styled navigation
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Styled logo
const Logo = styled.div`
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-primary);
`;

// Styled navigation links
const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Styled navigation link
const NavLink = styled.a`
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--color-secondary);
  }
  
  &.active {
    color: var(--color-secondary);
  }
`;

// Styled mobile menu button
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-primary);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Styled main content
const Main = styled.main`
  padding-top: 5rem;
`;

// Styled hero section
const HeroSection = styled.section`
  min-height: calc(100vh - 5rem);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

// Styled hero content
const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 600px;
`;

// Styled hero animation
const HeroAnimation = styled(AnimatedElement)`
  position: absolute !important;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    opacity: 0.3;
  }
`;

// Styled section
const Section = styled.section`
  padding: 5rem 0;
`;

// Styled metrics grid
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

// Styled experience item
const ExperienceItem = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
`;

// Styled experience header
const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Styled experience company
const ExperienceCompany = styled(Typography)`
  color: var(--color-primary);
`;

// Styled experience period
const ExperiencePeriod = styled(Typography)`
  color: var(--color-text-light);
`;

// Styled experience title
const ExperienceTitle = styled(Typography)`
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
`;

// Styled experience location
const ExperienceLocation = styled(Typography)`
  color: var(--color-text-light);
  margin-bottom: 1rem;
`;

// Styled experience description
const ExperienceDescription = styled(Typography)`
  margin-bottom: 1.5rem;
`;

// Styled achievements list
const AchievementsList = styled.ul`
  padding-left: 1.5rem;
`;

// Styled achievement item
const AchievementItem = styled.li`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// Styled skills section
const SkillsSection = styled.div`
  margin-top: 3rem;
`;

// Styled skills category
const SkillsCategory = styled.div`
  margin-bottom: 2rem;
`;

// Styled skills grid
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

// Styled skill item
const SkillItem = styled.div`
  margin-bottom: 1rem;
`;

// Styled skill name
const SkillName = styled(Typography)`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

// Styled education section
const EducationSection = styled.div`
  margin-top: 3rem;
`;

// Styled education item
const EducationItem = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
`;

// Styled education degree
const EducationDegree = styled(Typography)`
  color: var(--color-primary);
  margin-bottom: 0.5rem;
`;

// Styled education institution
const EducationInstitution = styled(Typography)`
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
`;

// Styled education details
const EducationDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Styled education year
const EducationYear = styled(Typography)`
  color: var(--color-text-light);
`;

// Styled education honors
const EducationHonors = styled(Typography)`
  color: var(--color-accent);
`;

// Styled contact section
const ContactSection = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

// Styled contact item
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

// Styled contact icon
const ContactIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-secondary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

// Styled contact text
const ContactText = styled.div``;

// Styled contact label
const ContactLabel = styled(Typography)`
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
`;

// Styled contact value
const ContactValue = styled(Typography)`
  color: var(--color-primary);
`;

// Styled footer
const Footer = styled.footer`
  background-color: var(--color-primary);
  color: white;
  padding: 2rem 0;
  text-align: center;
`;

// Styled PDF loading overlay
const PdfLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// Styled PDF loading progress
const PdfLoadingProgress = styled.div`
  width: 300px;
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  margin-top: 1rem;
  overflow: hidden;
`;

// Styled PDF loading progress bar
const PdfLoadingProgressBar = styled.div`
  height: 100%;
  background-color: var(--color-secondary);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

/**
 * Main CV landing page component
 */
const CVLandingPage = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state);
  const { isGenerating, progress, error, exportPdf } = usePdfExport();
  const { isMobile } = useResponsive();
  const { isEnabled: animationsEnabled } = useAnimations();
  
  const heroRef = useRef(null);
  const metricsRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const educationRef = useRef(null);
  const contactRef = useRef(null);
  
  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Check which section is currently in view
      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        dispatch(setActiveSection('hero'));
      } else if (metricsRef.current && scrollPosition < metricsRef.current.offsetTop + metricsRef.current.offsetHeight) {
        dispatch(setActiveSection('metrics'));
      } else if (experienceRef.current && scrollPosition < experienceRef.current.offsetTop + experienceRef.current.offsetHeight) {
        dispatch(setActiveSection('experience'));
      } else if (skillsRef.current && scrollPosition < skillsRef.current.offsetTop + skillsRef.current.offsetHeight) {
        dispatch(setActiveSection('skills'));
      } else if (educationRef.current && scrollPosition < educationRef.current.offsetTop + educationRef.current.offsetHeight) {
        dispatch(setActiveSection('education'));
      } else if (contactRef.current) {
        dispatch(setActiveSection('contact'));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);
  
  // Handle PDF export
  const handleExportPdf = async () => {
    // Close mobile menu if open
    if (isMobile) {
      dispatch(closeMenu());
    }
    
    // Scroll to top to ensure the entire page is captured
    window.scrollTo(0, 0);
    
    // Small delay to ensure the page is fully rendered after scrolling
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate and export the PDF
    await exportPdf();
  };
  
  return (
    <PageContainer id="cv-container">
      {/* Header */}
      <Header>
        <div className="container">
          <Nav>
            <Logo>{profile.personalInfo.name.split(' ')[0]}</Logo>
            
            <NavLinks>
              <NavLink href="#hero">Home</NavLink>
              <NavLink href="#experience">Experience</NavLink>
              <NavLink href="#skills">Skills</NavLink>
              <NavLink href="#education">Education</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </NavLinks>
            
            <Button variant="download" size="small" onClick={handleExportPdf}>
              Download CV
            </Button>
            
            <MobileMenuButton>
              ☰
            </MobileMenuButton>
          </Nav>
        </div>
      </Header>
      
      {/* Main Content */}
      <Main>
        {/* Hero Section */}
        <HeroSection id="hero" ref={heroRef}>
          <div className="container">
            <HeroContent>
              <Typography variant="heading" size="xxxl">
                {profile.personalInfo.name}
              </Typography>
              
              <Typography variant="subheading" color="var(--color-secondary)" noMargin>
                {profile.personalInfo.title}
              </Typography>
              
              <Divider margin="2rem 0" />
              
              <Typography variant="body">
                {profile.personalInfo.summary}
              </Typography>
              
              <Button variant="primary" style={{ marginTop: '2rem' }} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
                Get in Touch
              </Button>
            </HeroContent>
            
            {animationsEnabled && (
              <HeroAnimation
                type="particles"
                options={{
                  count: 150,
                  color: 0x333333,
                  size: 0.03,
                  maxDistance: 10,
                }}
              />
            )}
          </div>
        </HeroSection>
        
        {/* Metrics Section */}
        <Section id="metrics" ref={metricsRef} className="section">
          <div className="container">
            <SectionHeader
              title="Key Achievements"
              subtitle="Measurable impact and results from my leadership journey"
              align="center"
            />
            
            <MetricsGrid>
              {profile.metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  label={metric.label}
                  value={metric.value}
                  period={metric.period}
                  icon={metric.icon}
                  color="var(--color-secondary)"
                />
              ))}
            </MetricsGrid>
          </div>
        </Section>
        
        {/* Experience Section */}
        <Section id="experience" ref={experienceRef} className="section" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <SectionHeader
              title="Professional Experience"
              subtitle="A track record of leadership and strategic impact across industries"
            />
            
            {profile.experience.map((exp, index) => (
              <ExperienceItem key={index}>
                <ExperienceHeader>
                  <ExperienceCompany variant="subheading" noMargin>
                    {exp.company}
                  </ExperienceCompany>
                  
                  <ExperiencePeriod variant="body" noMargin>
                    {exp.period}
                  </ExperiencePeriod>
                </ExperienceHeader>
                
                <ExperienceTitle variant="body" weight="600" noMargin>
                  {exp.title}
                </ExperienceTitle>
                
                <ExperienceLocation variant="caption" noMargin>
                  {exp.location}
                </ExperienceLocation>
                
                <ExperienceDescription variant="body">
                  {exp.description}
                </ExperienceDescription>
                
                <Typography variant="body" weight="600" noMargin>
                  Key Achievements:
                </Typography>
                
                <AchievementsList>
                  {exp.achievements.map((achievement, i) => (
                    <AchievementItem key={i}>
                      <Typography variant="body" noMargin>
                        {achievement}
                      </Typography>
                    </AchievementItem>
                  ))}
                </AchievementsList>
              </ExperienceItem>
            ))}
          </div>
        </Section>
        
        {/* Skills Section */}
        <Section id="skills" ref={skillsRef} className="section">
          <div className="container">
            <SectionHeader
              title="Skills & Expertise"
              subtitle="Core competencies developed through years of executive leadership"
            />
            
            <SkillsSection>
              {profile.skills.map((category, index) => (
                <SkillsCategory key={index}>
                  <Typography variant="subheading" size="xl">
                    {category.category}
                  </Typography>
                  
                  <SkillsGrid>
                    {category.items.map((skill, i) => (
                      <SkillItem key={i}>
                        <SkillName variant="body" weight="500" noMargin>
                          {skill.name}
                          <span>{skill.proficiency}%</span>
                        </SkillName>
                        
                        <ProgressBar
                          value={skill.proficiency}
                          height="8px"
                          color={
                            category.category === 'Leadership'
                              ? '#333333'
                              : category.category === 'Business'
                              ? '#555555'
                              : '#777777'
                          }
                        />
                      </SkillItem>
                    ))}
                  </SkillsGrid>
                </SkillsCategory>
              ))}
            </SkillsSection>
          </div>
        </Section>
        
        {/* Education Section */}
        <Section id="education" ref={educationRef} className="section" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <SectionHeader
              title="Education & Certifications"
              subtitle="Academic credentials and professional development"
            />
            
            <EducationSection>
              <Typography variant="subheading" size="xl" margin="0 0 1.5rem 0">
                Academic Education
              </Typography>
              
              {profile.education.map((edu, index) => (
                <EducationItem key={index}>
                  <EducationDegree variant="body" weight="600" noMargin>
                    {edu.degree}
                  </EducationDegree>
                  
                  <EducationInstitution variant="body" noMargin>
                    {edu.institution}
                  </EducationInstitution>
                  
                  <EducationDetails>
                    <EducationYear variant="caption" noMargin>
                      {edu.year}
                    </EducationYear>
                    
                    {edu.honors && (
                      <EducationHonors variant="caption" weight="600" noMargin>
                        {edu.honors}
                      </EducationHonors>
                    )}
                  </EducationDetails>
                </EducationItem>
              ))}
              
              <Typography variant="subheading" size="xl" margin="2.5rem 0 1.5rem 0">
                Professional Certifications
              </Typography>
              
              {profile.certifications.map((cert, index) => (
                <EducationItem key={index}>
                  <EducationDegree variant="body" weight="600" noMargin>
                    {cert.name}
                  </EducationDegree>
                  
                  <EducationInstitution variant="body" noMargin>
                    {cert.issuer}
                  </EducationInstitution>
                  
                  <EducationDetails>
                    <EducationYear variant="caption" noMargin>
                      {cert.year}
                    </EducationYear>
                  </EducationDetails>
                </EducationItem>
              ))}
            </EducationSection>
          </div>
        </Section>
        
        {/* Contact Section */}
        <Section id="contact" ref={contactRef} className="section">
          <div className="container">
            <SectionHeader
              title="Contact Information"
              subtitle="Get in touch to discuss opportunities and collaborations"
              align="center"
            />
            
            <ContactSection>
              <ContactItem>
                <ContactIcon>📧</ContactIcon>
                <ContactText>
                  <ContactLabel variant="caption" noMargin>
                    Email
                  </ContactLabel>
                  <ContactValue variant="body" noMargin>
                    {profile.personalInfo.contact.email}
                  </ContactValue>
                </ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>📱</ContactIcon>
                <ContactText>
                  <ContactLabel variant="caption" noMargin>
                    Phone
                  </ContactLabel>
                  <ContactValue variant="body" noMargin>
                    {profile.personalInfo.contact.phone}
                  </ContactValue>
                </ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>📍</ContactIcon>
                <ContactText>
                  <ContactLabel variant="caption" noMargin>
                    Location
                  </ContactLabel>
                  <ContactValue variant="body" noMargin>
                    {profile.personalInfo.contact.location}
                  </ContactValue>
                </ContactText>
              </ContactItem>
              
              <ContactItem>
                <ContactIcon>🔗</ContactIcon>
                <ContactText>
                  <ContactLabel variant="caption" noMargin>
                    LinkedIn
                  </ContactLabel>
                  <ContactValue variant="body" noMargin>
                    {profile.personalInfo.contact.linkedin}
                  </ContactValue>
                </ContactText>
              </ContactItem>
            </ContactSection>
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Button variant="download" onClick={handleExportPdf}>
                Download Complete CV
              </Button>
            </div>
          </div>
        </Section>
      </Main>
      
      {/* Footer */}
      <Footer>
        <div className="container">
          <Typography variant="body" color="white" noMargin>
            &copy; {new Date().getFullYear()} {profile.personalInfo.name} | Executive CV
          </Typography>
        </div>
      </Footer>
      
      {/* PDF Generation Loading Overlay */}
      {isGenerating && (
        <PdfLoadingOverlay>
          <Typography variant="subheading">
            Generating PDF...
          </Typography>
          
          <PdfLoadingProgress>
            <PdfLoadingProgressBar progress={progress} />
          </PdfLoadingProgress>
          
          {error && (
            <Typography variant="body" color="var(--color-error)" style={{ marginTop: '1rem' }}>
              Error: {error}
            </Typography>
          )}
        </PdfLoadingOverlay>
      )}
    </PageContainer>
  );
};

export default CVLandingPage; 