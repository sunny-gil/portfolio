import React, { useState, useEffect, useMemo, memo } from 'react';

// --- STATIC ROLES DATA ---
const ROLES = [
  "Full-Stack Developer (MEAN & MERN)",
  "React.js & Angular Frontend Engineer",
  "Node.js & NestJS Backend Architect",
  "Real-Time & Payment Gateway Specialist"
];

// --- ISOLATED TYPEWRITER COMPONENT ---
// Prevents continuous full-page re-renders on every keystroke
const Typewriter = memo(function Typewriter() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const currentRole = ROLES[roleIndex];

  useEffect(() => {
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCharIndex(prev => prev - 1);
        setTypingSpeed(45);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCharIndex(prev => prev + 1);
        setTypingSpeed(85);
      }, typingSpeed);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setIsDeleting(true);
      setTypingSpeed(2000); // Pause on full role
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex(prev => (prev + 1) % ROLES.length);
      setTypingSpeed(400); // Pause before next role
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, currentRole.length, typingSpeed]);

  return (
    <span className="typewriter-text" id="typewriter">
      {currentRole.substring(0, charIndex)}
    </span>
  );
});

// --- STATIC PROJECTS DATA (FROM RESUME) ---
const PROJECTS = [
  {
    id: 'vaultstone-crm',
    title: 'Vaultstone CRM',
    subtitle: 'Real-Estate CRM Platform',
    desc: 'Engineered a comprehensive real-estate CRM platform for builders and sales teams. Implemented Lead, Property, Opportunity, Customer, Task, Dashboard, and User Management modules with scalable NestJS RESTful APIs, JWT authentication, RBAC, and real-time Socket.IO notifications.',
    tags: ['Angular', 'Node.js', 'NestJS', 'MongoDB', 'Socket.IO'],
    categories: ['angular', 'nestjs', 'realtime'],
    link: 'https://crm.vaultstone.in/'
  },
  {
    id: 'ecom-app',
    title: 'E-Commerce Web Application',
    subtitle: 'Full-Stack Retail Platform',
    desc: 'Developed a robust full-stack e-commerce web platform using React.js, NestJS, MongoDB, and RESTful APIs. Implemented end-to-end customer and administrative workflows including product cataloging, cart state management, and secure checkout processing.',
    tags: ['React.js', 'NestJS', 'MongoDB', 'REST APIs'],
    categories: ['react', 'nestjs'],
    link: 'https://ecomui.vercel.app/'
  },
  {
    id: 'emergency-alert',
    title: 'Emergency Alert System',
    subtitle: 'Real-Time Mission Critical IoT System',
    desc: 'Developed high-reliability backend services for an Emergency Alert System supporting real-time device communication and telemetry data streaming. Enhanced Angular modules for mission-critical firefighter workflow management.',
    tags: ['Angular', 'NestJS', 'MySQL', 'Socket.IO', 'Real-Time IoT'],
    categories: ['angular', 'nestjs', 'realtime'],
    link: null,
    nda: true
  },
  {
    id: 'paydart-gateway',
    title: 'PayDart & Telr Payment Gateway',
    subtitle: 'Fintech Transaction Processing APIs',
    desc: 'Developed and integrated production-grade PayDart and Telr payment gateway APIs using Node.js, Express.js, and MySQL. Implemented transaction validation, security checks, idempotent processing, and resilient error handling.',
    tags: ['Node.js', 'Express.js', 'MySQL', 'RESTful APIs', 'Fintech Security'],
    categories: ['nestjs', 'fintech'],
    link: null,
    nda: true
  },
  {
    id: 'ayurpiles',
    title: 'Ayurpiles India Healthcare',
    subtitle: 'Medical Appointment & Admin Portal',
    desc: 'Developed a complete healthcare platform using Angular, NestJS, and MySQL, including automated patient appointment booking, practitioner dashboards, and administrative workflows.',
    tags: ['Angular', 'NestJS', 'MySQL', 'Linux VPS'],
    categories: ['angular', 'nestjs'],
    link: 'https://ayurpilesindia.com'
  },
  {
    id: 'athursday',
    title: 'Athursday Cafe Platform',
    subtitle: 'Real-Time Restaurant & Menu CMS',
    desc: 'Engineered an interactive restaurant portal with CMS functionality for live menu management, order updates, and administrative workflow automation.',
    tags: ['Angular', 'Node.js', 'MySQL', 'CMS'],
    categories: ['angular', 'nestjs'],
    link: 'https://athursday.com/home'
  },
  {
    id: 'phian-corp',
    title: 'Phian Infotech Corporate Platform',
    subtitle: 'Enterprise Corporate Portal & CMS',
    desc: 'Developed a high-performance corporate platform with an intuitive custom CMS enabling non-technical teams to manage 50+ services and client inquiry pipelines effortlessly.',
    tags: ['Angular', 'Node.js', 'MongoDB', 'CMS'],
    categories: ['angular', 'nestjs'],
    link: 'https://phianinfotec.com/'
  }
];

export default function App() {
  // --- STATE HOOKS ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [projectFilter, setProjectFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [isMobile, setIsMobile] = useState(false);

  // --- RESPONSIVE MOBILE CHECK ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- OPTIMIZED SCROLL SPY & STICKY HEADER (rAF + Passive Listener) ---
  useEffect(() => {
    let ticking = false;
    const header = document.getElementById('header');

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Sticky header class toggle
          if (header) {
            if (scrollY > 50) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
          }

          // Scroll spy with memoized checks
          const sections = document.querySelectorAll('section[id]');
          let currentSection = 'hero';
          sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
              currentSection = section.getAttribute('id');
            }
          });

          // Only trigger React state change if section actually changed
          setActiveSection(prev => (prev !== currentSection ? currentSection : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Unobserve once revealed to save CPU
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    const animatedElements = document.querySelectorAll('section, .timeline-item, .project-card, .skill-category');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [projectFilter]);

  // --- CONTACT FORM SUBMISSION ---
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const name = document.getElementById('name-field').value;
    const email = document.getElementById('email-field').value;
    const subject = document.getElementById('subject-field').value;
    const message = document.getElementById('message-field').value;

    fetch('https://formsubmit.co/ajax/sunnygill1706@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: `Portfolio Contact: ${subject}`,
        message: message
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === 'true') {
          setFormStatus('success');
          e.target.reset();
        } else {
          throw new Error('Submit failed');
        }
      })
      .catch(err => {
        console.error(err);
        setFormStatus('error');
      })
      .finally(() => {
        setTimeout(() => {
          setFormStatus('idle');
        }, 3500);
      });
  };

  // --- MODAL SCROLL LOCK ---
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // --- MEMOIZED FILTERED PROJECTS ---
  const filteredProjects = useMemo(() => {
    return projectFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter(p => p.categories.includes(projectFilter));
  }, [projectFilter]);

  return (
    <>

      {/* --- HEADER / NAVIGATION --- */}
      <header id="header">
        <div className="container nav-container">
          <a href="#" className="logo">
            SUNNY<span>GILL</span>
          </a>

          <nav>
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
              <li>
                <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</a>
              </li>
              <li>
                <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About</a>
              </li>
              <li>
                <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Skills</a>
              </li>
              <li>
                <a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Experience</a>
              </li>
              <li>
                <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Projects</a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="nav-link" 
                  onClick={(e) => { e.preventDefault(); setIsModalOpen(true); setIsMenuOpen(false); }}
                >
                  Resume
                </a>
              </li>
              <li>
                <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</a>
              </li>
              <li className="nav-cta">
                <a href="mailto:sunnygill1706@gmail.com" className="btn btn-primary">Hire Me</a>
              </li>
            </ul>
          </nav>

          <button 
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
            id="nav-toggle" 
            aria-label="Toggle Navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span style={isMenuOpen ? {transform: 'rotate(45deg) translate(5px, 6px)'} : {}}></span>
            <span style={isMenuOpen ? {opacity: '0'} : {}}></span>
            <span style={isMenuOpen ? {transform: 'rotate(-45deg) translate(5px, -6px)'} : {}}></span>
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero">
        <div className="container hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse"></span> Engineering Scalable Solutions for Startups & Enterprises Globally
            </div>
            <h1 className="hero-title">
              Hi, I'm <span className="name">Sunny Gill</span>
              <span style={{ fontSize: '0.6em', fontWeight: 600 }}>
                <Typewriter />
              </span>
            </h1>
            <p className="hero-subtitle">
              Full-Stack Developer with 3+ years of experience building production web applications and scalable RESTful APIs using Node.js, NestJS, Express.js, Angular, React.js, MongoDB, and MySQL. Specialized in CRM, e-commerce, healthcare, fintech, and real-time distributed systems.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View My Work
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="mailto:sunnygill1706@gmail.com" className="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Get In Touch
              </a>
            </div>
            <div className="hero-socials">
              <a href="https://linkedin.com/in/sunny-gill1706" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/sunny-gil" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-sphere"></div>
            <div className="visual-code-card glass-card">
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
              </div>
              <p><span className="purple">const</span> <span className="blue">developer</span> = &#123;</p>
              <p>&nbsp;&nbsp;name: <span className="green">'Sunny Gill'</span>,</p>
              <p>&nbsp;&nbsp;role: <span className="green">'Full-Stack Developer'</span>,</p>
              <p>&nbsp;&nbsp;experience: <span className="yellow">'3+ Years'</span>,</p>
              <p>&nbsp;&nbsp;frontend: [<span className="green">'React.js'</span>, <span className="green">'Angular'</span>],</p>
              <p>&nbsp;&nbsp;backend: [<span className="green">'Node.js'</span>, <span className="green">'NestJS'</span>, <span className="green">'Express'</span>],</p>
              <p>&nbsp;&nbsp;databases: [<span className="green">'MongoDB'</span>, <span className="green">'MySQL'</span>],</p>
              <p>&nbsp;&nbsp;architecture: [<span className="green">'Socket.IO'</span>, <span className="green">'JWT/RBAC'</span>, <span className="green">'REST APIs'</span>],</p>
              <p>&nbsp;&nbsp;delivers: () =&gt; <span className="green">'Scalable production systems'</span></p>
              <p>&#125;;</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Driven by Impact, Focused on Scale</h2>
          </div>

          <div className="about-grid">
            <div className="about-content">
              <p>
                I am a professional <span className="highlight">Full-Stack Developer</span> with 3+ years of experience building robust production web applications and scalable RESTful APIs using <strong>Node.js, NestJS, Express.js, Angular, React.js, MongoDB, and MySQL</strong>.
              </p>
              <p>
                Proven track record in architecting <strong>CRM, e-commerce, healthcare, fintech, and real-time distributed platforms</strong>. Hands-on mastery in JWT authentication, Role-Based Access Control (RBAC), Socket.IO live notifications, payment gateway integrations (PayDart, Telr), API optimization, and cloud deployment on Linux VPS, Render, and AWS EC2.
              </p>
              <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="https://linkedin.com/in/sunny-gill1706" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  View LinkedIn Profile
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  View Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </button>
                <a href="Sunny_Gill_Resume.pdf" download="Sunny_Gill_Resume.pdf" className="btn btn-secondary">
                  Download Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </a>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item glass-card">
                <div className="stat-number">3+</div>
                <div className="stat-label">Years Experience</div>
                <div className="stat-desc">Commercial Development</div>
              </div>
              <div className="stat-item glass-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Web Projects</div>
                <div className="stat-desc">Enterprise & Production</div>
              </div>
              <div className="stat-item glass-card">
                <div className="stat-number">6+</div>
                <div className="stat-label">Cloud Deployments</div>
                <div className="stat-desc">AWS EC2, Linux VPS, Render</div>
              </div>
              <div className="stat-item glass-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">API Reliability</div>
                <div className="stat-desc">Secure JWT, RBAC & Socket.IO</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="glass-card" style={{ borderRadius: 0, background: 'rgba(10, 14, 23, 0.4)', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Capabilities</span>
            <h2 className="section-title">Technical Skills</h2>
            <p className="section-desc">Enterprise-grade technologies and tools used to build scalable, fault-tolerant applications.</p>
          </div>

          <div className="skills-container">
            {/* Frontend */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <h3 className="skill-category-title">Frontend Development</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">Angular</span>
                <span className="skill-tag">JavaScript (ES6+)</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">HTML5 & CSS3</span>
                <span className="skill-tag">Bootstrap</span>
                <span className="skill-tag">Responsive Web Design</span>
              </div>
            </div>

            {/* Backend */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                <h3 className="skill-category-title">Backend & APIs</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">NestJS</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">RESTful APIs</span>
                <span className="skill-tag">Socket.IO</span>
                <span className="skill-tag">Payment Gateway APIs</span>
              </div>
            </div>

            {/* Databases */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                <h3 className="skill-category-title">Database Systems</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">MongoDB</span>
                <span className="skill-tag">MySQL</span>
                <span className="skill-tag">Query Optimization</span>
                <span className="skill-tag">Data Modeling</span>
                <span className="skill-tag">Indexing</span>
              </div>
            </div>

            {/* Security */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h3 className="skill-category-title">Auth & Security</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">JWT</span>
                <span className="skill-tag">RBAC</span>
                <span className="skill-tag">Authentication</span>
                <span className="skill-tag">Authorization</span>
                <span className="skill-tag">Error Handling</span>
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                <h3 className="skill-category-title">Cloud & Deployment</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">AWS EC2</span>
                <span className="skill-tag">Linux Server</span>
                <span className="skill-tag">Render</span>
                <span className="skill-tag">Hostinger</span>
                <span className="skill-tag">PM2</span>
              </div>
            </div>

            {/* Architecture & Tools */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <h3 className="skill-category-title">Architecture & Tools</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">MVC Architecture</span>
                <span className="skill-tag">Modular Architecture</span>
                <span className="skill-tag">Agile / Scrum</span>
                <span className="skill-tag">Git & GitHub</span>
                <span className="skill-tag">Swagger</span>
                <span className="skill-tag">Postman</span>
                <span className="skill-tag">Jest</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section id="experience">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Career History</span>
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-desc">Track record of building enterprise products, high-throughput APIs, and real-time systems.</p>
          </div>

          <div className="timeline">
            {/* Phian Infotech */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card glass-card">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h3>Software Developer</h3>
                    <h4>Phian Infotech, Nagpur</h4>
                  </div>
                  <span className="timeline-date">July 2025 – Present</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Developed production-ready backend applications using <strong>Node.js, NestJS, Express.js, MongoDB, and MySQL</strong>.</li>
                  <li>Designed and implemented RESTful APIs with <strong>JWT authentication, role-based access control (RBAC), validation</strong>, and structured error handling.</li>
                  <li>Developed <strong>Vaultstone CRM</strong> featuring Lead, Opportunity, Property, Customer, Task, Dashboard, and User Management modules.</li>
                  <li>Implemented real-time notifications and live updates using <strong>Socket.IO</strong>.</li>
                  <li>Developed the <strong>Ayurpiles India</strong> healthcare platform using <strong>Angular, NestJS, and MySQL</strong>, including appointment booking and administrative workflows.</li>
                  <li>Developed CMS functionality for the <strong>Phian Infotech corporate website</strong> and <strong>Athursday Cafe platform</strong>.</li>
                  <li>Deployed and maintained production applications on <strong>Linux servers, Hostinger, and Render</strong>.</li>
                </ul>
              </div>
            </div>

            {/* Atina Technology */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card glass-card">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h3>Software Developer</h3>
                    <h4>Atina Technology Pvt. Ltd, Nagpur</h4>
                  </div>
                  <span className="timeline-date">Feb 2024 – June 2025</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Developed a full-stack e-commerce platform using <strong>React.js, NestJS, MongoDB, and RESTful APIs</strong>.</li>
                  <li>Developed backend services for an <strong>Emergency Alert System</strong> supporting real-time device communication.</li>
                  <li>Enhanced <strong>Angular modules</strong> for firefighter workflow management.</li>
                  <li>Optimized <strong>NestJS APIs and database operations</strong> across MongoDB and MySQL.</li>
                  <li>Participated in <strong>Agile development, sprint planning, code reviews</strong>, and collaborative software development.</li>
                </ul>
              </div>
            </div>

            {/* ULIS Technology */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card glass-card">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h3>Software Developer</h3>
                    <h4>ULIS Technology Pvt. Ltd, Nagpur</h4>
                  </div>
                  <span className="timeline-date">May 2022 – June 2023</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Developed and integrated <strong>PayDart and Telr payment gateway APIs</strong> using Node.js, Express.js, and MySQL.</li>
                  <li>Implemented transaction validation, secure payment processing, and resilient API error handling.</li>
                  <li>Managed Git workflows and supported production application deployments.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EDUCATION SECTION --- */}
      <section id="education" style={{ paddingTop: '10px', paddingBottom: '70px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '36px' }}>
            <span className="section-tag">Academic Background</span>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="timeline-card glass-card" style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px', padding: '28px 32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              flexShrink: 0
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>Bachelor of Engineering – Information Technology</h3>
                <span className="timeline-date" style={{ margin: 0 }}>Graduated: 2019</span>
              </div>
              <h4 style={{ fontSize: '15px', color: 'var(--color-secondary)', fontWeight: 500 }}>VMIT, Nagpur, India</h4>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="glass-card" style={{ borderRadius: 0, background: 'rgba(10, 14, 23, 0.4)', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Key Projects</h2>
            <p className="section-desc">A curated collection of client-facing products and contributions displaying real-world impact.</p>
          </div>

          <div className="project-filters">
            <button className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All Projects</button>
            <button className={`filter-btn ${projectFilter === 'angular' ? 'active' : ''}`} onClick={() => setProjectFilter('angular')}>Angular</button>
            <button className={`filter-btn ${projectFilter === 'react' ? 'active' : ''}`} onClick={() => setProjectFilter('react')}>React.js</button>
            <button className={`filter-btn ${projectFilter === 'nestjs' ? 'active' : ''}`} onClick={() => setProjectFilter('nestjs')}>NestJS / Node.js</button>
            <button className={`filter-btn ${projectFilter === 'realtime' ? 'active' : ''}`} onClick={() => setProjectFilter('realtime')}>Real-Time & IoT</button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card glass-card" data-category={project.categories.join(' ')}>
                <div className="project-body">
                  <div className="project-header-row">
                    <div className="project-icon-box">
                      {project.id === 'vaultstone-crm' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      )}
                      {project.id === 'ecom-app' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                      )}
                      {project.id === 'emergency-alert' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      )}
                      {project.id === 'paydart-gateway' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                      )}
                      {project.id === 'ayurpiles' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      )}
                      {project.id === 'phian-corp' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      )}
                      {project.id === 'athursday' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      )}
                    </div>
                    <div className="project-link-box">
                      {project.nda ? (
                        <span className="project-tech-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>NDA / Enterprise</span>
                      ) : (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      )}
                    </div>
                  </div>
                  {project.subtitle && (
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                      {project.subtitle}
                    </div>
                  )}
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tech-tags">
                    {project.tags.map(t => (
                      <span key={t} className="project-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Let's Collaborate</h2>
            <p className="section-desc">Interested in remote work, project consulting, or hiring for MNC roles? Get in touch today.</p>
          </div>

          <div className="contact-wrapper">
            <div className="contact-info-panel">
              <div className="contact-title-group">
                <h3>Connect With Me</h3>
                <p>Feel free to reach out via email, phone, or LinkedIn. I typically respond within 12 hours for professional inquiries.</p>
              </div>

              <div className="contact-methods">
                {/* Email */}
                <div className="contact-card glass-card">
                  <div className="contact-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div className="contact-card-details">
                    <h4>Email</h4>
                    <a href="mailto:sunnygill1706@gmail.com">sunnygill1706@gmail.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-card glass-card">
                  <div className="contact-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div className="contact-card-details">
                    <h4>Phone</h4>
                    <a href="tel:+918412915125">+91 84129 15125</a>
                  </div>
                </div>

                {/* Location */}
                <div className="contact-card glass-card">
                  <div className="contact-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className="contact-card-details">
                    <h4>Location</h4>
                    <p>Nagpur, Maharashtra, India (GMT+5:30) / Remote Ready</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-panel glass-card">
              <form id="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name-field" className="form-label">Full Name</label>
                    <input type="text" id="name-field" className="form-input" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-field" className="form-label">Email Address</label>
                    <input type="email" id="email-field" className="form-input" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="form-group full-width" style={{ marginBottom: '24px' }}>
                  <label htmlFor="subject-field" className="form-label">Subject</label>
                  <input type="text" id="subject-field" className="form-input" placeholder="Collaboration / Job Opportunity" required />
                </div>
                <div className="form-group full-width" style={{ marginBottom: '24px' }}>
                  <label htmlFor="message-field" className="form-label">Message</label>
                  <textarea id="message-field" className="form-input" placeholder="Write your message here..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary submit-btn" disabled={formStatus !== 'idle'}>
                  {formStatus === 'idle' && (
                    <>
                      Send Message
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </>
                  )}
                  {formStatus === 'sending' && (
                    <>
                      Sending Message...
                      <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" strokeDasharray="10 3" stroke="currentColor"></circle></svg>
                    </>
                  )}
                  {formStatus === 'success' && (
                    <>
                      Message Sent Successfully!
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </>
                  )}
                  {formStatus === 'error' && (
                    <>
                      Error! Try Again.
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <div className="container footer-wrapper">
          <a href="#" className="logo" style={{ fontSize: '18px' }}>
            SUNNY<span>GILL</span>
          </a>
          <p className="footer-text">&copy; 2026 Sunny Gill. All rights reserved. Engineered for scalability, performance, and impact.</p>
        </div>
      </footer>

      {/* --- RESUME MODAL --- */}
      <div id="resume-modal" className={`modal ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.id === 'resume-modal') setIsModalOpen(false); }}>
        <div className="modal-content glass-card">
          <div className="modal-header">
            <h3>Sunny Gill - Resume Preview</h3>
            <button id="close-modal" className="close-btn" aria-label="Close Preview" onClick={() => setIsModalOpen(false)}>&times;</button>
          </div>
          <div className="modal-body">
            {isMobile ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px 24px',
                textAlign: 'center',
                background: '#0B0F19'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  marginBottom: '20px'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Mobile PDF View</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '300px' }}>
                  Mobile browsers do not support embedded PDF rendering. You can open it in a new window or download it directly.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '240px' }}>
                  <a href="Sunny_Gill_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    Open PDF Viewer
                  </a>
                  <a href="Sunny_Gill_Resume.pdf" download="Sunny_Gill_Resume.pdf" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                    Download Directly
                  </a>
                </div>
              </div>
            ) : (
              <iframe src="Sunny_Gill_Resume.pdf" width="100%" height="100%" style={{ border: 'none' }}></iframe>
            )}
          </div>
          <div className="modal-footer">
            <a href="Sunny_Gill_Resume.pdf" download="Sunny_Gill_Resume.pdf" className="btn btn-primary">
              Download PDF
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
