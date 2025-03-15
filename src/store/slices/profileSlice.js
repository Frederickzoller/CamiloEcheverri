import { createSlice } from '@reduxjs/toolkit';

// Sample CV data - in a real application, this would come from an API or CMS
const initialState = {
  personalInfo: {
    name: 'Camilo Echeverri',
    title: 'Founder and Gaming Interoperability Specialist',
    summary: 'Web3 explorer since 2017. Transitioned from tradfi to Blockchain development, co-founding THE HUB DAO. Focused on disrupting the new Internet through interoperable gaming assets and true digital ownership. AI and prompt engineering enthusiast.',
    contact: {
      email: 'camilo.echeverri@thehubdao.xyz',
      phone: '+4915759128734',
      location: 'Frankfurt, Germany',
      linkedin: 'https://www.linkedin.com/in/caem2017/',
      twitter: 'https://x.com/patabravaeth',
    },
  },
  metrics: [
    {
      label: 'Revenue Growth',
      value: '200%',
      period: 'over 2 years',
      icon: 'chart-line',
    },
    {
      label: 'Team Size',
      value: '40+',
      period: 'professionals',
      icon: 'users',
    },
    {
      label: 'Successful Exit',
      value: '1',
      period: '2025',
      icon: 'globe',
    },
    {
      label: 'Investor Funding',
      value: '$2.5M',
      period: 'secured',
      icon: 'money-bill',
    },
  ],
  experience: [
    {
      company: 'THE HUB',
      title: 'Co-Founder',
      period: 'Apr 2021 - Present',
      location: 'Frankfurt, DE',
      description: 'Led the development of the homebase of the 3D Web, The first interoperable on-chain avatar platform designed for gamers and creators. Backed by Brinc, Ocean Protocol, The Sandbox, Chainlink, Decentraland, Polygon and Lukso',
      achievements: [
        'Developed the first AI metaverse asset appraisal engine, reaching 370k valuations per month',
        'Secured grants of over 500k USD from leading web3 companies such as The Sandbox, Decentraland, Polygon, Ocean Protocol and Chainlink',
        'Secured $2.5M in Seed funding with a 7.5 million valuation',
  
      ],
    },
    {
      company: 'The DAC',
      title: 'Co-Founder',
      period: 'Mar 2022 - Present',
      location: 'Frankfurt, GER',
      description: 'Created a LATAM focused incubator for Web3 projects. Ran through three cohorts, with 10+ startups and 100+ participants',
      achievements: [
        'Bootstrapped VIIO, the leading digital dollars savings app in LATAM',
        'Collaborated closely with leading universities in Colombia and Germany to source talent and build partnerships',
        'Organized 10+ hackathons and events to foster blockchain adoption in Colombia and Argentina',
        
      ],
    },
    {
      company: 'Index Intelligence',
      title: 'Index Data Analyst',
      period: 'Jun 2010 - Feb 2014',
      location: 'Frankfurt, GER',
      description: 'Developed equity indices for leading hedge funds and asset managers in EMEA region',
      achievements: [
        'Calculated and monitored the performance of equity indices, identifying trends and anomalies in returns, volatility, and sector weightings',
        'Conducted quarterly and annual index rebalancing by adjusting constituent weights based on market capitalization and liquidity criteria',
        'Worked with product development teams to design new equity indices tailored to emerging markets or thematic investments',
      ],
    },
  ],
  skills: [
    {
      category: 'Hard Skills',
      items: [
        { name: 'AI/Prompt Engineering', proficiency: 90 },
        { name: 'Web3 Technologies', proficiency: 95 },
        { name: 'Interoperable Gaming', proficiency: 95 },
        { name: 'Metaverse Development', proficiency: 80 },
        { name: 'NFT Infrastructure', proficiency: 85 },
      
      ],
    },
    {
      category: 'Soft Skills',
      items: [
        { name: 'Strategic Leadership', proficiency: 90 },
        { name: 'Fundraising', proficiency: 95 },
        { name: 'Community Building', proficiency: 90 },
        { name: 'Business Development', proficiency: 95 },
        { name: 'Public Speaking', proficiency: 95 },
        
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
      degree: 'International Finance (Bsc)',
      institution: 'Frankfurt University of Applied Sciences',
      year: '2015 - 2019',
      honors: '',
    },
    {
      degree: 'Exchange Semester, Global Business Administration (Bsc)',
      institution: 'Sungkyunkwan University',
      year: '2018 - 2018',
      honors: '',
    },
  ],
  languages: [
    { name: 'Spanish', proficiency: 'Native' },
    { name: 'English', proficiency: 'Fluent' },
    { name: 'German', proficiency: 'Fluent' },
    { name: 'Italian', proficiency: 'Intermediate' },
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