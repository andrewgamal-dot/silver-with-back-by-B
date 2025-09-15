import React, { useState, useEffect } from 'react';
import './MobileNavigation.css';

const MobileNavigation = ({ onNavigate, activeSection, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (sectionId) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <div className={`mobile-navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="mobile-nav-content">
        <div className="mobile-logo">
          <span className="mobile-logo-text">Silver Code Line</span>
        </div>
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <button 
            onClick={() => handleNavigate('home')} 
            className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigate('roadmaps')} 
            className={`mobile-nav-link ${activeSection === 'roadmaps' ? 'active' : ''}`}
          >
            Roadmaps
          </button>
          <button 
            onClick={() => handleNavigate('blog')} 
            className={`mobile-nav-link ${activeSection === 'blog' ? 'active' : ''}`}
          >
            Blog
          </button>
          <button 
            onClick={() => handleNavigate('resources')} 
            className={`mobile-nav-link ${activeSection === 'resources' ? 'active' : ''}`}
          >
            Resources
          </button>
          <button 
            onClick={() => handleNavigate('community')} 
            className={`mobile-nav-link ${activeSection === 'community' ? 'active' : ''}`}
          >
            Community
          </button>
        </nav>
        <div className="mobile-auth-buttons">
          <button className="mobile-btn-login" onClick={() => {
            onNavigate('login');
            setIsOpen(false);
          }}>
            Login
          </button>
          <button className="mobile-btn-signup" onClick={() => {
            onNavigate('signup');
            setIsOpen(false);
          }}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;