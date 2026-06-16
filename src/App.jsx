import React, { useState, useEffect } from 'react';

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

  // --- TYPEWRITER EFFECT ---
  const [typewriterText, setTypewriterText] = useState('');
  const roles = [
    "Full-Stack Web Engineer",
    "API & Backend Systems Architect",
    "Frontend Architecture Specialist",
    "Real-Time Applications Developer"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypewriterText(currentRole.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setTypewriterText(currentRole.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setIsDeleting(true);
      setTypingSpeed(2000); // Pause on full word
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex(prev => (prev + 1) % roles.length);
      setTypingSpeed(500); // Pause before next word
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex]);

  // --- SCROLL SPY & STICKY HEADER ---
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Scroll spy
      const sections = document.querySelectorAll('section');
      let currentSection = 'hero';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('section, .timeline-item, .project-card, .skill-category');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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

  // --- PROJECTS DATA ---
  const projects = [
    {
      id: 'ayurpiles',
      title: 'Ayurpiles India',
      desc: 'A HIPAA-compliant medical appointment portal and management system featuring online scheduling, practitioner dashboards, and automated email reminders.',
      tags: ['Angular 17', 'NestJS', 'MySQL', 'VPS Cloud'],
      categories: ['angular', 'nestjs'],
      link: 'https://ayurpilesindia.com'
    },
    {
      id: 'phian-corp',
      title: 'Phian Corporate Website',
      desc: 'A highly scalable corporate platform with a custom-engineered CMS engine enabling non-technical staff to control 50+ service categories and inquiry flows.',
      tags: ['Angular', 'Node.js', 'MongoDB', 'CMS API'],
      categories: ['angular', 'nestjs'],
      link: 'https://phianinfotec.com/'
    },
    {
      id: 'athursday',
      title: 'Athursday Cafe',
      desc: 'A digital restaurant framework with a real-time responsive admin menu publisher, order status notifications, and micro-analytics backend dashboards.',
      tags: ['Angular', 'Node.js', 'MySQL', 'CMS'],
      categories: ['angular', 'nestjs'],
      link: 'https://athursday.com/home'
    },
    {
      id: 'vaultstone',
      title: 'Vaultstone Real Estate',
      desc: 'A premier property discovery web application integrating Socket.IO events for live coordination and localized notifications.',
      tags: ['Angular', 'Node.js', 'MongoDB', 'Socket.IO'],
      categories: ['angular', 'nestjs'],
      link: 'https://vaultstone.in/home'
    },
    {
      id: 'alert-system',
      title: 'Emergency Alert System',
      desc: 'A highly fault-tolerant command dashboard coordinating 1,000+ active IoT safety nodes and generating geographic incident reports instantly.',
      tags: ['Angular', 'NestJS', 'MySQL', 'IoT Hub'],
      categories: ['angular', 'nestjs'],
      link: null,
      nda: true
    },
    {
      id: 'ecom-ui',
      title: 'E-Commerce Retail UI',
      desc: 'A responsive web storefront with fluid layout adjustments, persistent storage caching, dynamic filter matrices, and secure customer sign-in dashboards.',
      tags: ['React.js', 'NestJS', 'MongoDB', 'REST API'],
      categories: ['react', 'nestjs'],
      link: 'https://ecomui.vercel.app/'
    }
  ];

  const filteredProjects = projects.filter(p => 
    projectFilter === 'all' || p.categories.includes(projectFilter)
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />

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
                <span className="typewriter-text" id="typewriter">{typewriterText}</span>
              </span>
            </h1>
            <p className="hero-subtitle">
              I build high-performance web applications, scalable backend APIs, and real-time distributed solutions. Specializing in the **MEAN / MERN** stack with a proven record of optimizing workflows and system uptime.
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
              <p>&nbsp;&nbsp;experience: <span className="yellow">'3+ Years'</span>,</p>
              <p>&nbsp;&nbsp;coreStack: [<span className="green">'MEAN'</span>, <span className="green">'MERN'</span>],</p>
              <p>&nbsp;&nbsp;remoteReady: <span className="purple">true</span>,</p>
              <p>&nbsp;&nbsp;scalableAPIs: <span className="purple">true</span>,</p>
              <p>&nbsp;&nbsp;deliverValue: () =&gt; <span className="green">'Clean code & impact'</span></p>
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
                I am a professional <span className="highlight">Full-Stack Web Developer</span> with 3+ years of experience building scalable web applications. I specialize in designing responsive frontends using **Angular 16/17** and **React.js**, and building secure, performant backends with **NestJS, Node.js, and Express**.
              </p>
              <p>
                I focus on building high-performance REST APIs, real-time web solutions, and secure payment integrations. I write clean, modular, and maintainable code targeted for enterprise growth and collaborative remote teams.
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
                <div className="stat-label">Web Deployments</div>
                <div className="stat-desc">Cloud & VPS Environments</div>
              </div>
              <div className="stat-item glass-card">
                <div className="stat-number">40%</div>
                <div className="stat-label">Workflow Efficiency</div>
                <div className="stat-desc">Average Process Automation</div>
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
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-desc">My primary technical stack focused on scalable architecture and enterprise-grade web development.</p>
          </div>

          <div className="skills-container">
            {/* Frontend */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <h3 className="skill-category-title">Frontend Stack</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">Angular 16/17</span>
                <span className="skill-tag">React.js</span>
                <span className="skill-tag">TypeScript</span>
                <span className="skill-tag">JavaScript (ES6+)</span>
                <span className="skill-tag">HTML5 & CSS3</span>
                <span className="skill-tag">RxJS</span>
                <span className="skill-tag">Responsive Design</span>
              </div>
            </div>

            {/* Backend */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                <h3 className="skill-category-title">Backend Architecture</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">NestJS</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">RESTful APIs</span>
                <span className="skill-tag">JWT Authentication</span>
                <span className="skill-tag">RBAC Security</span>
                <span className="skill-tag">Socket.IO</span>
                <span className="skill-tag">MVC Design Pattern</span>
              </div>
            </div>

            {/* Databases & Cloud */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <h3 className="skill-category-title">Databases & DevOps</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">MongoDB</span>
                <span className="skill-tag">MySQL</span>
                <span className="skill-tag">AWS (EC2)</span>
                <span className="skill-tag">Linux VPS</span>
                <span className="skill-tag">Hostinger API</span>
                <span className="skill-tag">Render Cloud</span>
              </div>
            </div>

            {/* Tools & Methods */}
            <div className="skill-category glass-card">
              <div className="skill-category-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 16 12 12 8"></polygon></svg>
                <h3 className="skill-category-title">Tools & Integrations</h3>
              </div>
              <div className="skill-list">
                <span className="skill-tag">Git & GitHub</span>
                <span className="skill-tag">Swagger Docs</span>
                <span className="skill-tag">Postman API Testing</span>
                <span className="skill-tag">Jest Testing</span>
                <span className="skill-tag">PayGart Integration</span>
                <span className="skill-tag">Telr API</span>
                <span className="skill-tag">Agile / Scrum</span>
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
            <p className="section-desc">Experience working in dynamic engineering teams, aligning technical strategy with business value.</p>
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
                  <span className="timeline-date">July 2025 - Present</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Engineered the **Ayurpiles India** healthcare platform using **Angular 17, NestJS, and MySQL**, streamlining appointment scheduling workflows and reducing admin process duration by **40%**.</li>
                  <li>Successfully deployed and configured **6+ production web applications** on Hostinger VPS and Render cloud hosting, setting up continuous environment-specific backend configurations for zero-downtime deployment.</li>
                  <li>Engineered a dynamic corporate website with an integrated CMS system, empowering non-technical administrators to seamlessly update **50+ active services**.</li>
                  <li>Implemented Socket.IO real-time menu management & geolocation APIs for cafe platforms, automating restaurant workflows and saving manual work by **70%**.</li>
                  <li>Delivered a real estate listing website and web platform, integrating Socket.IO for live location tracking and real-time updates.</li>
                  <li>Designed and optimized high-performance, modular RESTful APIs using **NestJS and Express**, serving client integrations across 5 concurrent corporate accounts.</li>
                  <li>Architected and delivered a highly responsive, end-to-end full-stack e-commerce engine using **React.js, NestJS, and MongoDB**.</li>
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
                    <h4>Atina Technology Pvt. Ltd., Nagpur</h4>
                  </div>
                  <span className="timeline-date">Feb 2024 - June 2025</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Architected and delivered a highly responsive, end-to-end full-stack e-commerce engine using **React.js, NestJS, and MongoDB**, serving a core customer base of **1,000+ potential users**.</li>
                  <li>Led the server engineering and real-time messaging pipeline for a critical Emergency Alert System, orchestrating event payloads for **500 to 1,000 active smart-firefighting devices**.</li>
                  <li>Upgraded core Angular UI modules for critical dispatch consoles, optimizing role-based access controls and streamlining operations across 3 distinct operator workflows.</li>
                  <li>Fine-tuned MySQL query schedules and MongoDB indexes, accelerating API execution speeds by **25%** for real-time traffic statistics.</li>
                  <li>Contributed to 10+ Agile sprint cycles involving code reviews, sprint planning, and CI/CD deployment activities.</li>
                </ul>
              </div>
            </div>

            {/* Ulis Technology */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card glass-card">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h3>Software Developer</h3>
                    <h4>Ulis Technology Pvt. Ltd., Nagpur</h4>
                  </div>
                  <span className="timeline-date">May 2023 - Jan 2024</span>
                </div>
                <ul className="timeline-bullets">
                  <li>Integrated secure payment gateway APIs (**PayGart** and **Telr**) for a high-traffic fintech web portal, processing **1,000+ daily financial operations** with strict transaction security.</li>
                  <li>Authored robust server-side request verification logic and transaction retry mechanisms, decreasing checkout failures by **15%**.</li>
                  <li>Maintained production repository standards, branching guides, and code reviews on GitHub, facilitating clean merges and stable production pipelines across **3+ primary releases**.</li>
                </ul>
              </div>
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
            <button className={`filter-btn ${projectFilter === 'react' ? 'active' : ''}`} onClick={() => setProjectFilter('react')}>React</button>
            <button className={`filter-btn ${projectFilter === 'nestjs' ? 'active' : ''}`} onClick={() => setProjectFilter('nestjs')}>NestJS / Node</button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card glass-card" data-category={project.categories.join(' ')}>
                <div className="project-body">
                  <div className="project-header-row">
                    <div className="project-icon-box">
                      {project.id === 'ayurpiles' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      )}
                      {project.id === 'phian-corp' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      )}
                      {project.id === 'athursday' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      )}
                      {project.id === 'vaultstone' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      )}
                      {project.id === 'alert-system' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      )}
                      {project.id === 'ecom-ui' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
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
