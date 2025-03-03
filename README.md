# C-Level Executive CV Landing Page

An interactive, professional CV landing page with Three.js animations and PDF export functionality.

## Features

- Professional, credible digital presence for a C-level executive
- Subtle yet impactful visual interactions using Three.js
- PDF export with perfect fidelity to the web experience
- Responsive design optimized for all devices
- Content structure emphasizing achievements and leadership impact
- Premium, executive-level aesthetic with a light theme

## Tech Stack

- React 18
- Redux Toolkit for state management
- React Router for navigation
- Three.js for animations
- Axios for data fetching
- Vite as the build tool
- Styled Components for styling
- jsPDF and html2canvas for PDF generation

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd c-level-cv-landing-page
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

The project follows an atomic design pattern:

- **Atoms**: Fundamental UI elements (Button, Typography, Icon, etc.)
- **Molecules**: Composite UI elements (MetricCard, SectionHeader, etc.)
- **Organisms**: Complex UI sections (HeroSection, ExperienceTimeline, etc.)
- **Templates**: Page layout structures (MainLayout, ContentSection, etc.)
- **Pages**: Complete page views (CVLandingPage)

## PDF Export

The application allows exporting the CV as a PDF document with the same visual appearance as the web version. The PDF generation process:

1. Captures the current DOM structure
2. Transforms Three.js animations to static representations
3. Generates a PDF maintaining layout and styling
4. Initiates download of the generated PDF

## Performance Optimization

The application is optimized for performance:
- Three.js animations adapt to device capabilities
- Progressive degradation of animation complexity when needed
- Initial load time under 3 seconds on standard connections
- Responsive design for all device types 