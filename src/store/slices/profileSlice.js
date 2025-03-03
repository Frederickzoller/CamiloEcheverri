import { createSlice } from '@reduxjs/toolkit';

// Sample CV data - in a real application, this would come from an API or CMS
const initialState = {
  personalInfo: {
    name: 'John Doe',
    title: 'Chief Executive Officer',
    summary: 'Visionary executive with 15+ years of experience driving strategic growth and digital transformation across global enterprises. Proven track record of leading organizations through complex market challenges while delivering exceptional shareholder value.',
    photo: '/images/profile-photo.jpg',
    contact: {
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      twitter: 'twitter.com/johndoe',
    },
  },
  metrics: [
    {
      label: 'Revenue Growth',
      value: '127%',
      period: 'over 3 years',
      icon: 'chart-line',
    },
    {
      label: 'Team Size',
      value: '250+',
      period: 'professionals',
      icon: 'users',
    },
    {
      label: 'Market Expansion',
      value: '12',
      period: 'new markets',
      icon: 'globe',
    },
    {
      label: 'Investor Funding',
      value: '$75M',
      period: 'secured',
      icon: 'money-bill',
    },
  ],
  experience: [
    {
      company: 'Global Innovations Inc.',
      title: 'Chief Executive Officer',
      period: 'Jan 2018 - Present',
      location: 'New York, NY',
      description: 'Leading strategic vision and execution for a Fortune 500 technology company with $1.2B annual revenue and 1,200+ employees across 15 countries.',
      achievements: [
        'Orchestrated digital transformation initiative resulting in 127% revenue growth over 3 years',
        'Spearheaded expansion into 12 new international markets, increasing global market share by 34%',
        'Secured $75M in Series C funding with a $1.2B valuation',
        'Implemented organizational restructuring that improved operational efficiency by 42%',
      ],
    },
    {
      company: 'TechVentures LLC',
      title: 'Chief Operating Officer',
      period: 'Mar 2014 - Dec 2017',
      location: 'San Francisco, CA',
      description: 'Directed all operational aspects for a high-growth SaaS company, overseeing product development, sales, marketing, and customer success.',
      achievements: [
        'Scaled company from 45 to 250+ employees while maintaining strong culture and values',
        'Led acquisition and integration of 3 strategic companies, expanding product portfolio',
        'Established enterprise sales division that secured 28 Fortune 1000 clients',
        'Reduced customer acquisition cost by 37% while improving retention rates to 94%',
      ],
    },
    {
      company: 'Strategic Solutions Group',
      title: 'VP of Strategy',
      period: 'Jun 2010 - Feb 2014',
      location: 'Boston, MA',
      description: 'Developed and executed corporate strategy for a management consulting firm specializing in technology and financial services sectors.',
      achievements: [
        'Advised C-suite executives at 40+ enterprise clients on digital transformation strategies',
        'Developed proprietary strategic planning methodology adopted by 85% of client base',
        'Built and led a team of 35 strategy consultants across 3 regional offices',
        'Increased average client engagement value by 65% through service expansion',
      ],
    },
  ],
  skills: [
    {
      category: 'Leadership',
      items: [
        { name: 'Strategic Planning', proficiency: 95 },
        { name: 'Executive Management', proficiency: 90 },
        { name: 'Change Management', proficiency: 85 },
        { name: 'Board Relations', proficiency: 90 },
        { name: 'Crisis Management', proficiency: 85 },
      ],
    },
    {
      category: 'Business',
      items: [
        { name: 'P&L Management', proficiency: 90 },
        { name: 'M&A', proficiency: 85 },
        { name: 'Fundraising', proficiency: 90 },
        { name: 'Market Analysis', proficiency: 80 },
        { name: 'Business Development', proficiency: 85 },
      ],
    },
    {
      category: 'Technology',
      items: [
        { name: 'Digital Transformation', proficiency: 90 },
        { name: 'Product Strategy', proficiency: 85 },
        { name: 'Technology Roadmapping', proficiency: 80 },
        { name: 'AI/ML Strategy', proficiency: 75 },
        { name: 'Cybersecurity Governance', proficiency: 70 },
      ],
    },
  ],
  projects: [
    {
      title: 'Enterprise Digital Transformation',
      description: 'Led comprehensive digital transformation initiative across all business units, modernizing legacy systems and implementing data-driven decision making.',
      outcomes: [
        '42% increase in operational efficiency',
        '27% reduction in technology costs',
        'Improved customer satisfaction scores by 35%',
      ],
      image: '/images/project1.jpg',
    },
    {
      title: 'Global Market Expansion',
      description: 'Developed and executed strategy for entering 12 new international markets across EMEA and APAC regions.',
      outcomes: [
        'Established operations in 12 countries within 18 months',
        'Achieved profitability in new markets 6 months ahead of projections',
        'Increased international revenue contribution from 15% to 43%',
      ],
      image: '/images/project2.jpg',
    },
    {
      title: 'Corporate Innovation Program',
      description: 'Created internal innovation incubator to identify and develop new business opportunities and disruptive technologies.',
      outcomes: [
        'Launched 5 new product lines generating $45M in new revenue',
        'Filed 12 patents for proprietary technologies',
        'Established partnerships with 3 leading research universities',
      ],
      image: '/images/project3.jpg',
    },
  ],
  education: [
    {
      degree: 'Master of Business Administration',
      institution: 'Harvard Business School',
      year: '2008',
      honors: 'Baker Scholar',
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Massachusetts Institute of Technology',
      year: '2004',
      honors: 'Summa Cum Laude',
    },
  ],
  certifications: [
    {
      name: 'Advanced Management Program',
      issuer: 'INSEAD',
      year: '2016',
    },
    {
      name: 'Board Director Certification',
      issuer: 'National Association of Corporate Directors',
      year: '2019',
    },
    {
      name: 'Executive Leadership',
      issuer: 'Stanford Graduate School of Business',
      year: '2015',
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Fluent' },
    { name: 'French', proficiency: 'Intermediate' },
    { name: 'Mandarin', proficiency: 'Basic' },
  ],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateExperience: (state, action) => {
      state.experience = action.payload;
    },
    updateSkills: (state, action) => {
      state.skills = action.payload;
    },
    updateProjects: (state, action) => {
      state.projects = action.payload;
    },
    updateEducation: (state, action) => {
      state.education = action.payload;
    },
  },
});

export const {
  updatePersonalInfo,
  updateExperience,
  updateSkills,
  updateProjects,
  updateEducation,
} = profileSlice.actions;

export default profileSlice.reducer; 