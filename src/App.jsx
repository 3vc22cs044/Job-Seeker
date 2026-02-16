import React from 'react';
import { 
  Briefcase, 
  FileText, 
  Settings, 
  ArrowRight, 
  Github,
  Zap,
  Globe,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

const projects = [
  {
    title: "KodNest Build System",
    description: "A professional-grade build management platform designed for efficiency and tracking. Features advanced dashboarding and real-time status updates.",
    icon: <Settings size={32} />,
    tag: "Dev Tool",
    path: "/kodnest-build-system",
    link: "https://3vc22cs044.github.io/Kodnest-build-system"
  },
  {
    title: "AI Resume Builder",
    description: "Intelligent career tool that leverages AI to transform your job descriptions into high-impact, professionally formatted resumes tailored for success.",
    icon: <FileText size={32} />,
    tag: "AI Powered",
    path: "/ai-resume-builder",
    link: "https://3vc22cs044.github.io/AI-Resume-Builder"
  },
  {
    title: "Placement Readiness",
    description: "The ultimate preparation engine. Analyzes job descriptions, extracts skills, and creates personalized 7-day preparation checklists.",
    icon: <Briefcase size={32} />,
    tag: "Career Ready",
    path: "/placement-readiness",
    link: "https://3vc22cs044.github.io/Placement-Readiness"
  }
];

function App() {
  return (
    <div className="app-container">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Rocket className="text-indigo-500" />
          <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-1px' }}>JOB SEEKER SUITE</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="https://github.com/3vc22cs044" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}><Github /></a>
        </div>
      </motion.nav>

      <div className="hero">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Your Career, <br /> Accelerated by Intelligence.
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          A unified ecosystem designed to help you build, optimize, and land your dream job with state-of-the-art tools and AI integration.
        </motion.p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.div 
            key={index}
            className="project-card"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + (index * 0.1), duration: 0.6 }}
            onClick={() => window.open(project.link, '_blank')}
          >
            <span className="badge">{project.tag}</span>
            <div className="icon-wrapper">
              {project.icon}
            </div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="project-link">
              Explore Portal <ArrowRight size={18} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ marginTop: '8rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} /> <span>Blazing Fast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} /> <span>Unified Platform</span>
          </div>
        </div>
        <p>© 2026 Professional Job Seeker Suite. Designed for Excellence.</p>
      </motion.footer>
    </div>
  );
}

export default App;
