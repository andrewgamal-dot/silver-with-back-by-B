import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import RoadmapCard from './components/RoadmapCard';
import Modal from './components/Modal';
import { roadmaps } from './data/roadmaps';
import SignUpModal from './components/SignUpModal';
import LoginModal from './components/LoginModal';
import CourseContentPage from './components/CourseContentPage';
import MobileDevelopmentCourse from './components/MobileDevelopmentCourse';
import MobileNavigation from './components/MobileNavigation';

// Main App Component
function MainApp() {
  const [activeSection, setActiveSection] = useState('roadmaps');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const openModal = (roadmapId) => {
    if (roadmapId === 'webdev') {
      navigate('/course/web-development');
    } else if (roadmapId === 'mobile') {
      navigate('/course/mobile-development');
    } else {
      setSelectedRoadmapId(roadmapId);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoadmapId(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleMobileNavigation = (action) => {
    if (action === 'login') {
      setIsLoginOpen(true);
    } else if (action === 'signup') {
      setIsSignUpOpen(true);
    }
  };

  return (
    <div className="App">
      {/* Desktop Navigation */}
      <header className={isScrolled ? 'scrolled' : ''}>
        <nav className="container">
          <div className="logo">
            <span className="logo-text">Silver Code Line</span>
          </div>
          <ul className="nav-links">
            <li><button onClick={() => scrollToSection('home')} className="nav-link">Home</button></li>
            <li><button onClick={() => scrollToSection('roadmaps')} className="nav-link">Roadmaps</button></li>
            <li><button onClick={() => scrollToSection('blog')} className="nav-link">Blog</button></li>
            <li><button onClick={() => scrollToSection('resources')} className="nav-link">Resources</button></li>
            <li><button onClick={() => scrollToSection('community')} className="nav-link">Community</button></li>
          </ul>
          <div className="auth-buttons">
            <button className="btn-login" onClick={() => setIsLoginOpen(true)}>Login</button>
            <button className="btn-signup" onClick={() => setIsSignUpOpen(true)}>Sign Up</button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation 
        onNavigate={handleMobileNavigation} 
        activeSection={activeSection} 
        scrollToSection={scrollToSection}
      />

      <section className="hero" id="home">
        <div className="container">
          <h1>Master <span className="highlight">Technical Skills</span> Your Way</h1>
          <p>Structured learning paths for self-learners who want to excel in web development, mobile apps, cybersecurity, and software engineering</p>
          <div className="cta-buttons">
            <button onClick={() => scrollToSection('roadmaps')} className="cta-button">Start Learning</button>
            <button onClick={() => scrollToSection('community')} className="cta-button secondary">Join Community</button>
          </div>
        </div>
      </section>

      <main>
        <div className="container">
          <div className="main-nav">
            <button 
              className={`nav-tab ${activeSection === 'roadmaps' ? 'active' : ''}`} 
              onClick={() => showSection('roadmaps')}
            >
              Roadmaps
            </button>
            <button 
              className={`nav-tab ${activeSection === 'progress' ? 'active' : ''}`} 
              onClick={() => showSection('progress')}
            >
              My Progress
            </button>
            <button 
              className={`nav-tab ${activeSection === 'blog' ? 'active' : ''}`} 
              onClick={() => showSection('blog')}
            >
              Blog
            </button>
            <button 
              className={`nav-tab ${activeSection === 'resources' ? 'active' : ''}`} 
              onClick={() => showSection('resources')}
            >
              Resources
            </button>
            <button 
              className={`nav-tab ${activeSection === 'community' ? 'active' : ''}`} 
              onClick={() => showSection('community')}
            >
              Community
            </button>
            <button 
              className={`nav-tab ${activeSection === 'testimonials' ? 'active' : ''}`} 
              onClick={() => showSection('testimonials')}
            >
              Testimonials
            </button>
          </div>

          {/* Roadmaps Section */}
          <section id="roadmaps" className={`content-section ${activeSection === 'roadmaps' ? 'active' : ''}`}>
            <h2 className="section-title">Learning Roadmaps</h2>
            <div className="roadmaps-grid">
              {roadmaps.map(roadmap => (
                <RoadmapCard 
                  key={roadmap.id}
                  roadmap={roadmap}
                  onViewRoadmap={openModal}
                  onTrackProgress={(id) => {
                    // TODO: Implement progress tracking functionality
                    console.log(`Tracking progress for roadmap: ${id}`);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Progress Section */}
          <section id="progress" className={`content-section ${activeSection === 'progress' ? 'active' : ''}`}>
            <h2 className="section-title">My Progress</h2>
            {/* Progress content will be added here */}
          </section>

          {/* Blog Section */}
          <section id="blog" className={`content-section ${activeSection === 'blog' ? 'active' : ''}`}>
            <h2 className="section-title">Latest Articles</h2>
            {/* Blog content will be added here */}
          </section>

          {/* Resources Section */}
          <section id="resources" className={`content-section ${activeSection === 'resources' ? 'active' : ''}`}>
            <h2 className="section-title">Learning Resources</h2>
            {/* Resources content will be added here */}
          </section>

          {/* Community Section */}
          <section id="community" className={`content-section ${activeSection === 'community' ? 'active' : ''}`}>
            <h2 className="section-title">Community</h2>
            {/* Community content will be added here */}
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className={`content-section ${activeSection === 'testimonials' ? 'active' : ''}`}>
            <h2 className="section-title">Success Stories</h2>
            {/* Testimonials content will be added here */}
          </section>
        </div>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <button className="footer-link">Our Story</button>
              <button className="footer-link">Mission & Vision</button>
              <button className="footer-link">Team</button>
              <button className="footer-link">Careers</button>
            </div>

            <div className="footer-section">
              <h3>Support</h3>
              <button className="footer-link">Help Center</button>
              <button className="footer-link">Contact Us</button>
              <button className="footer-link">Feedback</button>
              <button className="footer-link">FAQs</button>
            </div>

            <div className="footer-section">
              <h3>Legal</h3>
              <button className="footer-link">Terms of Service</button>
              <button className="footer-link">Privacy Policy</button>
              <button className="footer-link">Cookie Policy</button>
            </div>

            <div className="footer-section">
              <h3>Follow Us</h3>
              <button className="footer-link">Facebook</button>
              <button className="footer-link">Twitter</button>
              <button className="footer-link">LinkedIn</button>
              <button className="footer-link">Instagram</button>
            </div>
          </div>

          <div className="footer-bottom">
            &copy; 2023 Silver Code Line. All rights reserved.
          </div>
        </div>
      </footer>

      <Modal 
        isOpen={isModalOpen}
        onClose={closeModal}
        roadmapId={selectedRoadmapId}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  );
}

// Course Page Component
function CoursePage() {
  const navigate = useNavigate();
  
  const handleBackToRoadmaps = () => {
    navigate('/');
  };

  return (
    <CourseContentPage 
      roadmapId="webdev"
      onClose={handleBackToRoadmaps}
    />
  );
}

// Mobile Development Course Page Component
function MobileCoursePage() {
  const navigate = useNavigate();
  
  const handleBackToRoadmaps = () => {
    navigate('/');
  };

  return (
    <MobileDevelopmentCourse 
      roadmapId="mobile"
      onClose={handleBackToRoadmaps}
    />
  );
}

// Main App with Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/course/web-development" element={<CoursePage />} />
        <Route path="/course/mobile-development" element={<MobileCoursePage />} />
      </Routes>
    </Router>
  );
}

export default App;
